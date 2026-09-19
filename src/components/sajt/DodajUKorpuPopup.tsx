"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Dugme } from "@/components/core/Dugme";
import { OcenaZvezdicama } from "@/components/core/OcenaZvezdicama";
import { Podvuceno } from "@/components/core/Podvuceno";
import { Znacka } from "@/components/core/Znacka";
import { Unos } from "@/components/forms/Unos";
import { Kartica3D } from "@/components/sajt/Kartica3D";
import {
  cenaKartica,
  formatRSD,
  jedinicnaCena,
  MAX_KOLICINA,
  PRAG_BESPLATNE_DOSTAVE,
  PRAG_GRATIS_POKLONA,
} from "@/lib/cene";
import { ucitajGoogleMaps } from "@/lib/googleMaps";
import { validirajStavku, type Boja } from "@/lib/validacijaPorudzbine";

// Boja teksta na tamnoj (podrazumevanoj) pozadini popup-a — bela, osim
// pomoćnog teksta ispod "Naziv biznisa" koji ostaje u prigušenijoj nijansi
// (vidi help prop na <Unos> ispod, tamo se ne koristi ova konstanta).
const TEKST_TAMNO = "text-white";

const BOJE: { vrednost: Boja; naziv: string }[] = [
  { vrednost: "bela", naziv: "Beli" },
  { vrednost: "crna", naziv: "Crni" },
];

// Ušteda se, isto kao u Cenovnik.tsx, računa u odnosu na cenu pojedinačnog
// (1 kom) stalka.
const CENA_JEDNE = jedinicnaCena(1);

// Čisto vizuelna precrtana "bila" cena za 1 stalak (sidrena cena, isti trik
// kao kod konkurencije) — NE menja stvarnu cenu (CENA_JEDNE/cene.ts ostaju
// netaknuti), samo se prikazuje precrtana ovde u popup-u.
const CENA_PRVOBITNA_ZA_JEDAN = 3790;

export function DodajUKorpuPopup({
  otvoren,
  pocetnaKolicina,
  onClose,
  onDodaj,
}: {
  otvoren: boolean;
  pocetnaKolicina: number;
  onClose: () => void;
  onDodaj: (stavka: {
    boja: Boja;
    kolicina: number;
    nazivBiznisa: string;
    googlePlaceId?: string;
  }) => void;
}) {
  const [boja, setBoja] = useState<Boja>("bela");
  const [kolicina, setKolicina] = useState(1);
  const [nazivBiznisa, setNazivBiznisa] = useState("");
  const [googlePlaceId, setGooglePlaceId] = useState<string | undefined>(undefined);
  const [greske, setGreske] = useState<Partial<Record<"kolicina" | "nazivBiznisa", string>>>({});
  const nazivInputRef = useRef<HTMLInputElement>(null);
  const autocompleteZakacenRef = useRef(false);

  // Mobilna slika stalka (19.09.2026., eksplicitno traženo — "velicine kao
  // u card sekciji") — isti obrazac (izmeri dostupnu širinu, pa računaj
  // kvadratni Kartica3D omotač UNAZAD preko 848/1401 razmera vidljive
  // kartice, ×0.8) kao PocetnaStranica.tsx-ov sirinaMobilneKartice; ne može
  // se deliti direktno (drugi fajl/komponenta), ali je formula identična pa
  // rezultat izgleda isto na sličnoj širini kolone.
  const RAZMER_KARTICE_U_KVADRATU = 848 / 1401;
  const mobilnaSlikaRef = useRef<HTMLDivElement>(null);
  const [sirinaMobilneSlike, setSirinaMobilneSlike] = useState(335);
  // ResizeObserver, ne efekat+resize-listener (za razliku od hero/CARD, koji
  // su uvek u normalnom toku stranice) — popup ostaje montiran u DOM-u i
  // dok je <dialog> zatvoren (Modal.tsx samo zove showModal()/close() u
  // SVOM efektu), a zatvoren <dialog> ne renderuje svoju decu (offsetWidth
  // je 0). Efekat koji samo zavisi od "otvoren" i meri JEDNOM odmah i dalje
  // je pogrešno tempiran — React izvršava efekat DETETA (ovaj) PRE efekta
  // RODITELJA (Modal.tsx-ov showModal() poziv), pa bi merenje uhvatilo
  // dialog dok je još zatvoren (potvrđeno uživo: 0px). ResizeObserver ne
  // zavisi od redosleda efekata — sam se okine čim element STVARNO dobije
  // nenultu veličinu (kad showModal() stvarno izvrši), i dalje prati resize.
  useEffect(() => {
    if (!otvoren || !mobilnaSlikaRef.current) return;
    const el = mobilnaSlikaRef.current;
    const izmeri = () => setSirinaMobilneSlike(el.offsetWidth);
    izmeri();
    const posmatrac = new ResizeObserver(izmeri);
    posmatrac.observe(el);
    return () => posmatrac.disconnect();
  }, [otvoren]);
  const sirinaMobilneKartice = Math.round((sirinaMobilneSlike / RAZMER_KARTICE_U_KVADRATU) * 0.8);

  // Popup ostaje montiran (Modal samo pokazuje/sakriva <dialog>), pa se
  // interno stanje mora ručno resetovati svaki put kad se ponovo otvori —
  // inače bi ostala stara boja/naziv/greške od prethodnog otvaranja.
  useEffect(() => {
    if (otvoren) {
      setBoja("bela");
      setKolicina(pocetnaKolicina);
      setNazivBiznisa("");
      setGooglePlaceId(undefined);
      setGreske({});
    }
  }, [otvoren, pocetnaKolicina]);

  // Google Places Autocomplete na polju "Naziv biznisa" — kači se SAMO
  // jednom na dati input (autocompleteZakacenRef), jer popup ostaje montiran
  // između otvaranja (Modal samo sakriva <dialog>), pa bi ponovno kačenje na
  // svako otvaranje nagomilalo duplirane listener-e. Skripta se učitava tek
  // kad se popup prvi put otvori, ne pri učitavanju cele stranice.
  //
  // NAMERNO ISKLJUČENO (16.09.2026.) — Google Cloud billing za projekat
  // "daj-peticu" još nije aktiviran (čeka se $30 jednokratni depozit), pa
  // poziv ka Places API-ju vraća BillingNotEnabledMapError i Google sam
  // ubacuje sopstveni popup "Ova stranica ne može ispravno da učita Google
  // mape" preko celog sajta. Kod ispod je gotov i testiran (kačenje na ref,
  // hvatanje place_id, čišćenje) — samo se ponovo uključi (izbriši ovaj
  // early return) tik pred lansiranje sajta, pošto billing bude sređen.
  const PLACES_AUTOCOMPLETE_UKLJUCEN = false;
  useEffect(() => {
    if (!PLACES_AUTOCOMPLETE_UKLJUCEN) return;
    if (!otvoren || autocompleteZakacenRef.current) return;
    const el = nazivInputRef.current;
    if (!el) return;

    let otkazano = false;
    ucitajGoogleMaps()
      .then(() => {
        if (otkazano || autocompleteZakacenRef.current) return;
        autocompleteZakacenRef.current = true;
        const autocomplete = new google.maps.places.Autocomplete(el, {
          types: ["establishment"],
          componentRestrictions: { country: "rs" },
          fields: ["place_id", "name"],
        });
        autocomplete.addListener("place_changed", () => {
          const mesto = autocomplete.getPlace();
          if (mesto.name) setNazivBiznisa(mesto.name);
          setGooglePlaceId(mesto.place_id);
        });
      })
      .catch((greska) => {
        // Tiho beleženje — polje i dalje radi kao obično tekstualno polje bez
        // predloga, ne blokira porudžbinu ako Google Maps ne uspe da se učita.
        console.error("Google Places Autocomplete nije uspeo da se učita:", greska);
      });

    return () => {
      otkazano = true;
    };
  }, [otvoren]);

  // Dozvoljava kucanje količine preko tastature — dok korisnik briše cifre
  // polje sme kratko biti prazno (ne guramo ga odmah na 1), a tek na blur se
  // vrednost konačno steže u opseg [1, MAX_KOLICINA].
  const naPromenuKolicine = (e: ChangeEvent<HTMLInputElement>) => {
    const cifre = e.target.value.replace(/\D/g, "");
    if (cifre === "") {
      setKolicina(0);
      return;
    }
    setKolicina(Math.min(MAX_KOLICINA, parseInt(cifre, 10)));
  };
  const naGubitakFokusaKolicine = () => {
    setKolicina((k) => Math.min(MAX_KOLICINA, Math.max(1, k)));
  };

  const potvrdi = () => {
    const nove = validirajStavku({ kolicina, nazivBiznisa });
    if (Object.keys(nove).length) {
      setGreske(nove);
      return;
    }
    onDodaj({ boja, kolicina, nazivBiznisa: nazivBiznisa.trim(), googlePlaceId });
  };

  // Fiksna tamnozelena tema sa zlatnim akcentima (isti jezik kao "card"
  // sekcija na početnoj), bez obzira na izabranu boju stalka — probali smo
  // da pozadina prati boju stalka, ali je promena pri svakom kliku delovala
  // ometajuće usred porudžbine, pa je tema sad fiksna.
  const tamno = true;

  return (
    <div
      className={`relative grid min-h-[100dvh] grid-cols-1 md:grid-cols-2 ${tamno ? "bg-[var(--color-bg-inverse)]" : "bg-white"}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Zatvori"
        className={`absolute top-6 right-6 z-10 grid h-12 w-12 place-items-center border-0 bg-none outline-none focus:outline-none focus-visible:outline-none transition-transform duration-200 hover:scale-110 ${tamno ? "text-[var(--color-gold)]" : "text-primary"}`}
      >
        <X size={36} strokeWidth={2.25} />
      </button>

      {/* Leva strana — slika stalka, isti sjaj kao "card" sekcija na
          početnoj ali pojačan (dva sloja radial-gradient-a — svetlije jezgro
          uz kartu, širi bleđi zamah oko nje) jer se ovde oslanja isključivo
          na sjaj za kontrast sa tamnom pozadinom, bez okolnih svetlih
          elemenata koje card sekcija ima. Sakrivena na uskim ekranima, ovo
          je desktop-prvi raspored. `sticky top-0` + `self-start` — bez
          self-start bi grid rastegao ovu kolonu na visinu čitavog reda
          (koju određuje viša desna kolona), pa sticky ne bi imao "sobe" da
          se pomera; sa self-start kolona ostaje h-screen visoka i sticky
          je stvarno prati kroz ostatak skrola dok se <dialog> (Modal.tsx)
          skroluje kao celina. */}
      <div className="relative top-0 hidden h-screen items-center justify-center self-start overflow-hidden md:sticky md:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 40% at 50% 45%, rgba(255,197,61,0.4), transparent 70%), radial-gradient(65% 65% at 50% 45%, rgba(255,197,61,0.2), transparent 78%)",
          }}
        />
        <div className="relative h-[77%] max-h-[704px]" style={{ aspectRatio: "848 / 1401" }}>
          <Image
            key={boja}
            src={boja === "crna" ? "/images/stalak_crni.webp" : "/images/stalak_beli.webp"}
            alt={boja === "crna" ? "Crni Daj Peticu NFC stalak" : "Beli Daj Peticu NFC stalak"}
            fill
            sizes="500px"
            quality={90}
            className="object-contain"
            style={{ animation: "dp-slika-pojava 420ms cubic-bezier(.2,.7,.3,1)" }}
          />
        </div>
      </div>

      {/* Desna strana — izbor. Raste prirodno sa sadržajem; <dialog>
          (Modal.tsx) skroluje ceo popup kao celinu kad ne stane u ekran, a
          leva kolona (slika) je "sticky" pa prati taj skrol. */}
      <div className="flex flex-col gap-6 p-6 sm:p-10 md:p-14">
        <h2
          className={`m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading ${tamno ? "text-white" : "text-text-strong"}`}
        >
          <Podvuceno>Poruči stalak</Podvuceno>
        </h2>

        {/* Stack umesto reda, isti stil kao hero sekcija na mobilnom
            (19.09.2026., eksplicitno traženo) — zvezdice iznad, tekst
            ispod, levo poravnato. md: vraća originalni red-pored-reda
            raspored za desktop popup prikaz (nepromenjen). */}
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-2.5">
          <OcenaZvezdicama velicina={22} />
          <span className={`font-tekst text-body-sm ${tamno ? TEKST_TAMNO : "text-text-muted"}`}>
            Poruči za 1 minut, stiže poštom. Plaćate pouzećem.
          </span>
        </div>

        {/* Slika stalka na mobilnom (19.09.2026., eksplicitno traženo —
            "velicine kao u card sekciji", menja se sa izabranom bojom).
            Desktop već ima svoju sopstvenu (sticky, levu kolonu) sliku —
            ova je md:hidden da se ne duplira. */}
        <div ref={mobilnaSlikaRef} className="w-full overflow-hidden md:hidden">
          <Kartica3D
            key={boja}
            sirina={sirinaMobilneKartice}
            slika={boja === "crna" ? "/images/stalak_crni.webp" : "/images/stalak_beli.webp"}
            className="relative left-1/2 -translate-x-1/2"
            interaktivna={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={`font-tekst text-body-sm font-medium ${tamno ? TEKST_TAMNO : "text-text-body"}`}>
            Boja stalka
          </span>
          <div className="grid grid-cols-2 gap-3">
            {BOJE.map((b) => (
              <button
                key={b.vrednost}
                type="button"
                onClick={() => setBoja(b.vrednost)}
                aria-pressed={boja === b.vrednost}
                className={`inline-flex items-center justify-center gap-2.5 rounded-field border-2 px-4 py-3 font-tekst text-body transition-[border-color,background,color] duration-200 ${
                  boja === b.vrednost
                    ? tamno
                      ? `border-[var(--color-gold)] bg-[rgba(255,197,61,0.14)] ${TEKST_TAMNO}`
                      : "border-primary bg-primary-quiet text-primary"
                    : tamno
                      ? `border-[rgba(191,227,208,0.35)] bg-transparent ${TEKST_TAMNO} hover:border-[rgba(191,227,208,0.6)]`
                      : "border-border bg-surface-0 text-text-body hover:border-border-strong"
                }`}
              >
                <span aria-hidden="true" className="relative h-12 w-8 shrink-0 overflow-hidden">
                  <Image
                    src={b.vrednost === "crna" ? "/images/stalak_crni.webp" : "/images/stalak_beli.webp"}
                    alt=""
                    fill
                    sizes="96px"
                    quality={90}
                    className="object-contain"
                  />
                </span>
                {b.naziv}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div
            className={`flex flex-wrap items-center justify-between gap-4 rounded-field p-5 ${tamno ? "bg-[rgba(255,197,61,0.08)]" : "bg-surface-2"}`}
          >
            <span className={`font-tekst text-body-sm font-medium ${tamno ? TEKST_TAMNO : "text-text-body"}`}>
              Količina
            </span>
            <div className="flex items-center gap-3">
              <Dugme
                type="button"
                variant="outline"
                size="xs"
                aria-label="Manje stalaka"
                className={`h-11 w-11 min-w-0 px-0 ${tamno ? "!border-[var(--color-gold)] !text-[var(--color-gold)] hover:!bg-[rgba(255,197,61,0.12)]" : ""}`}
                onClick={() => setKolicina((k) => Math.max(1, k - 1))}
              >
                −
              </Dugme>
              <input
                type="text"
                inputMode="numeric"
                aria-label="Količina"
                value={kolicina === 0 ? "" : kolicina}
                onChange={naPromenuKolicine}
                onBlur={naGubitakFokusaKolicine}
                className={`w-[2.2em] border-0 bg-transparent text-center font-prikaz text-h3 outline-none ${tamno ? TEKST_TAMNO : "text-text-strong"}`}
              />
              <Dugme
                type="button"
                variant="outline"
                size="xs"
                aria-label="Više stalaka"
                className={`h-11 w-11 min-w-0 px-0 ${tamno ? "!border-[var(--color-gold)] !text-[var(--color-gold)] hover:!bg-[rgba(255,197,61,0.12)]" : ""}`}
                onClick={() => setKolicina((k) => Math.min(MAX_KOLICINA, k + 1))}
              >
                +
              </Dugme>
            </div>
          </div>
          <div
            className={`flex min-h-7 flex-wrap items-center justify-between gap-2 px-1 font-tekst text-body-sm ${tamno ? TEKST_TAMNO : "text-text-muted"}`}
          >
            <span>
              Cena:{" "}
              {kolicina <= 1 && (
                <span className="mr-1.5 line-through opacity-70">{formatRSD(CENA_PRVOBITNA_ZA_JEDAN)}</span>
              )}
              {formatRSD(cenaKartica(kolicina || 1))}
              {kolicina > 1 && (
                <span className="ml-1.5 opacity-70">
                  (<span className="line-through">{formatRSD(CENA_JEDNE)}</span>{" "}
                  {formatRSD(jedinicnaCena(kolicina))}/kom)
                </span>
              )}
            </span>
            {kolicina > 1 && (
              <Znacka className="!bg-primary !text-white">
                Ušteda {formatRSD((CENA_JEDNE - jedinicnaCena(kolicina)) * kolicina)}
              </Znacka>
            )}
          </div>
          {/* Podsticaj na veću porudžbinu — isti pragovi koje ukupnoKorpa()
              zaista primenjuje (lib/cene.ts), pa poruka nikad ne obeća nešto
              što se ne naplati tačno tako u korpi. Ispod 2 kom samo tekst;
              od 2 kom na dalje red sa ikonicom za svaku otključanu pogodnost. */}
          {kolicina < PRAG_BESPLATNE_DOSTAVE ? (
            <div className="flex items-center gap-2 px-1">
              <span className="flex w-7 shrink-0 items-center justify-center">
                <Image src="/images/shipping_box.png" alt="" width={18} height={18} />
              </span>
              <span className={`font-tekst text-caption ${tamno ? "text-white" : "text-text-muted"}`}>
                {`Dodaj još ${PRAG_BESPLATNE_DOSTAVE - kolicina} za besplatnu dostavu.`}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 px-1">
              {kolicina < PRAG_GRATIS_POKLONA && (
                <div className="flex items-center gap-2">
                  <span className="flex w-7 shrink-0 items-center justify-center">
                    <Image src="/images/gift_icon.png" alt="" width={18} height={18} />
                  </span>
                  <span className={`font-tekst text-caption ${tamno ? "text-white" : "text-text-muted"}`}>
                    Dodaj još jednu za gratis Google karticu.
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="flex w-7 shrink-0 items-center justify-center">
                  <Image src="/images/shipping_box.png" alt="" width={22} height={22} />
                </span>
                <span className={`font-tekst text-body-sm font-medium ${tamno ? "text-white" : "text-text-body"}`}>
                  Besplatna dostava
                </span>
              </div>
              {kolicina >= PRAG_GRATIS_POKLONA && (
                <div className="flex items-center gap-2">
                  <span className="flex w-7 shrink-0 items-center justify-center">
                    <Image src="/images/gift_icon.png" alt="" width={22} height={22} />
                  </span>
                  <span className={`font-tekst text-body-sm font-medium ${tamno ? "text-white" : "text-text-body"}`}>
                    Gratis Google kartica
                  </span>
                </div>
              )}
            </div>
          )}
          {greske.kolicina && <span className="text-caption text-danger">{greske.kolicina}</span>}
        </div>

        <Unos
          ref={nazivInputRef}
          enterZatvara
          label="Naziv biznisa"
          name="nazivBiznisa"
          value={nazivBiznisa}
          error={greske.nazivBiznisa}
          onChange={(e) => {
            setNazivBiznisa(e.target.value);
            // Ručna izmena teksta posle biranja predloga — stari Place ID
            // više ne odgovara tekstu, ne treba da "preživi" u porudžbini.
            setGooglePlaceId(undefined);
          }}
          placeholder="Unesite naziv vašeg biznisa"
          help="Koristimo ga da podesimo link na vašu Google stranu."
          tamno={tamno}
        />

        <Dugme size="lg" full variant={tamno ? "gold" : "outline"} onClick={potvrdi}>
          Dodaj u korpu
        </Dugme>
      </div>
    </div>
  );
}

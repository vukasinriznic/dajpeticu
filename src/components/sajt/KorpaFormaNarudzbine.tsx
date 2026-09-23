"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Dugme } from "@/components/core/Dugme";
import { Unos } from "@/components/forms/Unos";
import { Selekt } from "@/components/forms/Selekt";
import { useKorpa, type StavkaKorpe } from "@/components/sajt/KorpaKontekst";
import {
  cenaStavkeUKorpi,
  formatRSD,
  jedinicnaCena,
  jedinicnaCenaManjiPrikaz,
  kolicinaSlovima,
  PRAG_BESPLATNE_DOSTAVE_RSD,
  PRAG_GRATIS_VECI_STALAK,
  PRAG_GRATIS_MANJI_STALAK,
  ukupnaKolicinaManjihUKorpi,
  ukupnaKolicinaVecihUKorpi,
} from "@/lib/cene";
import { validirajPorudzbinu, validirajUkupnuKolicinu } from "@/lib/validacijaPorudzbine";
import { slikaProizvoda, opticnaKorekcijaSkalaKorpa } from "@/lib/proizvod";

// Cena po jedinici bez popusta na količinu — isti anchor kao u
// DodajUKorpuPopup.tsx, da se vidi ušteda i ovde u pregledu. Odvojeno za
// veći i manji stalak, svaki ima sopstveni cenovnik. Prvobitne ("bile")
// cene za 1 komad — iste vrednosti kao u popupu/korpi.
const CENA_JEDNE = jedinicnaCena(1);
const CENA_JEDNE_MANJI = jedinicnaCenaManjiPrikaz(1);
const CENA_PRVOBITNA_ZA_JEDAN = 3800;
const CENA_PRVOBITNA_ZA_JEDAN_MANJI = 2900;

type Polja = {
  email: string;
  drzava: string;
  ime: string;
  prezime: string;
  pib: string;
  adresa: string;
  postanskiBroj: string;
  grad: string;
  telefon: string;
};

// Skida "+381" ili "00381" sa početka (razmaci/crtice se ignorišu pri
// poređenju) — ono što ostane je tačno ono što treba da stoji posle
// statičnog "+381" prefiksa u polju.
function skiniPozivniBroj(vrednost: string): string {
  const ociscen = vrednost.replace(/[\s-]/g, "");
  if (ociscen.startsWith("+381")) return ociscen.slice(4);
  if (ociscen.startsWith("00381")) return ociscen.slice(5);
  return vrednost;
}

// public/images/serbia_flag.png — kvadratna slika (64×64), pa se seče preko
// object-cover u pravougaoni oblik zastave umesto da se razvuče.
// unoptimized — Next-ov image optimizer ume da izgladi (quality:75, plus
// re-enkodovanje u webp) baš na ovakvoj sitnoj ikonici sa tankim linijama
// (kruna, krst), pa slika deluje mutno; izvor je već mali (64×64), nema
// šta da se uštedi optimizacijom, samo se gubi oštrina.
function ZastavaSrbije() {
  return (
    <span className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px]">
      <Image src="/images/serbia_flag.png" alt="" fill sizes="20px" unoptimized className="object-cover" />
    </span>
  );
}

const PRAZNA_POLJA: Polja = {
  email: "",
  drzava: "Srbija",
  ime: "",
  prezime: "",
  pib: "",
  adresa: "",
  postanskiBroj: "",
  grad: "",
  telefon: "",
};

// Tamnozelena/zlatna tema, po ugledu na DodajUKorpuPopup.tsx — jedina
// upotreba ovog fajla je /placanje. stavke/ukupnaKolicina/ukupnaCena stižu
// kao props (ne direktno iz useKorpa()) — roditelj (placanje/page.tsx) drži
// poslednji NEPRAZAN snimak korpe, da prikaz ne "trepne" praznim stanjem u
// deliću sekunde dok traje redirekcija na početnu posle pražnjenja korpe.
export function KorpaFormaNarudzbine({
  stavke,
  ukupnaCena,
  onUspeh,
}: {
  stavke: StavkaKorpe[];
  ukupnaCena: number;
  onUspeh: (payload: { telefon: string; id: string; ukupnaCena: number }) => void;
}) {
  const { isprazniKorpu } = useKorpa();
  const [polja, setPolja] = useState<Polja>(PRAZNA_POLJA);
  const [honeypot, setHoneypot] = useState("");
  const [greske, setGreske] = useState<Partial<Record<keyof Polja, string>>>({});
  const [opstaGreska, setOpstaGreska] = useState("");
  const [saljemo, setSaljemo] = useState(false);

  const azurirajPolje = (name: keyof Polja, value: string) => {
    setPolja((p) => ({ ...p, [name]: value }));
    setGreske((g) => {
      if (!(name in g)) return g;
      const kopija = { ...g };
      delete kopija[name];
      return kopija;
    });
  };

  const onPolje = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Telefon polje već ima statičan "+381" prefiks ispred input-a — browser
    // autofill (adresar, sačuvani podaci) ume da ubaci ceo broj SA
    // pozivnim brojem, pa bi se +381 video dva puta. Skida se ovde, na
    // ulazu, umesto u prikazu, da validacija/slanje uvek vide isti oblik.
    azurirajPolje(name as keyof Polja, name === "telefon" ? skiniPozivniBroj(value) : value);
  };

  const posalji = async (e: FormEvent) => {
    e.preventDefault();
    const greskaKolicine = validirajUkupnuKolicinu(stavke);
    if (greskaKolicine) {
      setOpstaGreska(greskaKolicine);
      return;
    }
    const nove = validirajPorudzbinu({ ...polja, stavke });
    if (Object.keys(nove).length) {
      setGreske(nove);
      const prvo = document.querySelector<HTMLElement>(`[name="${Object.keys(nove)[0]}"]`);
      prvo?.focus();
      return;
    }
    setGreske({});
    setOpstaGreska("");
    setSaljemo(true);
    try {
      const res = await fetch("/api/porudzbine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...polja, stavke, web: honeypot }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.greske) setGreske(json.greske);
        setOpstaGreska(json.greske?.opsta || "Greška na serveru, pokušajte ponovo.");
        return;
      }
      // isprazniKorpu() PRE onUspeh() bi u roditelju (koji drži i stavke i
      // uspešnu porudžbinu) na trenutak prikazao "korpa je prazna" umesto
      // potvrde — zato roditelj prvo upamti uspeh, pa tek onda ovaj poziv
      // isprazni korpu; redosled je bitan.
      onUspeh({ telefon: polja.telefon, id: String(json.id), ukupnaCena: Number(json.ukupnaCena) });
      isprazniKorpu();
    } catch {
      setOpstaGreska("Nismo uspeli da pošaljemo porudžbinu. Proverite internet i pokušajte ponovo.");
    } finally {
      setSaljemo(false);
    }
  };

  return (
    <form onSubmit={posalji} className="flex flex-col gap-6">
      <Unos
        label="Email"
        name="email"
        type="email"
        value={polja.email}
        error={greske.email}
        onChange={onPolje}
        autoComplete="email"
        tamno
      />
      <Selekt
        label="Država"
        name="drzava"
        value={polja.drzava}
        onChange={(v) => azurirajPolje("drzava", v)}
        options={[{ value: "Srbija", label: "Srbija", ikonica: <ZastavaSrbije /> }]}
        tamno
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Unos
          label="Ime"
          name="ime"
          value={polja.ime}
          error={greske.ime}
          onChange={onPolje}
          autoComplete="given-name"
          tamno
        />
        <Unos
          label="Prezime"
          name="prezime"
          value={polja.prezime}
          error={greske.prezime}
          onChange={onPolje}
          autoComplete="family-name"
          tamno
        />
      </div>
      <Unos
        label="PIB"
        name="pib"
        value={polja.pib}
        error={greske.pib}
        onChange={onPolje}
        help="Obavezno ako plaćate kao firma."
        tamno
      />
      <Unos
        label="Adresa za dostavu"
        name="adresa"
        value={polja.adresa}
        error={greske.adresa}
        onChange={onPolje}
        autoComplete="street-address"
        tamno
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Unos
          label="Poštanski broj"
          name="postanskiBroj"
          value={polja.postanskiBroj}
          error={greske.postanskiBroj}
          onChange={onPolje}
          inputMode="numeric"
          tamno
        />
        <Unos
          label="Grad"
          name="grad"
          value={polja.grad}
          error={greske.grad}
          onChange={onPolje}
          autoComplete="address-level2"
          tamno
        />
      </div>
      <Unos
        label="Telefon"
        name="telefon"
        type="tel"
        value={polja.telefon}
        error={greske.telefon}
        onChange={onPolje}
        prefix="+381"
        autoComplete="tel"
        tamno
      />

      {/* Honeypot — vizuelno van ekrana, pravi korisnici ga ne vide ni ne
          popune. Ime polja namerno ne sadrži reč "honeypot". */}
      <input
        type="text"
        name="web"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-col gap-2 rounded-field bg-[rgba(255,197,61,0.08)] p-5">
        {stavke.map((s) => (
          <div key={s.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4 font-tekst text-body text-white">
              <span className="flex items-center gap-3">
                <span className="relative h-12 w-8 shrink-0 overflow-hidden">
                  <Image
                    src={slikaProizvoda(s.velicina, s.boja)}
                    alt=""
                    fill
                    sizes="96px"
                    quality={90}
                    className="object-contain"
                    style={{ transform: `scale(${opticnaKorekcijaSkalaKorpa(s.velicina, s.boja)})` }}
                  />
                </span>
                {kolicinaSlovima(s.kolicina)} ({s.velicina === "manji" ? "manji" : "veći"}, {s.boja === "crna" ? "crni" : "beli"})
              </span>
              <span className="font-normal">
                {(() => {
                  const cena = cenaStavkeUKorpi(stavke, s);
                  const ukupnaKolicinaIsteVelicine = stavke
                    .filter((x) => x.velicina === s.velicina)
                    .reduce((z, x) => z + x.kolicina, 0);
                  const jedanKomad = ukupnaKolicinaIsteVelicine <= 1;
                  const precrtana =
                    s.velicina === "manji"
                      ? (jedanKomad ? CENA_PRVOBITNA_ZA_JEDAN_MANJI : CENA_JEDNE_MANJI) * s.kolicina
                      : (jedanKomad ? CENA_PRVOBITNA_ZA_JEDAN : CENA_JEDNE) * s.kolicina;
                  return (
                    <>
                      {precrtana > cena && (
                        <span className="mr-1.5 text-caption line-through opacity-70">
                          {formatRSD(precrtana)}
                        </span>
                      )}
                      {formatRSD(cena)}
                    </>
                  );
                })()}
              </span>
            </div>
            {/* Naziv biznisa se ovde vezuje za konkretan stalak na koji se
                odnosi (svaka stavka u korpi nosi svoj naziv) — u
                KorpaDrawer.tsx/KorpaStavka.tsx se više ne prikazuje, samo
                ovde gde ima prostora da bude jasno uz koji red ide.
                Bez levog razmaka — alignovano sa slikom stalka iznad, ne sa
                tekstom pored nje. */}
            <span className="font-tekst text-body-sm text-[rgba(191,227,208,0.75)]">
              Za biznis: {s.nazivBiznisa}
            </span>
          </div>
        ))}
        {/* Isti obrazac kao u KorpaDrawer.tsx — na maloj korpi kupac
            poštarinu plaća kuriru (uslovi) i ne pominje se, iznad praga po
            CENI (24.09.2026., bilo po količini) pogodnosti se nabrajaju sa
            ikonicama umesto stare precrtane cene. */}
        {(() => {
          const imaDostavu = ukupnaCena > PRAG_BESPLATNE_DOSTAVE_RSD;
          const imaVeciStalak = ukupnaKolicinaManjihUKorpi(stavke) >= PRAG_GRATIS_VECI_STALAK;
          const imaManjiStalak = ukupnaKolicinaVecihUKorpi(stavke) >= PRAG_GRATIS_MANJI_STALAK;
          const imaIkakvuPogodnost = imaDostavu || imaVeciStalak || imaManjiStalak;
          return (
            <>
              {imaIkakvuPogodnost && (
                <div className="flex flex-col gap-1.5">
                  {imaDostavu && (
                    <div className="flex items-center gap-2">
                      <span className="flex w-7 shrink-0 items-center justify-center">
                        <Image src="/images/shipping_box.png" alt="" width={18} height={18} />
                      </span>
                      <span className="font-tekst text-body font-medium text-white">Besplatna poštarina</span>
                    </div>
                  )}
                  {imaVeciStalak && (
                    <div className="flex items-center gap-2">
                      <span className="flex w-7 shrink-0 items-center justify-center">
                        <Image src="/images/gift_icon.png" alt="" width={18} height={18} />
                      </span>
                      <span className="font-tekst text-body font-medium text-white">Gratis veći stalak</span>
                    </div>
                  )}
                  {imaManjiStalak && (
                    <div className="flex items-center gap-2">
                      <span className="flex w-7 shrink-0 items-center justify-center">
                        <Image src="/images/gift_icon.png" alt="" width={18} height={18} />
                      </span>
                      <span className="font-tekst text-body font-medium text-white">Gratis manji stalak</span>
                    </div>
                  )}
                </div>
              )}
              <div
                className={`mt-2 flex items-baseline justify-between gap-4 ${
                  imaIkakvuPogodnost ? "border-t border-[rgba(255,197,61,0.2)] pt-4" : ""
                }`}
              >
                <span className="font-tekst text-body font-normal text-white">Ukupno</span>
                <span className="font-prikaz text-h1 font-normal text-[var(--color-gold)]">
                  {formatRSD(ukupnaCena)}
                </span>
              </div>
            </>
          );
        })()}
      </div>

      {opstaGreska && (
        <p className="m-0 font-tekst text-body-sm text-[var(--color-danger)]">{opstaGreska}</p>
      )}

      <Dugme size="lg" full variant="gold" type="submit" disabled={saljemo}>
        {saljemo ? "Šaljemo..." : "Završi kupovinu"}
      </Dugme>
      <p className="m-0 text-center font-tekst text-caption text-[rgba(191,227,208,0.75)]">
        Plaćate pouzećem.
      </p>
    </form>
  );
}

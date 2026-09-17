"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Dugme } from "@/components/core/Dugme";
import { Unos } from "@/components/forms/Unos";
import { Selekt } from "@/components/forms/Selekt";
import { useKorpa } from "@/components/sajt/KorpaKontekst";
import {
  cenaKarticaZaStavku,
  formatRSD,
  jedinicnaCena,
  kolicinaSlovima,
  PRAG_BESPLATNE_DOSTAVE,
  PRAG_GRATIS_POKLONA,
} from "@/lib/cene";
import { validirajPorudzbinu, validirajUkupnuKolicinu } from "@/lib/validacijaPorudzbine";

// Cena po jedinici bez popusta na količinu — isti anchor kao u
// DodajUKorpuPopup.tsx, da se vidi ušteda i ovde u pregledu.
const CENA_JEDNE = jedinicnaCena(1);

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

// public/serbia_flag.png — kvadratna slika (64×64), pa se seče preko
// object-cover u pravougaoni oblik zastave umesto da se razvuče.
// unoptimized — Next-ov image optimizer ume da izgladi (quality:75, plus
// re-enkodovanje u webp) baš na ovakvoj sitnoj ikonici sa tankim linijama
// (kruna, krst), pa slika deluje mutno; izvor je već mali (64×64), nema
// šta da se uštedi optimizacijom, samo se gubi oštrina.
function ZastavaSrbije() {
  return (
    <span className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px]">
      <Image src="/serbia_flag.png" alt="" fill sizes="20px" unoptimized className="object-cover" />
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
// upotreba ovog fajla je /placanje.
export function KorpaFormaNarudzbine({
  onUspeh,
}: {
  onUspeh: (payload: { ukupnaCena: number; telefon: string }) => void;
}) {
  const { stavke, ukupnaKolicina, ukupnaCena, isprazniKorpu } = useKorpa();
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
      onUspeh({ ukupnaCena: json.ukupnaCena, telefon: polja.telefon });
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
                    src={s.boja === "crna" ? "/stalak_crni.png" : "/stalak_beli.png"}
                    alt=""
                    fill
                    sizes="32px"
                    quality={90}
                    className="object-contain"
                  />
                </span>
                {kolicinaSlovima(s.kolicina)} ({s.boja === "crna" ? "crni" : "beli"})
              </span>
              <span className="font-normal">
                {CENA_JEDNE * s.kolicina > cenaKarticaZaStavku(ukupnaKolicina, s.kolicina) && (
                  <span className="mr-1.5 text-caption line-through opacity-70">
                    {formatRSD(CENA_JEDNE * s.kolicina)}
                  </span>
                )}
                {formatRSD(cenaKarticaZaStavku(ukupnaKolicina, s.kolicina))}
              </span>
            </div>
            {/* Naziv biznisa se ovde vezuje za konkretan stalak na koji se
                odnosi (svaka stavka u korpi nosi svoj naziv) — u
                KorpaDrawer.tsx/KorpaStavka.tsx se više ne prikazuje, samo
                ovde gde ima prostora da bude jasno uz koji red ide. */}
            <span className="pl-11 font-tekst text-body-sm text-[rgba(191,227,208,0.75)]">
              Za: {s.nazivBiznisa}
            </span>
          </div>
        ))}
        {/* Isti obrazac kao u KorpaDrawer.tsx — na 1 kartici se poštarina
            naplaćuje ali se ne pominje, od 2 kartice pogodnosti se
            nabrajaju sa ikonicama umesto stare precrtane cene. */}
        {ukupnaKolicina >= PRAG_BESPLATNE_DOSTAVE && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="flex w-7 shrink-0 items-center justify-center">
                <Image src="/shipping_box.png" alt="" width={18} height={18} />
              </span>
              <span className="font-tekst text-body font-medium text-white">Besplatna poštarina</span>
            </div>
            {ukupnaKolicina >= PRAG_GRATIS_POKLONA && (
              <div className="flex items-center gap-2">
                <span className="flex w-7 shrink-0 items-center justify-center">
                  <Image src="/gift_icon.png" alt="" width={18} height={18} />
                </span>
                <span className="font-tekst text-body font-medium text-white">Gratis Google kartica</span>
              </div>
            )}
          </div>
        )}
        <div
          className={`mt-2 flex items-baseline justify-between gap-4 ${
            ukupnaKolicina >= PRAG_BESPLATNE_DOSTAVE ? "border-t border-[rgba(255,197,61,0.2)] pt-4" : ""
          }`}
        >
          <span className="font-tekst text-body font-normal text-white">Ukupno</span>
          <span className="font-prikaz text-h1 font-normal text-[var(--color-gold)]">
            {formatRSD(ukupnaCena)}
          </span>
        </div>
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

import { Banknote, Nfc, ShieldCheck, Smartphone, type LucideIcon } from "lucide-react";
import { KarticaPogodnosti } from "@/components/marketing/KarticaPogodnosti";
import { MaketaKartice } from "@/components/sajt/MaketaKartice";

const STAVKE: { ikonica: LucideIcon; naslov: string; opis: string }[] = [
  {
    ikonica: Nfc,
    naslov: "Telefon je sam prepozna",
    opis: "Nema kamere, nema QR koda, nema linka koji se prepisuje.",
  },
  {
    ikonica: Smartphone,
    naslov: "Radi na svakom telefonu",
    opis: "iPhone 7 i noviji čitaju je bez ičega. Kod Androida je dovoljno da je NFC uključen.",
  },
  {
    ikonica: Banknote,
    naslov: "Jedna kupovina, bez pretplate",
    opis: "Nema baterije i nema mesečnih troškova. Traje godinama.",
  },
  {
    ikonica: ShieldCheck,
    naslov: "Mi je podesimo i zaključamo",
    opis: "Upišemo link vaše Google strane i zaključamo čip. Niko ga posle ne može preusmeriti.",
  },
];

// Pozicije u 900×540 platnu — dva callout-a gore, dva dole, kartica u centru.
const POZICIJE = [
  { levo: 8, gore: 6, poravnanje: "items-start text-left" },
  { desno: 8, gore: 6, poravnanje: "items-end text-right" },
  { levo: 8, dole: 6, poravnanje: "items-start text-left" },
  { desno: 8, dole: 6, poravnanje: "items-end text-right" },
] as const;

const LINIJE = [
  "M 250 128 Q 340 190 388 232",
  "M 650 128 Q 560 190 512 232",
  "M 250 412 Q 340 350 388 308",
  "M 650 412 Q 560 350 512 308",
];

function Oblacic({
  ikonica: Ikonica,
  naslov,
  opis,
  poravnanje,
}: {
  ikonica: LucideIcon;
  naslov: string;
  opis: string;
  poravnanje: string;
}) {
  return (
    <div className={`flex w-[240px] flex-col gap-2 ${poravnanje}`}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/12">
        <Ikonica size={20} strokeWidth={2} className="text-text-on-inverse" />
      </span>
      <h3 className="m-0 font-prikaz text-h3 leading-heading font-normal text-text-on-inverse">
        {naslov}
      </h3>
      <p className="m-0 font-tekst text-body-sm leading-body text-text-quiet-on-inverse">{opis}</p>
    </div>
  );
}

export function ZastoRadi() {
  return (
    <>
      {/* Desktop — kartica u centru, pogodnosti oko nje, povezane linijama. */}
      <div className="relative mx-auto hidden h-[540px] w-full max-w-[900px] lg:block">
        <svg
          viewBox="0 0 900 540"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {LINIJE.map((d) => (
            <path key={d} d={d} fill="none" stroke="rgb(255 255 255 / 0.22)" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <MaketaKartice sirina={230} ton="light" nagib={0} />
        </div>
        {STAVKE.map((s, i) => {
          const p = POZICIJE[i];
          return (
            <div
              key={s.naslov}
              className="absolute flex"
              style={{
                left: "levo" in p ? `${p.levo}%` : undefined,
                right: "desno" in p ? `${p.desno}%` : undefined,
                top: "gore" in p ? `${p.gore}%` : undefined,
                bottom: "dole" in p ? `${p.dole}%` : undefined,
              }}
            >
              <Oblacic ikonica={s.ikonica} naslov={s.naslov} opis={s.opis} poravnanje={p.poravnanje} />
            </div>
          );
        })}
      </div>

      {/* Mobilno/tablet — isti sadržaj, prost slog bez apsolutnog pozicioniranja. */}
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:hidden">
        {STAVKE.map((s) => (
          <KarticaPogodnosti key={s.naslov} ikonica={s.ikonica} naslov={s.naslov} ton="inverse">
            {s.opis}
          </KarticaPogodnosti>
        ))}
      </div>
    </>
  );
}

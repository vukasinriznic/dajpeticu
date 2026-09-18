"use client";

import { useEffect, useRef, useState } from "react";
import { Kartica } from "@/components/core/Kartica";
import { Dugme } from "@/components/core/Dugme";
import { OcenaZvezdicama } from "@/components/core/OcenaZvezdicama";
import { MaketaKartice } from "@/components/sajt/MaketaKartice";

const TRAJANJE = "3.6s cubic-bezier(.2,.7,.3,1) both";
// Najveća širina kartice na dovoljno širokom ekranu — na uskim telefonima se
// smanjuje (vidi useEffect ispod), inače bi fiksnih 300px "štrčalo" izvan
// kutije (koja na malom ekranu ima manje raspoloživog prostora zbog
// Sekcija/Kartica padding-a) i overflow-hidden bi je vidljivo odsekao sa
// obe strane.
const MAKS_SIRINA_KARTICE = 300;

export function DemoDodira() {
  const telefonRef = useRef<HTMLDivElement>(null);
  const formaRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<HTMLDivElement>(null);
  const pulsRef = useRef<HTMLDivElement>(null);
  const kutijaRef = useRef<HTMLDivElement>(null);
  const [sirinaKartice, setSirinaKartice] = useState(MAKS_SIRINA_KARTICE);

  useEffect(() => {
    const izmeri = () => {
      const k = kutijaRef.current;
      if (!k) return;
      // 48px (24px sa svake strane) sigurnosna margina da kartica ne
      // dodiruje ivice kutije čak i na najužim telefonima.
      setSirinaKartice(Math.min(MAKS_SIRINA_KARTICE, k.offsetWidth - 48));
    };
    izmeri();
    window.addEventListener("resize", izmeri);
    return () => window.removeEventListener("resize", izmeri);
  }, []);

  const pusti = () => {
    const parovi: [HTMLDivElement | null, string][] = [
      [telefonRef.current, "dp-tap"],
      [formaRef.current, "dp-show"],
      [idleRef.current, "dp-hide"],
      [pulsRef.current, "dp-pulse"],
    ];
    parovi.forEach(([el]) => el && (el.style.animation = "none"));
    void telefonRef.current?.offsetWidth;
    parovi.forEach(([el, ime]) => el && (el.style.animation = `${ime} ${TRAJANJE}`));
  };

  return (
    <Kartica pad="lg">
      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <h3 className="m-0 font-prikaz text-h2 leading-heading font-normal text-text-strong">
            Probajte i sami
          </h3>
          <p className="m-0 max-w-[34ch] font-tekst text-body text-text-body">
            Ovako to izgleda vašoj mušteriji, samo vrh telefona i stalak na pultu.
          </p>
          <Dugme variant="outline" onClick={pusti}>
            Prisloni telefon
          </Dugme>
        </div>

        <div
          ref={kutijaRef}
          onClick={pusti}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") pusti();
          }}
          className="relative h-[400px] cursor-pointer overflow-hidden rounded-image bg-surface-2"
        >
          <div
            ref={telefonRef}
            className="absolute top-2 left-1/2 z-[2] -ml-14 h-[146px] w-[112px] rounded-field border-[3px] border-ink-900 bg-ink-900"
          >
            <div className="absolute inset-[5px] overflow-hidden rounded-2xl bg-surface-0">
              <div
                ref={idleRef}
                className="absolute inset-0 grid place-items-center font-tekst text-caption font-normal text-text-muted"
              >
                NFC uključen
              </div>
              <div
                ref={formaRef}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center opacity-0"
              >
                <span className="text-caption text-text-muted">Ocenite lokal</span>
                <OcenaZvezdicama velicina={16} />
                <span className="rounded-button bg-primary px-3.5 py-1.5 text-caption font-normal text-text-on-primary">
                  Objavi
                </span>
              </div>
            </div>
          </div>
          <div
            ref={pulsRef}
            className="absolute top-[132px] left-1/2 z-[1] -ml-7 h-14 w-14 rounded-full border-2 border-primary opacity-0"
          />
          {/* Levi offset se računa iz STVARNE (dinamičke) širine kartice,
              ne fiksnih -150px — inače bi centriranje "pobeglo" čim se
              sirinaKartice smanji na uskom ekranu. */}
          <div className="absolute bottom-5 left-1/2" style={{ marginLeft: -sirinaKartice / 2 }}>
            <MaketaKartice sirina={sirinaKartice} ton="ink" nagib={0} />
          </div>
        </div>
      </div>
    </Kartica>
  );
}

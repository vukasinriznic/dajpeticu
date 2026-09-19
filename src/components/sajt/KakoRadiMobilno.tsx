"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { KORACI } from "@/components/sajt/KakoRadiScroll";

// Visina fiksnog headera (Zaglavlje.tsx) na mobilnom — sticky se lepi tik
// ispod njega, a vidljiva visina sekcije je ostatak ekrana.
const NAV_VISINA = 82;
// Koliko skrola (u svh) pripada jednom koraku. Manje od 100 — cilj je da
// sekcija ne oduzima previše skrola, a ipak da svaki korak "sleže".
const SKROL_PO_KORAKU_SVH = 50;

const UPIT_KRETANJA = "(prefers-reduced-motion: reduce)";
function pretplataKretanja(cb: () => void) {
  const mq = matchMedia(UPIT_KRETANJA);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

// Mobilna verzija "Kako radi" (19.09.2026.) — sticky "scrollytelling" kao i
// na desktopu (KakoRadiScroll.tsx), ali prilagođen telefonu: samo pokazivač
// koraka (horizontalni krugovi), tekst koraka i slika. Naslov/podnaslov sekcije
// ostaju IZNAD i skroluju se pre zaključavanja (manji telefoni nemaju mesta).
// Korak se menja preko cross-fade-a (opacity), bez pomeranja/parallaxa; stanje
// se postavlja SAMO kad se aktivan korak promeni, ne na svaki piksel skrola.
// Slike se ne seku (object-contain ponašanje) — uklapaju se u preostalu visinu.
export function KakoRadiMobilno() {
  const omotacRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  // Popuna linija između krugova ide direktno preko DOM-a (bez React stanja) —
  // kontinualno prati skrol kao na desktopu, bez re-rendera na svaki frame.
  const linijeRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [aktivan, setAktivan] = useState(0);
  const smanjenoKretanje = useSyncExternalStore(pretplataKretanja, () => matchMedia(UPIT_KRETANJA).matches, () => false);

  useEffect(() => {
    const omotac = omotacRef.current;
    const sticky = stickyRef.current;
    if (!omotac || !sticky) return;
    let uToku = false;
    const izracunaj = () => {
      uToku = false;
      const r = omotac.getBoundingClientRect();
      const putanja = r.height - sticky.offsetHeight;
      if (putanja <= 0) return;
      // Sticky počinje da "drži" kad vrh omotača dođe na NAV_VISINA.
      const p = Math.min(Math.max((NAV_VISINA - r.top) / putanja, 0), 1);
      const sirovi = p * KORACI.length;
      setAktivan(Math.min(Math.floor(sirovi), KORACI.length - 1));
      // Linija i izlazi iz kruga i (deo skrola koraka i) i stiže do kruga i+1
      // tačno kad on postane aktivan — isto kao linija na desktopu.
      linijeRef.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${Math.min(Math.max(sirovi - i, 0), 1)})`;
      });
    };
    const naSkrol = () => {
      if (uToku) return;
      uToku = true;
      requestAnimationFrame(izracunaj);
    };
    izracunaj();
    window.addEventListener("scroll", naSkrol, { passive: true });
    window.addEventListener("resize", naSkrol);
    return () => {
      window.removeEventListener("scroll", naSkrol);
      window.removeEventListener("resize", naSkrol);
    };
  }, []);

  // Klik na krug skroluje na sredinu tog koraka (obrnuto od izračuna iznad).
  const naKrug = (i: number) => {
    const omotac = omotacRef.current;
    const sticky = stickyRef.current;
    if (!omotac || !sticky) return;
    const r = omotac.getBoundingClientRect();
    const putanja = r.height - sticky.offsetHeight;
    const vrhOmotaca = window.scrollY + r.top;
    const cilj = vrhOmotaca - NAV_VISINA + ((i + 0.5) / KORACI.length) * putanja;
    window.scrollTo({ top: cilj, behavior: smanjenoKretanje ? "auto" : "smooth" });
  };

  const prelaz = smanjenoKretanje ? "" : "transition-opacity duration-500 ease-out";

  return (
    <div
      ref={omotacRef}
      className="relative lg:hidden"
      style={{
        height: `calc(100svh - ${NAV_VISINA}px + ${KORACI.length * SKROL_PO_KORAKU_SVH}svh)`,
      }}
    >
      <div
        ref={stickyRef}
        className="sticky flex flex-col gap-4 py-3"
        style={{ top: NAV_VISINA, height: `calc(100svh - ${NAV_VISINA}px)` }}
      >
        {/* Horizontalni pokazivač: krugovi 1–2–3 povezani linijom koja se
            popunjava kako koraci prolaze; krugovi su dugmad (skok na korak). */}
        <div className="flex items-center" aria-label="Koraci">
          {KORACI.map((korak, i) => {
            const zavrsen = i <= aktivan;
            return (
              <div key={korak.naslov} className={`flex items-center ${i < KORACI.length - 1 ? "flex-1" : ""}`}>
                <button
                  type="button"
                  aria-current={i === aktivan ? "step" : undefined}
                  onClick={() => naKrug(i)}
                  aria-label={`Idi na korak ${i + 1}: ${korak.naslov}`}
                  className={`grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-solid border-primary font-prikaz text-[1.25rem] leading-none font-normal outline-none transition-colors duration-300 motion-reduce:transition-none ${
                    zavrsen ? "bg-primary text-text-on-primary" : "bg-white text-primary"
                  }`}
                >
                  {i + 1}
                </button>
                {i < KORACI.length - 1 && (
                  // Bez razmaka (mx) — linija je spojena sa krugovima sa obe strane.
                  <span aria-hidden="true" className="relative h-0.5 flex-1 overflow-hidden bg-border-soft">
                    <span
                      ref={(el) => {
                        linijeRef.current[i] = el;
                      }}
                      className="absolute inset-0 origin-left bg-primary"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Tekstovi slojevito u istoj ćeliji grida — visina bloka je visina
            NAJVIŠEG teksta, pa slika ispod ne "skače" pri promeni koraka. */}
        <div className="grid">
          {KORACI.map((korak, i) => (
            <div
              key={korak.naslov}
              aria-hidden={i !== aktivan}
              className={`flex flex-col gap-2 [grid-area:1/1] ${prelaz}`}
              style={{ opacity: i === aktivan ? 1 : 0 }}
            >
              <h3 className="m-0 font-prikaz text-h3 leading-heading font-normal text-text-strong">
                {korak.naslov}
              </h3>
              <p className="m-0 font-tekst text-[14px] leading-body text-text-body">{korak.opis}</p>
            </div>
          ))}
        </div>

        {/* Slika je pune širine kontejnera (odnos 4:5, bez sečenja). Ako
            ekran nije dovoljno visok da stane, širina se smanjuje tako da cela
            slika ostane vidljiva: container-type:size + cqw/cqh jedinice daju
            širinu = min(100% širine, 80% visine prostora). Ista animacija kao
            na desktopu (KakoRadiScroll.tsx): cross-dissolve uz blago
            zatamnjenje izlazne slike. */}
        <div className="relative min-h-0 flex-1" style={{ containerType: "size" }}>
          {KORACI.map((korak, i) => {
            const uFokusu = i === aktivan;
            return (
              <div
                key={korak.naslov}
                aria-hidden={!uFokusu}
                className={`absolute inset-0 flex items-center justify-center ${
                  smanjenoKretanje ? "" : "transition-[opacity,filter] duration-700 ease-out"
                }`}
                style={{
                  opacity: uFokusu ? 1 : 0,
                  filter: uFokusu ? "brightness(1)" : "brightness(0.7)",
                }}
              >
                <div style={{ width: "min(100cqw, 80cqh)" }}>
                  <Image
                    src={korak.slika}
                    alt={korak.naslov}
                    width={900}
                    height={1125}
                    sizes="100vw"
                    quality={90}
                    className="h-auto w-full rounded-image"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
// "Zaključavanje" na koraku: kad skrol pređe granicu između dva koraka,
// držimo poziciju uz tu granicu ovoliko ms — jak zamah ne može da preskoči
// korak. HOLD_KORAKA je dozvoljeni luft (u delovima koraka) oko granice.
const ZAKLJUCAJ_MS = 450;
const HOLD_KORAKA = 0.12;
// Vreme (ms) za koje se prikazana popuna linije približi cilju ~63% — veće =
// mekše/sporije praćenje skrola.
const GLATKOCA_LINIJE_MS = 90;

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
// Slike se ne seku — uklapaju se u preostalu visinu. Stanje (aktivan korak) se
// postavlja SAMO kad se korak promeni; popuna linija ide direktno preko DOM-a
// kroz sopstvenu rAF petlju koja je glatko (eksponencijalno) prati — iOS šalje
// scroll događaje neravnomerno, pa direktno vezivanje za skrol "seče".
export function KakoRadiMobilno() {
  const omotacRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const linijeRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [aktivan, setAktivan] = useState(0);
  // Dok traje programski (glatki) skrol na klik na krug, zaključavanje je
  // isključeno da ne prekida taj skrol.
  const bezZakljucavanjaDoRef = useRef(0);
  const smanjenoKretanje = useSyncExternalStore(pretplataKretanja, () => matchMedia(UPIT_KRETANJA).matches, () => false);

  useEffect(() => {
    const omotac = omotacRef.current;
    const sticky = stickyRef.current;
    if (!omotac || !sticky) return;
    const N = KORACI.length;

    // --- glatka popuna linija (ciljna vs. prikazana vrednost) ---
    const cilj = new Array(N - 1).fill(0);
    const prikazano = new Array(N - 1).fill(0);
    let petljaId = 0;
    let poslednjeVreme = 0;
    const upisi = () => {
      linijeRef.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${prikazano[i] ?? 0})`;
      });
    };
    const petlja = (t: number) => {
      const dt = poslednjeVreme ? Math.min(t - poslednjeVreme, 64) : 16;
      poslednjeVreme = t;
      const k = 1 - Math.exp(-dt / GLATKOCA_LINIJE_MS);
      let miruje = true;
      for (let i = 0; i < prikazano.length; i++) {
        const d = cilj[i] - prikazano[i];
        if (Math.abs(d) < 0.002) prikazano[i] = cilj[i];
        else {
          prikazano[i] += d * k;
          miruje = false;
        }
      }
      upisi();
      if (miruje) {
        petljaId = 0;
        poslednjeVreme = 0;
      } else petljaId = requestAnimationFrame(petlja);
    };
    const pokreniPetlju = () => {
      if (!petljaId) petljaId = requestAnimationFrame(petlja);
    };

    // --- zaključavanje na granicama koraka ---
    let poslednjePos: number | null = null;
    let sidro: number | null = null;
    let zakljucanDo = 0;

    let uToku = false;
    const izracunaj = () => {
      uToku = false;
      const r = omotac.getBoundingClientRect();
      const putanja = r.height - sticky.offsetHeight;
      if (putanja <= 0) return;
      const vrhOmotaca = window.scrollY + r.top;
      const yZaPos = (pos: number) => vrhOmotaca - NAV_VISINA + (pos / N) * putanja;
      const sirovoP = (NAV_VISINA - r.top) / putanja;
      let pos = Math.min(Math.max(sirovoP, 0), 1) * N;

      const sada = performance.now();
      if (sirovoP > 0 && sirovoP < 1 && !smanjenoKretanje && sada > bezZakljucavanjaDoRef.current) {
        if (sidro !== null && sada < zakljucanDo) {
          const lo = sidro - HOLD_KORAKA;
          const hi = sidro + HOLD_KORAKA;
          if (pos > hi || pos < lo) {
            pos = pos > hi ? hi : lo;
            window.scrollTo({ top: yZaPos(pos), behavior: "instant" });
          }
        } else {
          sidro = null;
          if (poslednjePos !== null && Math.floor(poslednjePos) !== Math.floor(pos)) {
            const granica = pos > poslednjePos ? Math.floor(poslednjePos) + 1 : Math.floor(poslednjePos);
            if (granica >= 1 && granica <= N - 1) {
              sidro = granica;
              zakljucanDo = sada + ZAKLJUCAJ_MS;
              const lo = granica - HOLD_KORAKA;
              const hi = granica + HOLD_KORAKA;
              if (pos > hi || pos < lo) {
                pos = pos > hi ? hi : lo;
                window.scrollTo({ top: yZaPos(pos), behavior: "instant" });
              }
            }
          }
        }
        poslednjePos = pos;
      } else {
        sidro = null;
        poslednjePos = null;
      }

      // Mala tolerancija — na tačnoj granici (npr. 1.0) korak je već novi.
      setAktivan(Math.min(Math.floor(pos + 0.001), N - 1));
      for (let i = 0; i < N - 1; i++) cilj[i] = Math.min(Math.max(pos - i, 0), 1);
      if (smanjenoKretanje) {
        for (let i = 0; i < N - 1; i++) prikazano[i] = cilj[i];
        upisi();
      } else pokreniPetlju();
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
      if (petljaId) cancelAnimationFrame(petljaId);
    };
  }, [smanjenoKretanje]);

  // Klik na krug skroluje na početak tog koraka (granica), da odmah bude
  // aktivan sa popunjenom linijom do njega.
  const naKrug = (i: number, vreme: number) => {
    const omotac = omotacRef.current;
    const sticky = stickyRef.current;
    if (!omotac || !sticky) return;
    const r = omotac.getBoundingClientRect();
    const putanja = r.height - sticky.offsetHeight;
    const vrhOmotaca = window.scrollY + r.top;
    const cilj = vrhOmotaca - NAV_VISINA + ((i + 0.02) / KORACI.length) * putanja;
    bezZakljucavanjaDoRef.current = vreme + 1200;
    window.scrollTo({ top: cilj, behavior: smanjenoKretanje ? "auto" : "smooth" });
  };

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
                  onClick={(e) => naKrug(i, e.timeStamp)}
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
              className="flex flex-col gap-2 [grid-area:1/1]"
              // Redom, ne istovremeno: stari tekst brzo nestane, a novi se pojavi
              // TEK posle kratke pauze — tako se dva teksta nikad ne preklapaju.
              style={{
                opacity: i === aktivan ? 1 : 0,
                transition: smanjenoKretanje
                  ? "none"
                  : i === aktivan
                    ? "opacity 300ms ease-out 220ms"
                    : "opacity 180ms ease-out 0ms",
              }}
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

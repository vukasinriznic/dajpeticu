"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { KORACI } from "@/components/sajt/KakoRadiScroll";

// Visina fiksnog headera (Zaglavlje.tsx) na mobilnom — sticky se lepi tik
// ispod njega, a vidljiva visina sekcije je ostatak ekrana.
const NAV_VISINA = 82;
// Skrol (u svh) koji zauzima jedan korak u sticky sekciji.
const SKROL_PO_KORAKU_SVH = 50;
// Koliko px skrola od "mirne" pozicije koraka pokreće prelaz na sledeći/
// prethodni korak, koliko traje glatki prelaz, i koliko skrol mora da miruje
// posle prelaza pre nego što novi potez sme da pokrene sledeći.
const PRAG_PX = 36;
const TRAJANJE_MS = 550;
const MIROVANJE_MS = 140;

const UPIT_KRETANJA = "(prefers-reduced-motion: reduce)";
function pretplataKretanja(cb: () => void) {
  const mq = matchMedia(UPIT_KRETANJA);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

const ublazi = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Mobilna verzija "Kako radi" (19.09.2026.) — sticky sekcija u kojoj JEDAN
// POTEZ SKROLA = JEDAN KORAK. Kad korisnik krene da skroluje dole (ili gore)
// od mirne pozicije koraka, sami glatko prelazimo na sledeći (prethodni) korak;
// dok prelaz traje ulaz se ignoriše, a sledeći potez se prihvata tek kad skrol
// utihne — jak zamah ne može da preskoči korak. Na poslednjem koraku dalji skrol
// dole je slobodan (otpušta sekciju), a na prvom skrol gore izlazi iz sekcije.
// Linija i pokazivač se pune vremenskom (CSS) animacijom pri promeni koraka, ne
// prate piksele skrola — iOS ih šalje neravnomerno pa je to bilo sečkanje.
// Naslov/podnaslov sekcije ostaju IZNAD; slike se ne seku.
export function KakoRadiMobilno() {
  const omotacRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const idiNaRef = useRef<(k: number) => void>(() => {});
  const [aktivan, setAktivan] = useState(0);
  const smanjenoKretanje = useSyncExternalStore(pretplataKretanja, () => matchMedia(UPIT_KRETANJA).matches, () => false);

  useEffect(() => {
    const omotac = omotacRef.current;
    const sticky = stickyRef.current;
    if (!omotac || !sticky) return;
    const N = KORACI.length;

    let strana = 0; // korak u kome se "odmara" skrol
    let animira = false;
    let cekaMirovanje = false;
    let animId = 0;
    let mirTimer: ReturnType<typeof setTimeout> | undefined;

    const geometrija = () => {
      const r = omotac.getBoundingClientRect();
      const putanja = r.height - sticky.offsetHeight;
      const yStart = window.scrollY + r.top - NAV_VISINA;
      return { putanja, yStart, yZaKorak: (k: number) => yStart + (k / N) * putanja };
    };

    const idi = (k: number) => {
      const { putanja, yZaKorak } = geometrija();
      if (putanja <= 0) return;
      const cilj = Math.min(Math.max(k, 0), N - 1);
      strana = cilj;
      setAktivan(cilj);
      const od = window.scrollY;
      const doY = yZaKorak(cilj);
      cancelAnimationFrame(animId);
      if (smanjenoKretanje || Math.abs(doY - od) < 1) {
        window.scrollTo({ top: doY, behavior: "instant" });
        return;
      }
      animira = true;
      cekaMirovanje = true;
      const pocetak = performance.now();
      const korak = (t: number) => {
        const p = Math.min((t - pocetak) / TRAJANJE_MS, 1);
        window.scrollTo({ top: od + (doY - od) * ublazi(p), behavior: "instant" });
        if (p < 1) animId = requestAnimationFrame(korak);
        else animira = false;
      };
      animId = requestAnimationFrame(korak);
    };
    idiNaRef.current = idi;

    let uToku = false;
    const izracunaj = () => {
      uToku = false;
      if (animira) return;
      const { putanja, yStart, yZaKorak } = geometrija();
      if (putanja <= 0) return;
      const y = window.scrollY;
      const p = (y - yStart) / putanja;
      // Van sticky zone: pamtimo sa koje strane smo (ulaz odozgo = prvi korak,
      // odozdo = poslednji) i ne diramo skrol.
      if (p <= 0) {
        strana = 0;
        setAktivan(0);
        return;
      }
      if (p >= 1) {
        strana = N - 1;
        setAktivan(N - 1);
        return;
      }
      if (cekaMirovanje) return;
      const odmak = y - yZaKorak(strana);
      if (odmak >= PRAG_PX && strana < N - 1) idi(strana + 1);
      else if (odmak <= -PRAG_PX && strana > 0) idi(strana - 1);
    };
    const naSkrol = () => {
      clearTimeout(mirTimer);
      mirTimer = setTimeout(() => {
        cekaMirovanje = false;
        if (!animira) izracunaj();
      }, MIROVANJE_MS);
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
      cancelAnimationFrame(animId);
      clearTimeout(mirTimer);
    };
  }, [smanjenoKretanje]);

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
                  onClick={() => idiNaRef.current(i)}
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
                      className={`absolute inset-0 origin-left bg-primary ${
                        smanjenoKretanje ? "" : "transition-transform duration-[550ms] ease-in-out"
                      }`}
                      style={{ transform: aktivan > i ? "scaleX(1)" : "scaleX(0)" }}
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

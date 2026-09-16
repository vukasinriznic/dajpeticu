"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Podvuceno } from "@/components/core/Podvuceno";

type Korak = { naslov: string; opis: string; slika: string };

const KORACI: Korak[] = [
  {
    naslov: "Postavite stalak",
    opis: "Tamo gde pogled mušterije prirodno pada dok čeka, na pultu, stolu ili kod kase.",
    slika: "/korak1.png",
  },
  {
    naslov: "Mušterija tapne ili skenira",
    opis: "Odmah se otvara vaša Google strana za ocenu, bez pretrage i čekanja.",
    slika: "/korak2.png",
  },
  {
    naslov: "Recenzija je objavljena",
    opis: "Čestitamo, upravo ste povećali šanse da vas pronađe nova mušterija.",
    slika: "/korak3.png",
  },
];

// Sekcija se "zaključa" (sticky) dok korisnik skroluje kroz nju — svaki
// korak dobija po 100vh skrola. Linija između krugova prati skrol glatko
// (kontinualno), krugovi menjaju boju na pragu svakog koraka i ostaju
// zeleni (obeleženi kao završeni). Samo desktop (lg+) — na mobilnom je
// ovaj "scrollytelling" obrazac suvišan i rizičan (100vh se ponaša
// nepredvidivo na mobilnim browserima), pa mobilni dobija običan stacked
// prikaz (vidi PocetnaStranica.tsx).
export function KakoRadiScroll() {
  const omotacRef = useRef<HTMLDivElement>(null);
  const stepniRef = useRef<HTMLDivElement>(null);
  const krugRefovi = useRef<(HTMLButtonElement | null)[]>([]);
  const [progres, setProgres] = useState(0);
  const [linija, setLinija] = useState<{ top: number; centri: number[] }>({ top: 22, centri: [] });

  useEffect(() => {
    const el = omotacRef.current;
    if (!el) return;
    // Pozicija linije se meri iznova na svakom skrolu (ne samo jednom na
    // mount) — pozicija krugova ne zavisi od skrola, ali jedno-vremensko
    // merenje je lako da zastari (font se učita kasnije, layout se pomeri
    // pri hot-reload-u u razvoju) i onda linija ostane "zaglavljena" na
    // staroj poziciji. Merenje u istom rAF-u je jeftino (par
    // getBoundingClientRect poziva) i uvek tačno.
    let uToku = false;
    const naSkrol = () => {
      if (uToku) return;
      uToku = true;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const ukupno = r.height - window.innerHeight;
        const p = ukupno > 0 ? Math.min(Math.max(-r.top / ukupno, 0), 1) : 0;
        setProgres(p);

        const kontejner = stepniRef.current;
        const svi = krugRefovi.current;
        if (kontejner && svi.length === KORACI.length && svi.every(Boolean)) {
          const kRect = kontejner.getBoundingClientRect();
          // Centar SVAKOG kruga (ne samo prvog/poslednjeg) — koraci nisu
          // uvek na jednakom razmaku (tekst se prelama u različit broj
          // redova), pa popunjenost linije mora da prati stvarne pozicije,
          // ne pretpostavku o ravnomernom razmaku.
          const centri = svi.map((el) => {
            const r2 = el!.getBoundingClientRect();
            return r2.top - kRect.top + r2.height / 2;
          });
          setLinija({ top: centri[0], centri });
        }
        uToku = false;
      });
    };
    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    window.addEventListener("resize", naSkrol);
    return () => {
      window.removeEventListener("scroll", naSkrol);
      window.removeEventListener("resize", naSkrol);
    };
  }, []);

  const sirovi = progres * KORACI.length;
  const aktivan = Math.min(Math.floor(sirovi), KORACI.length - 1);

  // Popunjenost linije se računa iz STVARNIH piksel-pozicija krugova (ne iz
  // pretpostavke o ravnomernom razmaku), i lerpuje unutar trenutnog koraka
  // (lokalniDeo) — slika desno se menja tačno kad linija stigne do sledećeg
  // kruga, ni pre ni posle, jer oboje zavise od istog "aktivan" praga.
  const lokalniDeo = Math.min(Math.max(sirovi - aktivan, 0), 1);
  const { centri } = linija;
  let popunjenostPx = 0;
  if (centri.length === KORACI.length) {
    if (aktivan >= KORACI.length - 1) {
      popunjenostPx = centri[KORACI.length - 1] - centri[0];
    } else {
      popunjenostPx = centri[aktivan] - centri[0] + lokalniDeo * (centri[aktivan + 1] - centri[aktivan]);
    }
  }
  const punaVisina = centri.length === KORACI.length ? centri[KORACI.length - 1] - centri[0] : 0;

  // Klik na krug skroluje tačno na sredinu tog koraka — obrnuti izračun iz
  // scroll-listenera iznad (p = -top/ukupno), bez potrebe za bilo kakvom
  // bibliotekom.
  const naKrug = (i: number) => {
    const el = omotacRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vrhOmotaca = window.scrollY + r.top;
    const ukupno = r.height - window.innerHeight;
    const ciljaniProgres = (i + 0.5) / KORACI.length;
    window.scrollTo({ top: vrhOmotaca + ciljaniProgres * ukupno, behavior: "smooth" });
  };

  return (
    <div ref={omotacRef} className="relative hidden lg:block" style={{ height: `${KORACI.length * 100}vh` }}>
      {/* top-20 + visina umanjena za tu istu vrednost — centriranje se računa
          u prostoru ISPOD nav-a (ne u celom 100vh), pa je razmak nav→sadržaj
          i sadržaj→dno ekrana stvarno jednak, ne samo simetričan u odnosu na
          ceo ekran (nav bi inače "pojeo" deo gornje margine). */}
      <div className="sticky top-20 flex h-[calc(100vh-80px)] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[var(--container)] grid-cols-2 items-stretch gap-16 px-5">
          <div className="flex h-full flex-col">
            <div className="flex max-w-[62ch] flex-col items-start gap-4 pb-10">
              <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-strong">
                <Podvuceno>Kako radi</Podvuceno>
              </h2>
              <p className="m-0 font-tekst text-h3 leading-heading text-text-body">
                Mi ga podesimo. Vi ga stavite na željeno mesto.
              </p>
            </div>
            <div ref={stepniRef} className="relative flex flex-1 flex-col justify-end gap-10">
              <div
                aria-hidden="true"
                className="absolute w-0.5 bg-border-soft"
                style={{ left: 21, top: linija.top, height: punaVisina }}
              />
              <div
                aria-hidden="true"
                className="absolute w-0.5 overflow-hidden"
                style={{ left: 21, top: linija.top, height: punaVisina }}
              >
                <div className="w-full bg-primary" style={{ height: popunjenostPx }} />
              </div>
              {KORACI.map((korak, i) => {
                const zavrsen = i <= aktivan;
                return (
                  <div key={korak.naslov} className="relative flex items-start gap-4">
                    <button
                      type="button"
                      ref={(el) => {
                        krugRefovi.current[i] = el;
                      }}
                      onClick={() => naKrug(i)}
                      aria-label={`Idi na korak ${i + 1}: ${korak.naslov}`}
                      className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full font-prikaz text-[1.25rem] leading-none font-normal transition-colors duration-300 hover:brightness-95"
                      style={{
                        backgroundColor: zavrsen ? "var(--color-primary)" : "#fff",
                        borderColor: "var(--color-primary)",
                        borderWidth: 2,
                        borderStyle: "solid",
                        color: zavrsen ? "var(--color-text-on-primary)" : "var(--color-primary)",
                      }}
                    >
                      {i + 1}
                    </button>
                    <div
                      className="flex flex-col gap-2 pb-2 transition-opacity duration-300"
                      style={{ opacity: i === aktivan ? 1 : 0.4 }}
                    >
                      <h3 className="m-0 font-prikaz text-h3 leading-heading font-normal text-text-strong">
                        {korak.naslov}
                      </h3>
                      <p className="m-0 max-w-[42ch] font-tekst text-body leading-body text-text-body">
                        {korak.opis}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px]">
            {/* Brend-tonirani glow iza vizuala — ista logika kao u hero-u i
                "card" sekciji, ovde u svetlijoj (primary-quiet) nijansi jer
                je pozadina sekcije svetla. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 45%, var(--color-primary-quiet), transparent 70%)",
              }}
            />
            {/* aspect-[4/5] prati odnos naših fotografija (kartica/telefon
                skoro kvadratni, poslednji korak 4:5) — sprečava agresivno
                sečenje koje se dešavalo pri širokom (1.5:1) formatu. */}
            <div className="relative h-full overflow-hidden rounded-image bg-surface-2">
              {KORACI.map((korak, i) => {
                // Meko zatamnjenje — izlazna slika potamni dok nestaje,
                // ulazna se posvetli dok se pojavljuje (klasičan filmski
                // cross-dissolve), bez blura/skaliranja iz ranije verzije.
                const uFokusu = i === aktivan;
                return (
                  <div
                    key={korak.naslov}
                    aria-hidden={i !== aktivan}
                    className="absolute inset-0 transition-[opacity,filter] duration-700 ease-out"
                    style={{
                      opacity: uFokusu ? 1 : 0,
                      filter: uFokusu ? "brightness(1)" : "brightness(0.7)",
                    }}
                  >
                    <Image
                      src={korak.slika}
                      alt={korak.naslov}
                      fill
                      sizes="(max-width: 1024px) 0px, 640px"
                      quality={90}
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

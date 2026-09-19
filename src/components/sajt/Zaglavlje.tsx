"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Logotip } from "@/components/core/Logotip";
import { Dugme } from "@/components/core/Dugme";
import { useKorpa } from "@/components/sajt/KorpaKontekst";

const NAV = [
  ["kako", "Kako radi"],
  ["cijene", "Cene"],
  ["iskustva", "Iskustva"],
  ["pitanja", "Pitanja"],
] as const;

const PRAG_SKROLA = 12;

function idiNa(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
}

// Čist tekstualni link — ne izgleda kao dugme. Podvlaka se puni sleva
// nadesno na hover (transform-origin: left), a na izlazak iz hover-a se
// prazni u istom smeru (origin prebačen na desno taman kad je traka puna,
// pa se levi kraj povlači udesno dok desni ostaje fiksiran).
function NavLink({
  full = false,
  tamno = false,
  onClick,
  children,
}: {
  full?: boolean;
  tamno?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative inline-flex h-11 items-center font-tekst text-body-sm font-normal transition-colors duration-300 ${
        tamno ? "text-text-on-inverse" : "text-text-strong"
      } ${full ? "w-full" : ""}`}
    >
      {children}
      {/* Širina (ne transform: scaleX) — skaliranje 1px trake preko transform-a
          pravi anti-aliasing i traka izgleda 2px. Menjanjem levog/desnog sidra
          tačno na 0%/100% širini (vizuelno identično oba oblika) traka i dalje
          puni sleva nadesno pri hover-u i prazni sleva nadesno pri izlasku. */}
      <span
        className={`absolute bottom-1.5 h-0 border-b transition-[width] duration-300 ease-out ${
          tamno ? "border-[var(--color-gold)]" : "border-primary"
        }`}
        style={
          hover
            ? { left: 0, right: "auto", width: "100%" }
            : { left: "auto", right: 0, width: "0%" }
        }
      />
    </button>
  );
}

// Vertikalna linija (u px od vrha ekrana) na kojoj proveravamo da li nav
// "sedi" preko tamnozelene sekcije — otprilike sredina trake sa logoom.
const LINIJA_NAVA = 45;

export function Zaglavlje() {
  const { otvoriModal, otvoriKorpu, ukupnaKolicina } = useKorpa();
  const [otvoren, setOtvoren] = useState(false);
  // Nav je fixed preko hero-a — providan dok je na vrhu, dobija stakleni
  // blur čim se skroluje (isti obrazac kao ancora-ai.vercel.app: samo
  // backdrop-filter se menja, nema obojene pozadine ni senke).
  const [skrolovano, setSkrolovano] = useState(false);
  // Sekcije sa tamnozelenom pozadinom nose klasu "nav-tamno" (vidi
  // PocetnaStranica.tsx). Kad jedna od njih prekrije liniju nava, logo i
  // linkovi prelaze u belo, a CTA dugme u zlatno — inače bi zelenо dugme i
  // tamni tekst nestali na tamnozelenoj podlozi.
  const [tamnaPozadina, setTamnaPozadina] = useState(false);
  // Zaglavlje živi u (sajt) layout-u i ostaje montiran preko klijentskih
  // navigacija između stranica te grupe — bez pathname u zavisnostima, efekat
  // se ne bi ponovo pokrenuo pri promeni rute, pa bi boja nava ostala od
  // PRETHODNE stranice sve dok korisnik makar malo ne skroluje (npr. sa
  // svetle početne na stranicu koja odmah počinje tamnom sekcijom).
  const putanja = usePathname();

  // rAF-throttle + keširan querySelectorAll (19.09.2026.) — ranije se
  // querySelectorAll+getBoundingClientRect (prinudni sinhroni layout) i DVA
  // setState-a izvršavalo na SVAKI native scroll event, bez throttle-a, isti
  // trenutak kad hero parallax (PocetnaStranica.tsx) radi svoj rAF posao —
  // dva netusklađena scroll handler-a, jedan od njih layout-thrashing, bio
  // je pravi uzrok sečkanja pri skrolu na mobilnom (korisnik prijavio). Isti
  // rAF+"preskoči ako se ne menja" obrazac kao hero parallax.
  useEffect(() => {
    const tamneSekcije = document.querySelectorAll<HTMLElement>(".nav-tamno");
    let uToku = false;
    let poslednjeSkrolovano = -1;
    let poslednjeTamno = -1;
    const naSkrol = () => {
      if (uToku) return;
      uToku = true;
      requestAnimationFrame(() => {
        const skrolovanoSad = window.scrollY > PRAG_SKROLA ? 1 : 0;
        if (skrolovanoSad !== poslednjeSkrolovano) {
          setSkrolovano(skrolovanoSad === 1);
          poslednjeSkrolovano = skrolovanoSad;
        }
        let jeTamno = 0;
        tamneSekcije.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top <= LINIJA_NAVA && r.bottom >= LINIJA_NAVA) jeTamno = 1;
        });
        if (jeTamno !== poslednjeTamno) {
          setTamnaPozadina(jeTamno === 1);
          poslednjeTamno = jeTamno;
        }
        uToku = false;
      });
    };
    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    return () => window.removeEventListener("scroll", naSkrol);
  }, [putanja]);

  return (

    <header
      className={`fixed inset-x-0 top-0 z-20 transition-[backdrop-filter] duration-300 ${
        skrolovano || otvoren ? "backdrop-blur-md" : "backdrop-blur-none"
      }`}
    >
      <div className="mx-auto grid max-w-[var(--container)] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 pt-6 pb-2.5">
        <Logotip kontekst="header" className="col-start-1 justify-self-start" />
        {/* Sredishnja kolona je "auto" širine između dve jednake 1fr
            kolone — to je centrira u odnosu na CEO header, ne samo na
            preostali prostor, bez obzira što logo i desna grupa nisu iste
            širine. Na mobilnom je prazna (linkovi žive u meniju ispod).
            col-start-* na sva tri deteta je OBAVEZNO ovde — bez toga, kad
            je <nav> display:none (mobilno), CSS Grid auto-placement ga
            potpuno uklanja iz rasporeda pa desna grupa (sledeće dete u
            DOM redosledu) upadne u DRUGU (auto) kolonu umesto u treću,
            čime cela desna grupa vizuelno "pobegne" ulevo od desne ivice
            umesto da bude uz nju. */}
        <nav className="col-start-2 hidden items-center gap-10 md:flex">
          {NAV.map(([id, naziv]) => (
            <NavLink key={id} tamno={tamnaPozadina} onClick={() => idiNa(id)}>
              {naziv}
            </NavLink>
          ))}
        </nav>
        {/* gap-3 na mobilnom (bilo gap-6 svuda) — korpa i meni ikonica su
            eksplicitno primaknute 19.09.2026.; md: vraća originalni razmak
            (desktop ima i "Poruči" dugme između njih, treba mu više vazduha). */}
        <div className="col-start-3 flex items-center justify-end gap-3 justify-self-end md:gap-6">
          <button
            type="button"
            onClick={otvoriKorpu}
            aria-label={ukupnaKolicina > 0 ? `Korpa, ${ukupnaKolicina} stalaka` : "Korpa"}
            className="relative grid h-11 w-11 place-items-center border-0 bg-none transition-transform duration-200 hover:scale-110"
          >
            {/* PNG, ne lucide ikonica — invert filter je zamena za
                currentColor koji SVG ikonice dobijaju besplatno, jer se
                header prebacuje između svetle i tamne pozadine pri skrolu. */}
            <Image
              src="/images/shopping-cart.png"
              alt=""
              width={22}
              height={22}
              className={tamnaPozadina ? "invert" : ""}
            />
            {ukupnaKolicina > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--color-gold)] px-1 font-tekst text-[10px] font-semibold text-[var(--color-bg-inverse)]">
                {ukupnaKolicina}
              </span>
            )}
          </button>
          {/* Na mobilnom "Poruči" živi na dnu otvorenog menija (ispod) —
              ovde se sakriva da se ne dupira pored hamburger dugmeta. */}
          <Dugme
            size="xs"
            variant={tamnaPozadina ? "gold" : "primary"}
            onClick={() => otvoriModal()}
            className="!hidden md:!inline-flex"
          >
            Poruči
          </Dugme>
          {/* Ručno crtan hamburger (3 linije), ne lucide ikonica — treba da
              se sam preobliči u X (isti obrazac kao vukasinriznic.me,
              izmereno direktno na tom sajtu): gornja/donja linija rotiraju
              45°/-45° i pomere se 7px ka sredini, srednja nestane (opacity
              I width na 0, ne samo opacity — inače ostane "mrlja" u sredini
              X-a). transform-origin: center (isto kao "origin-center" tamo). */}
          <button
            type="button"
            aria-label="Meni"
            onClick={() => setOtvoren((o) => !o)}
            className="relative flex h-11 w-11 flex-col items-end justify-center gap-[5px] md:hidden"
          >
            <span
              className={`block h-[2px] w-6 origin-center rounded-full transition-[transform,background-color] duration-300 ${
                tamnaPozadina ? "bg-text-on-inverse" : "bg-text-strong"
              }`}
              style={otvoren ? { transform: "translateY(7px) rotate(45deg)" } : undefined}
            />
            <span
              className={`block h-[2px] rounded-full transition-[width,opacity,background-color] duration-300 ${
                tamnaPozadina ? "bg-text-on-inverse" : "bg-text-strong"
              }`}
              style={otvoren ? { width: 0, opacity: 0 } : { width: 24 }}
            />
            <span
              className={`block h-[2px] w-6 origin-center rounded-full transition-[transform,background-color] duration-300 ${
                tamnaPozadina ? "bg-text-on-inverse" : "bg-text-strong"
              }`}
              style={otvoren ? { transform: "translateY(-7px) rotate(-45deg)" } : undefined}
            />
          </button>
        </div>
      </div>
      {/* Panel je SASTAVNI DEO header-a (opet unutar njega, 19.09.2026.) —
          kad je bio odvojen (fixed sibling sa sopstvenim blur-om), izmedju
          trake i panela se videla linija/šav jer dva odvojena blur sloja
          ne poklapaju ivicu. Sad header raste zajedno sa panelom i JEDAN
          backdrop-filter (na <header>) zamućuje celu površinu, pa su traka
          i meni jedna celina. Otvaranje/zatvaranje: grid-template-rows
          0fr -> 1fr (animira "auto" visinu bez merenja) + sadržaj koji se
          spušta/podiže, kao zavesa. Linije menjaju boju prema
          tamnaPozadina (svetla: primary zelena, tamna: zlatna). */}
      <div
        className={`grid transition-[grid-template-rows] duration-[350ms] ease-[cubic-bezier(.32,.72,0,1)] md:hidden ${
          otvoren ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        inert={!otvoren}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`flex flex-col px-5 transition-transform duration-[350ms] ease-[cubic-bezier(.32,.72,0,1)] ${
              otvoren ? "translate-y-0" : "-translate-y-6"
            } border-b ${tamnaPozadina ? "border-[var(--color-gold)]" : "border-primary"}`}
          >
            {NAV.map(([id, naziv]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setOtvoren(false);
                  idiNa(id);
                }}
                className={`border-b py-[14px] text-left font-tekst text-body font-medium ${
                  tamnaPozadina ? "border-[var(--color-gold)] text-text-on-inverse" : "border-primary text-text-strong"
                }`}
              >
                {naziv}
              </button>
            ))}
            <div className="py-4">
              <Dugme
                full
                variant={tamnaPozadina ? "gold" : "primary"}
                onClick={() => {
                  setOtvoren(false);
                  otvoriModal();
                }}
              >
                Poruči
              </Dugme>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

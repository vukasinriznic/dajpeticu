"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dugme, DUGME_ISTAKNUTO } from "@/components/core/Dugme";
import { OcenaZvezdicama } from "@/components/core/OcenaZvezdicama";
import { Podvuceno } from "@/components/core/Podvuceno";
import { Utisak } from "@/components/marketing/Utisak";
import { Akordeon, PitanjeOdgovor } from "@/components/marketing/PitanjeOdgovor";
import { Sekcija } from "@/components/sajt/Sekcija";
import { UNaVidiku } from "@/components/core/UNaVidiku";
import { Kartica3D } from "@/components/sajt/Kartica3D";
import { KakoRadiScroll } from "@/components/sajt/KakoRadiScroll";
import { KakoRadiMobilno } from "@/components/sajt/KakoRadiMobilno";
import { KarticaSlojevi, KarticaSlojeviStatic } from "@/components/sajt/KarticaSlojevi";
import { Cenovnik } from "@/components/sajt/Cenovnik";
import { useKorpa } from "@/components/sajt/KorpaKontekst";
import { site } from "@/lib/site";

function idiNa(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
}

// Kartica3D.tsx-ov podrazumevani RAZMER_SLIKE_PODRAZUMEVANO (848/1401) —
// vidljiva kartica unutar Kartica3D-ovog kvadratnog omotača je uvek ovog
// razmera šira:visina. Koristi se za obrnut izračun u mobilnom hero-u
// ispod (koliko širok mora biti KVADRAT da bi VIDLJIVA kartica bila
// tačno određene širine).
const RAZMER_KARTICE_U_KVADRATU = 848 / 1401;

// CARD sekcija (20.09.2026.) — umesto dva odvojena proizvoda jedan pored
// drugog (probano, odbačeno istog dana: dve slike u jednoj koloni fizički
// ne mogu preći ~210-240px vidljive širine na uobičajenim laptop ekranima,
// 1280-1440px, a da ne zgnječe tekst ili probiju stranicu), sad je jedna
// GOTOVA fotografija (stalak + kartica već komponovani zajedno od strane
// vlasnika) — public/images/card_sekcija.png, 1374×1145 (razmer čuva sam
// next/image preko width/height propova ispod). Prikazuje se kao obična
// slika (object-contain), bez Kartica3D-ovog kvadratnog/tilt mehanizma koji
// je namenjen JEDNOM proizvodu, ne gotovoj kompoziciji.

export function PocetnaStranica() {
  const { otvoriModal } = useKorpa();

  // Podvlaka ispod "pet zvezdica" se NE otkriva zajedno sa ostatkom naslova
  // — čeka da se ceo hero "sleže" (red teksta se otkrije, podnaslov/dugme/
  // zvezdice ubace), pa se tek onda sama povuče sleva nadesno, kao da je
  // neko dopisuje rukom pošto je tekst već tu. ~1050ms pokriva najduže
  // hero kašnjenje ispod (zvezdice na 240ms + njihovih 700ms trajanja).
  const [podvucenoIscrtano, setPodvucenoIscrtano] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPodvucenoIscrtano(true), 1050);
    return () => clearTimeout(t);
  }, []);

  // Slika stalka na mobilnom (ispod podnaslova) — sirina se meri iz
  // stvarno dostupnog prostora, isti ref+resize obrazac kao
  // KarticaSlojevi.tsx/DemoDodira.tsx.
  //
  // Kartica3D-ov "sirina" prop je širina KVADRATNOG omotača, ne stvarne
  // (uže, uspravne) kartice — Kartica3D.tsx centrira/levo-poravnava
  // fotografiju unutar tog kvadrata po sopstvenom razmeru
  // (RAZMER_SLIKE_PODRAZUMEVANO = 848/1401 ≈ 0.605), pa je vidljiva
  // kartica uvek uža od kvadrata. Ranije smo prosleđivali izmerenu širinu
  // direktno, pa je vidljiva kartica zauzimala samo ~60% širine kolone
  // (potvrđeno screenshot-om 19.09.2026. — "zauzima polovinu širine
  // ekrana"). Da bi SAMA VIDLJIVA kartica ispunila punu širinu kolone
  // (eksplicitno traženo, visina sme da poraste), kvadrat se sad računa
  // unazad: kvadratSirina = dostupnaSirina / 0.605 (RAZMER_KARTICE_U_KVADRATU
  // gore, deljeno ispod pri prosleđivanju u Kartica3D).
  const mobilnaSlikaRef = useRef<HTMLDivElement>(null);
  const [sirinaMobilneSlike, setSirinaMobilneSlike] = useState(335);
  useEffect(() => {
    const izmeri = () => {
      if (mobilnaSlikaRef.current) setSirinaMobilneSlike(mobilnaSlikaRef.current.offsetWidth);
    };
    izmeri();
    window.addEventListener("resize", izmeri);
    return () => window.removeEventListener("resize", izmeri);
  }, []);

  // Deljeno između hero-a i CARD sekcije (19.09.2026., "slika stalka u
  // CARD zelimo da bude iste velicine kao u hero sekciji") — ista formula
  // (puna širina kolone × 0.8, vidi gore) i ISTA izmerena vrednost
  // (sirinaMobilneSlike, izmerena iz hero kolone) se koristi za obe slike,
  // umesto da CARD meri svoju sopstvenu kolonu — garantuje piksel-tačno
  // poklapanje bez oslanjanja na to da su dve kolone slučajno iste širine.
  const sirinaMobilneKartice = Math.round((sirinaMobilneSlike / RAZMER_KARTICE_U_KVADRATU) * 0.8);

  // Pozadina se pomera sporije od sadržaja pri skrolu (klasičan parallax).
  // Direktna DOM manipulacija (ne useState) namerno — React re-render po
  // scroll frejmu bi bio suvišan trošak za ovako sitan vizuelni efekat.
  // Bafer -220px gore/dole (ispod) sprečava da se ivica slike ogoli pri pomeraju.
  const parallaxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Iskljuceno na mobilnom (19.09.2026., eksplicitno traženo, snimak
    // ekrana potvrđuje sečkanje) — i pored rAF throttle-a i "preskoči ako
    // se ne menja" optimizacije, scroll-driven transform na mobilnim
    // browserima kasni za stvarnim skrolom (rAF se izvršava POSLE
    // compositing-a), pa se vizuelno "lovi" umesto glatkog pomeraja. Efekat
    // je i suptilan na malom ekranu, pa gašenje na mobilnom nije vidljiv
    // gubitak. Isti lg prag (1024px) kao svuda po sajtu.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      return;
    }
    const el = parallaxRef.current;
    if (!el) return;
    let uToku = false;
    let poslednja = -1;
    const naSkrol = () => {
      if (uToku) return;
      uToku = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.25, 200);
        // Preskoči pisanje stila ako se vrednost nije promenila (npr. skrol
        // je već prošao hero i pomeraj je zaglavljen na maksimumu) — manje
        // nepotrebnog rada po frejmu, manje sečkanja.
        if (y !== poslednja) {
          el.style.transform = `translate3d(0, ${y}px, 0)`;
          poslednja = y;
        }
        uToku = false;
      });
    };
    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    return () => window.removeEventListener("scroll", naSkrol);
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        id="top"
        // Donji padding izjednačen sa ostalim sekcijama (19.09.2026.,
        // eksplicitno traženo) — Sekcija.tsx koristi
        // py-[clamp(56px,9vw,120px)] za sve ostale sekcije; hero nije
        // Sekcija (ima sopstveni min-h-screen/pt-28 raspored), pa je pb-8
        // (32px) fiksno odudarao. Isti clamp sad i ovde na mobilnom, samo
        // za dno (vrh ostaje pt-28 zbog fixed header-a). Desktop nepromenjen
        // (lg:py-8 i dalje pobeđuje na lg+, kao i pre).
        className="relative grid min-h-[var(--vh,100vh)] content-start lg:min-h-screen lg:content-center overflow-hidden bg-surface-0 px-5 pt-28 pb-[clamp(56px,9vw,120px)] lg:py-8"
      >
        {/* next/image umesto CSS background-image — automatski AVIF/WebP,
            responsive veličine i prioritetno učitavanje (LCP). Izvorni fajl je
            bio 8000×6000px/892KB (nerazumno veliko za pozadinu), otud "loše
            učitavanje" — smanjen na 2400×1800/47KB. Omotač je 220px veći gore i
            dole (bafer) da parallax pomeraj nikad ne ogoli ivicu slike. */}
        <div
          ref={parallaxRef}
          className="absolute inset-x-0 -top-[220px] -bottom-[220px] will-change-transform"
        >
          <Image
            src="/images/hero_new.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover object-center"
          />
        </div>
        {/* Suptilan brend-tonirani "filter" preko fotografije — vezuje neutralnu
            sliku za primarnu boju umesto da ostane čisto siva, i dodaje dubinu. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 78% 28%, var(--color-primary-quiet), transparent 70%), linear-gradient(180deg, rgb(255 255 255 / 0.12), transparent 40%)",
          }}
        />
        {/* Vrlo tiho zrno preko cele slike — razbija "flat" fotografski izgled. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Beli scrim iza teksta — pozadina je dosta "šarena" (geometrijski
            oblici menjaju svetlinu), pa tekst preko nje gubi na čitljivosti.
            Na desktopu je tekst LEVO a kartica DESNO (2 kolone), pa je
            gradijent horizontalni (100deg) — najjači iza teksta, nestaje ka
            kartici. Na mobilnom je raspored VERTIKALAN (tekst pa ispod
            slika) — isti horizontalni gradijent bi prekrio skoro celu širinu
            ekrana belim velom i ispod teksta, tačno tamo gde sad sedi
            slika stalka, zbog čega je pozadina delovala "mutno"/isprano
            (prijavio korisnik 19.09.2026.). Zato je od te izmene gradijent
            vertikalan (180deg) na mobilnom — jak iza teksta pri vrhu,
            nestaje pre nego što stigne do slike ispod. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgb(255 255 255 / 0.82) 0%, rgb(255 255 255 / 0.55) 14%, rgb(255 255 255 / 0.15) 26%, transparent 38%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(100deg, rgb(255 255 255 / 0.82) 0%, rgb(255 255 255 / 0.6) 32%, rgb(255 255 255 / 0.15) 55%, transparent 72%)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-[var(--container)] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* min-w-0 je OBAVEZAN ovde (19.09.2026.) — grid track "1fr" je
              zapravo minmax(auto,1fr): ako dete ima sadržaj čiji min-content
              premašuje 1fr udeo (npr. whitespace-nowrap tekst koji je širi
              od kolone na telefonu sa uvećanim sistemskim fontom), CEO grid
              (i time cela stranica) se raširi preko viewport-a — to je
              izazvalo horizontalni skrol na mobilnom. min-w-0 vraća grid na
              normalno ponašanje: kolona nikad ne premaši svoj 1fr udeo, a
              eventualni preširok sadržaj se samo vizuelno seče unutar nje
              (sekcija već ima overflow-hidden). */}
          {/* VRAĆENO na items-start (19.09.2026., isti dan) — ceo eksperiment
              sa centriranjem na mobilnom (naslov/podnaslov/slika/dugme/
              zvezde/tekst) je otkazan, korisnik se odlučio za levo
              poravnanje. Ostatak izmena ispod u istom bloku prati isti
              povratak. */}
          <div className="flex min-w-0 flex-col items-start gap-5">
            {/* Svaki red se otkriva sleva nadesno (dp-otkrivanje-sleva) —
                eksplicitna odluka da naslov, iako je LCP element, dobije
                upečatljiv ulazak; trajanja su kratka (700ms) da hit na
                percepciju brzine učitavanja ostane mali. Podvlaka ispod
                "pet zvezdica" se namerno NE otkriva u isto vreme — vidi
                podvucenoIscrtano gore, povlači se tek pošto se ceo hero
                sleže. */}
            {/* Mobilni pod 60px (3.75rem), bio 56px — eksplicitno traženo
                19.09.2026. Desktop max (6.5rem) nepromenjen.
                text-center UKLONJEN (isti dan, korisnik se predomislio) —
                blok (h1 kao celina) ostaje centriran na stranici preko
                roditeljevog items-center, ali TEKST unutar njega je levo
                poravnat (druga linija "pet zvezdica" počinje na istom
                levom rubu kao "Jedan tap", ne centrirana ispod nje). */}
            {/* Mobilni pod 64px (4rem, bio 60px) — eksplicitno traženo
                19.09.2026. Desktop max (6.5rem) nepromenjen. */}
            <h1 className="m-0 font-prikaz text-[clamp(4rem,7.5vw,6.5rem)] leading-display font-semibold tracking-display text-text-strong">
              <span className="-mx-[0.15em] -mt-[0.1em] -mb-[0.6em] inline-block px-[0.15em] pt-[0.1em] pb-[0.6em] animate-[dp-otkrivanje-sleva_700ms_cubic-bezier(.2,.7,.3,1)_both]">
                Jedan tap
              </span>
              <br />
              <span className="-mx-[0.15em] -mt-[0.1em] -mb-[0.6em] inline-block px-[0.15em] pt-[0.1em] pb-[0.6em] animate-[dp-otkrivanje-sleva_700ms_cubic-bezier(.2,.7,.3,1)_150ms_both] text-primary">
                <Podvuceno odlozenoIscrtavanje iscrtaj={podvucenoIscrtano}>
                  pet zvezdica
                </Podvuceno>
              </span>
            </h1>
            <UNaVidiku>
              {/* text-h3 min (20px) je bio veći od traženog — sopstveni
                  clamp umesto deljenog tokena. Mobilni pod spušten na 18px
                  (18.09.2026., eksplicitno traženo), prelom u dva reda je
                  SAMO mobilni zahtev (lg:hidden <br/>; skriveni razmak
                  "hidden lg:inline" sprečava da se rečenice slepe kad je
                  <br/> uklonjen sa lg+). Desktop max spušten sa 1.5rem na
                  1.4rem i dodat lg:whitespace-nowrap (18.09.2026.) — ova
                  konkretna rečenica na 24px ne staje u jedan red u koloni
                  hero teksta (koja je pola širine kontejnera minus gap) sve
                  do ~1600px širine ekrana; 22.4px staje već od ~1280px
                  nadalje, što pokriva realne desktop rezolucije, razlika u
                  odnosu na 24px je vizuelno zanemarljiva.

                  whitespace-nowrap ISTORIJA (19.09.2026.): prvi pokušaj ga
                  je dodao i na mobilnom (bez lg:) da spreči da "Konkurencija
                  nije bolja od vas." lomi samu sebe (na telefonu korisnika,
                  verovatno uvećan sistemski font) — to je napravilo PRAVI
                  horizontalni skrol cele stranice, jer grid stubac bez
                  zaštite raste da prihvati nowrap-ovan min-content (grid
                  "blowout"). Vraćeno na lg:-only + dodat min-w-0 na
                  roditeljsku kolonu (gore) kao odbrana. Korisnik je potom
                  potvrdio da se rečenica I DALJE lomi na telefonu (jer je
                  whitespace opet normal na mobilnom) — drugi pokušaj:
                  nowrap VRAĆEN i na mobilnom, sad bezbedno JER min-w-0 već
                  postoji — ako tekst ipak ne stane ni bez preloma, odseći
                  će se vizuelno unutar sekcije (overflow-hidden) umesto da
                  ponovo razvuče ceo grid. Mobilni pod podignut na 20px
                  (1.25rem, bio 18px) — eksplicitno traženo 19.09.2026.

                  text-center UKLONJEN (isti dan, korisnik se predomislio) —
                  isti razlog kao h1 iznad: blok ostaje centriran na
                  stranici (roditeljev items-center), tekst unutar njega je
                  levo poravnat (druga rečenica počinje na istom rubu kao
                  prva, ne centrirana ispod nje).

                  Mobilni pod 22px (bio 24px pa 20px pre toga, eksplicitno
                  traženo 19.09.2026.) — fiksna vrednost, ne clamp, ostaje
                  ispod desktop maksimuma (22.4px/1.4rem) ali dovoljno blizu
                  da razlika bude zanemarljiva. lg: vraća originalni clamp
                  nepromenjen. */}
              <p
                className="m-0 max-w-[46ch] font-prikaz text-[22px] leading-heading font-medium text-text-strong whitespace-nowrap lg:text-[clamp(1.25rem,2.6vw,1.4rem)]"
                style={{ transform: "translateY(2px)" }}
              >
                Konkurencija nije bolja od vas.
                <br className="lg:hidden" />
                <span className="hidden lg:inline"> </span>
                Samo ima više recenzija.
              </p>
            </UNaVidiku>
            {/* Slika stalka — na mobilnom ide OVDE, u toku sadržaja (ispod
                podnaslova, iznad dugmeta); na desktopu (lg+) je sakrivena jer
                stalak već ima svoju veliku sliku u desnoj koloni (ispod, van
                ovog diva). sirina se meri iz stvarno dostupnog prostora (isti
                ref+resize obrazac kao KarticaSlojevi.tsx/DemoDodira.tsx) —
                fiksnih 320px bi na uskim telefonima štrčalo van ekrana. */}
            <UNaVidiku kasnjenje={60} className="w-full lg:hidden">
              {/* Vidljiva kartica sad puni CELU širinu kolone, ne samo
                  kvadratni omotač (19.09.2026., eksplicitno traženo —
                  "nema veze sto ce se povecati height"). Kvadrat (Kartica3D
                  sirina prop) je zato ŠIRI od wrapper-a — obrnut izračun
                  gore (mobilnaSlikaRef efekat). "flex justify-start"
                  UKLONJEN namerno: kvadrat je sad namerno širi od svog
                  wrapper-a i overflow-uje udesno (nevidljivo, providno —
                  vidljiva kartica je levo poravnata unutar kvadrata) — u
                  flex kontekstu bi flexbox POKUŠAO da skupi dete nazad na
                  širinu wrapper-a (flex-shrink:1 podrazumevano), poništavajući
                  ceo izračun; običan blok wrapper (bez flex) to ne radi,
                  dete jednostavno prelije van svoje kutije, što ovde
                  sekcija (overflow-hidden) tiho seče. */}
              <div ref={mobilnaSlikaRef} className="relative w-full pt-2">
                {/* Zeleni "blush" iza slike (19.09.2026., eksplicitno
                    traženo) — isti obrazac kao CARD-ov zlatni sjaj iza
                    njegove slike, ovde u primary-quiet zelenoj (ista
                    nijansa kao hero-ova gornja pozadinska radijalna
                    senka, linija ~164) da se uklopi u hero-ovu zelenu
                    temu umesto CARD-ove zlatne. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(55% 55% at 50% 50%, var(--color-primary-quiet), transparent 70%)",
                  }}
                />
                {/* ×0.8 (19.09.2026., "smanji karticu za 20%") posle
                    obrnutog izračuna pune širine — i dalje sabijeno na
                    levu ivicu (poravnanje="left"), samo 20% uže od pune
                    širine kolone. interaktivna={false} (isti zahtev,
                    "iskljuci hover efekat na mobile") — gasi tilt/sjaj na
                    pomeraj prsta i "disanje" animaciju u mirovanju; desktop
                    (drugi Kartica3D pozivi ispod, lg:grid/CARD sekcija)
                    ostaje interaktivan, nepromenjen.

                    Centrirano (19.09.2026., probno — "da vidimo kako ce to
                    da izgleda") — poravnanje="left" → "center" (fotografija
                    centrirana UNUTAR kvadrata) + "relative left-1/2
                    -translate-x-1/2" na sam kvadrat da centrira kvadrat
                    unutar wrapper-a. "mx-auto" NIJE dovoljan ovde — kvadrat
                    je ŠIRI od wrapper-a, a margin:auto se u tom
                    "overflow" slučaju po CSS specifikaciji svodi na 0 (ne
                    deli se ravnomerno), pa je isprobano i odbačeno (kvadrat
                    je ostajao nalepljen za levu ivicu). left-50%+
                    translateX(-50%) je standardan trik za centriranje
                    elementa šireg od svog roditelja, radi bez obzira na
                    odnos širina. */}
                <Kartica3D
                  sirina={sirinaMobilneKartice}
                  className="relative left-1/2 -translate-x-1/2"
                  interaktivna={false}
                  prioritet
                />
              </div>
            </UNaVidiku>
            {/* mt-4 prebačen na lg:-only (19.09.2026., traženo smanjenje
                razmaka pre dugmeta NA MOBILNOM) — na mobilnom se sabirao sa
                roditeljevim flex gap-5 pravivši 44px do slike (8px iz
                slikinog starog py-2 + 20px gap + 16px mt-4); sad je na
                mobilnom razmak samo bazni gap-5 (20px). Desktop zadržava
                originalni mt-4 (dugme tu nema sliku iznad sebe — mobilna
                slika je lg:hidden — pa mu ta dodatna margina i dalje treba
                da ne "zalepi" dugme direktno uz podnaslov).

                Centriranje (w-full justify-center) UKLONJENO (19.09.2026.,
                isti dan) — dugme vraćeno na levo poravnato na mobilnom,
                isto kao ostatak kolone. */}
            {/* w-full i na UNaVidiku omotaču, ne samo na dugmetu (19.09.2026.,
                "isti width kao dugme u sekciji card") — roditeljska hero
                kolona je "items-start" (shrink-to-fit svaki red na svoj
                sadržaj), pa je "width:100%" na SAMOM dugmetu bio 100% od
                omotača koji se sam skupio na dugmetov prirodni sadržaj —
                kružna zavisnost koja se svodi na prirodnu širinu (194px,
                izmereno). Omotač takođe mora eksplicitno na w-full da bi
                se prvo ON razvukao na punu širinu kolone (335px), pa tek
                onda dugme unutar njega na 100% TE (već pune) širine. */}
            <UNaVidiku kasnjenje={120} className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:mt-4">
              <Dugme
                size="lg"
                className={`w-full lg:w-auto ${DUGME_ISTAKNUTO}`}
                onClick={() => otvoriModal()}
              >
                Poruči stalak
              </Dugme>
            </UNaVidiku>
            {/* Mobilno: zvezde i tekst u odvojenim redovima (traženo
                18.09.2026. — na mobilnom je tekst upadao u isti red kao
                zvezde). Desktop nepromenjen (flex-row, jedan red).
                Centriranje probano pa OTKAZANO (19.09.2026., isti dan) —
                vraćeno na levo poravnato, isto kao ostatak kolone. */}
            <UNaVidiku kasnjenje={240} className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-3">
              <OcenaZvezdicama velicina={22} />
              <span className="font-tekst text-body-sm text-text-muted">
                Poruči za 1 minut, stiže poštom. Plaćate pouzećem.
              </span>
            </UNaVidiku>
          </div>
          <div className="hidden place-items-center py-6 lg:grid animate-[dp-uvecaj-pri-loadu_900ms_cubic-bezier(.2,.7,.3,1)_both]">
            <Kartica3D sirina={524} className="mt-3" />
          </div>
        </div>
      </section>

      {/* CARD */}
      {/* Desktop: sekcija je puna visina ekrana (20.09.2026., "kao i pre",
          posle dodavanja druge slike) — lg:flex + lg:items-center vertikalno
          centrira sadržaj (jedini unutrašnji div) unutar lg:min-h-screen.
          Mobilno nepromenjeno (nema lg: prefiksa, ne utiče). */}
      <Sekcija
        id="card"
        ton="alt"
        className="nav-tamno !bg-[#0B2E20] lg:flex lg:min-h-screen lg:items-center"
      >
        {/* Mobilni razmaci usklađeni (19.09.2026., eksplicitno traženo):
            gap-12→gap-5 (isti kao hero-ov flex gap-5, isti "pt-2" trik na
            slikinom wrapper-u ispod znači da se razmaci sad tačno poklapaju
            — podnaslov→slika ~28px, slika→dugme ~20px, isto kao hero); h2→p
            gap-8→gap-4, isto kao "Kako radi" sekcija. Desktop nepromenjen
            (lg: vraća originalne vrednosti).
            lg:grid-cols-[1fr_1.3fr] (20.09.2026., bilo lg:grid-cols-2) — slike
            su uvećane ~50%, slikina kolona dobija više prostora da ih ne
            "zgnječi" flex-shrink (Kartica3D nema flex-shrink-0, pa se
            proizvodi i dalje smanje ako ne stanu — ovo samo smanjuje koliko
            se smanje na uobičajenim širinama, bez rizika od horizontalnog
            skrola ako ekran ipak bude uzan). */}
        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
          <UNaVidiku className="flex max-w-[62ch] flex-col items-start gap-4 lg:gap-8">
            <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-on-inverse">
              {/* Podvlaka ispravljena na mobilnom (19.09.2026., screenshot
                  potvrdio bag) — kad je CELA rečenica bila u jednom
                  Podvuceno-u i prelomila se u 2 reda, podvlaka (apsolutno
                  pozicionirana, širine "w-full" NAJŠIRE linije) je sedela
                  ispod druge linije ali razvučena na širinu PRVE (šire)
                  linije, ne stvarne širine "same od sebe". Duplo renderovano
                  (isti obrazac kao "Kako radi" naslov): desktop nepromenjen
                  (cela rečenica u jednom Podvuceno-u, uvek jedan red pa je
                  podvlaka oduvek bila tačne širine), mobilno podvlači SAMO
                  "same od sebe" u NJENOJ sopstvenoj širini — "Recenzije
                  rastu " je običan tekst ispred, van Podvuceno-a. */}
              <span className="hidden lg:inline">
                <Podvuceno>Recenzije rastu same od sebe</Podvuceno>
              </span>
              <span className="lg:hidden">
                Recenzije rastu <Podvuceno>same od sebe</Podvuceno>
              </span>
            </h2>
            {/* Podnaslov 18px na mobilnom (bio ~20px, text-h3 pod) —
                eksplicitno traženo za sve sekcijske podnaslove OSIM hero-a,
                19.09.2026. lg:text-h3 vraća originalni deljeni token
                nepromenjen na desktopu. */}
            {/* Skraćeno (20.09.2026., "previse teksta, ne zelimo da velicina
                bude istaknuta, vise sejls ton") — najavljuje drugi proizvod
                (manji NFC stalak) pre nego što popup/korpa uopšte nauče da
                ga prodaju, BEZ dimenzija (te idu u Uslove/popup kasnije). */}
            <p className="m-0 font-tekst text-[18px] leading-heading text-text-quiet-on-inverse lg:text-h3">
              Stalak radi za vas i kad niste tu. Svaki dolazak mušterije je prilika da vas neko
              novi pronađe na Google-u. Veći stalak stoji na pultu i kod kase, dok manji NFC
              stalak, uglavnom pronalazi mesto na svakom stolu.
            </p>
            {/* Dugme SAKRIVENO na mobilnom (19.09.2026., "dugme poruci
                stalak zelimo da bude ispod slike stalka") — prva probana
                verzija je izvukla dugme u sopstveni grid red preko cele
                sekcije, ali je to poremetilo desktop: items-center na
                spoljašnjem grid-u centrira SVAKI red prema NAJVIŠEM
                elementu u njemu, pa je tekst (kraći od slike) postao
                vertikalno centriran usred visokog reda umesto da sedi uz
                dugme ispod sebe — razmak tekst→dugme je skočio sa 40px na
                skoro 190px. Vraćeno: dugme ostaje TU GDE JE UVEK BILO
                (unutar iste flex kolone kao naslov/tekst, desktop potpuno
                nepromenjen, izmereno identičnih 40px razmaka), samo
                sakriveno na mobilnom ("!hidden lg:!inline-flex" — "!" je
                obavezan jer Dugme.tsx već hardkoduje "inline-flex" u svom
                baznom className, isti obrazac kao Zaglavlje.tsx-ov desktop
                CTA). Mobilni duplikat je ispod, POSLE slike u DOM redosledu
                — isti "duplirano dugme za drugi breakpoint" obrazac kao
                Zaglavlje.tsx-ov meni ("Poruči" dole u mobilnom meniju je
                takođe duplikat desktop CTA dugmeta, ne isti element). */}
            <Dugme
              variant="gold"
              size="lg"
              className={`!hidden mt-2 lg:!inline-flex ${DUGME_ISTAKNUTO}`}
              onClick={() => otvoriModal()}
            >
              Poruči stalak
            </Dugme>
          </UNaVidiku>
          {/* Slika (20.09.2026., zamenjena gotovom kompozicijom oba
              proizvoda — vidi napomenu uz RAZMER_CARD_SEKCIJA iznad). Ista
              slika za desktop i mobilno, samo je desktop verzija u
              posebnom UNaVidiku (kašnjenje pri ulasku u vidno polje, kao
              ranije) dok mobilna nema animaciju (isti obrazac kao ostatak
              CARD sekcije — scroll-reveal je iskljucen na mobilnom). */}
          <UNaVidiku kasnjenje={150} className="relative hidden items-center justify-center lg:flex">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(55% 55% at 50% 45%, rgb(255 197 61 / 0.16), transparent 70%)",
              }}
            />
            <Image
              src="/images/card_sekcija.png"
              alt="Daj Peticu NFC stalak i kartica"
              width={1374}
              height={1145}
              sizes="(max-width: 1024px) 0px, 700px"
              quality={90}
              className="relative w-full max-w-[700px] object-contain"
            />
          </UNaVidiku>
          <div className="relative pt-2 lg:hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(55% 55% at 50% 45%, rgb(255 197 61 / 0.16), transparent 70%)",
              }}
            />
            <Image
              src="/images/card_sekcija.png"
              alt="Daj Peticu NFC stalak i kartica"
              width={1374}
              height={1145}
              sizes="100vw"
              quality={90}
              className="relative w-full object-contain"
            />
          </div>
          {/* Mobilni duplikat dugmeta (vidi napomenu uz desktop dugme
              iznad) — jedini vidljiv na mobilnom, posle slike u DOM-u. */}
          <Dugme
            variant="gold"
            size="lg"
            className={`lg:hidden ${DUGME_ISTAKNUTO}`}
            onClick={() => otvoriModal()}
          >
            Poruči stalak
          </Dugme>
        </div>
      </Sekcija>

      {/* ISKUSTVA */}
      <Sekcija id="iskustva" ton="alt">
        <UNaVidiku className="flex max-w-[62ch] flex-col items-start gap-4">
          <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-strong">
            <Podvuceno>Šta kažu vlasnici</Podvuceno>
          </h2>
          <p className="m-0 font-tekst text-[18px] leading-heading text-text-body lg:text-h3">
            Pridružite se biznisima koji već sakupljaju petice.
          </p>
        </UNaVidiku>
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <UNaVidiku rastegni>
            <Utisak
              citat="Stalak smo stavili na pult i već prve nedelje stigle su nove ocene. Mušterije ga same primete, tapnu telefonom i ostave recenziju dok čekaju."
              ime="Beooptika"
              posao="Optika"
              grad="Beograd"
              slika="/images/utisak-beooptika.png"
            />
          </UNaVidiku>
          <UNaVidiku rastegni kasnjenje={100}>
            <Utisak
              ton="inverse"
              citat="Stalak smo stavili na svaki sto. Gosti ga sami primete, mi ne moramo ništa da objašnjavamo, a recenzije stižu bez ikakvog podsećanja."
              ime="Gennaro"
              posao="Restoran"
              grad="Beograd"
              slika="/images/utisak-gennaro.png"
            />
          </UNaVidiku>
          <UNaVidiku rastegni kasnjenje={200}>
            <Utisak
              citat="Kod nas osoblje ne mora ništa da objašnjava, a recenzije rastu... pohvale."
              ime="Greenfeel"
              posao="Cvećara"
              grad="Beograd"
              slika="/images/utisak-greenfeel.png"
            />
          </UNaVidiku>
        </div>
      </Sekcija>

      {/* STRUKTURA — sekcija sa slojevima kartice (bivša "Zašto radi", preimenovana
          19.09.2026. jer ne objašnjava zašto radi, već od čega je kartica
          sastavljena). Redosled na stranici: hero, card, iskustva, struktura,
          kako radi, cene, pitanja. */}
      <Sekcija id="kartica-struktura" ton="inverse" className="nav-tamno">
        <KarticaSlojevi />
        <KarticaSlojeviStatic />
      </Sekcija>

      {/* KAKO RADI */}
      <Sekcija id="kako" ton="light">
        {/* Mobilno: običan stacked prikaz, bez sticky/scroll efekta (100vh se
            nepredvidivo ponaša na mobilnim browserima, a efekat suvišan na
            malom ekranu). Naslov je ovde jer za desktop ide unutar
            KakoRadiScroll (levo, iznad koraka, u istoj koloni sa slikom). */}
        <UNaVidiku className="flex max-w-[62ch] flex-col items-start gap-4 lg:hidden">
          <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-strong">
            <Podvuceno>Kako radi</Podvuceno>
          </h2>
          {/* 18px (isti zahtev kao CARD/ISKUSTVA/CIJENE) — ovaj blok je već
              lg:hidden pa nema potrebe za lg: revert. */}
          <p className="m-0 font-tekst text-[18px] leading-heading text-text-body">
            Mi ga podesimo. Vi ga stavite na željeno mesto.
          </p>
        </UNaVidiku>
        {/* Mobilno (19.09.2026.): sticky "scrollytelling" — sekcija se zaključa
            i na skrol smenjuje korake i sliku (cross-fade), pa se otpusti.
            Vidi KakoRadiMobilno.tsx. Naslov iznad ostaje običan. */}
        <KakoRadiMobilno />
        {/* Desktop: sekcija se "zaključa" i koraci se ređaju kako se skroluje. */}
        <KakoRadiScroll />
      </Sekcija>

      {/* CIJENE */}
      <Sekcija id="cijene" ton="inverse" className="nav-tamno">
        <UNaVidiku className="flex max-w-[62ch] flex-col items-start gap-4">
          <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-on-inverse">
            {/* Isti obrazac kao CARD naslov (19.09.2026.) — eksplicitan
                prelom TAČNO posle "Bez" na mobilnom ("Bez pretplate. Bez" /
                "mesečnih troškova."), i podvlaka SAMO na "mesečnih
                troškova." u njenoj sopstvenoj širini. Desktop nepromenjen
                (cela rečenica u jednom Podvuceno-u, uvek jedan red). */}
            <span className="hidden lg:inline">
              <Podvuceno>Bez pretplate. Bez mesečnih troškova.</Podvuceno>
            </span>
            <span className="lg:hidden">
              Bez pretplate. Bez
              <br />
              <Podvuceno>mesečnih troškova.</Podvuceno>
            </span>
          </h2>
          <p className="m-0 font-tekst text-[18px] leading-heading text-text-quiet-on-inverse lg:text-h3">
            Više stalaka znači više prilika da vas mušterija oceni, i nižu cenu po stalku.
          </p>
        </UNaVidiku>
        <Cenovnik onOdaberi={(n, v) => otvoriModal(n, v)} />
      </Sekcija>

      {/* PITANJA */}
      <Sekcija id="pitanja" ton="light">
        <div className="mx-auto w-full max-w-[760px]">
          <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-strong">
            <Podvuceno>Najčešća pitanja</Podvuceno>
          </h2>
          <div className="mt-8">
            <Akordeon prvoOtvoreno="Radi li na svakom telefonu?">
              <PitanjeOdgovor pitanje="Radi li na svakom telefonu?">
                iPhone 7 i noviji čitaju stalak bez ikakve aplikacije. Kod Androida je potrebno da
                NFC bude uključen, kod većine telefona već jeste.
              </PitanjeOdgovor>
              <PitanjeOdgovor pitanje="Plaćam li nešto mesečno?">
                Ne. Kupujete stalak jednom i on je vaš. Nema pretplate i nema naknadnih troškova.
              </PitanjeOdgovor>
              <PitanjeOdgovor pitanje="Koliko brzo stiže?">
                Podesimo ga istog ili sledećeg radnog dana i šaljemo poštom. Obično je kod vas za 2
                dana.
              </PitanjeOdgovor>
              <PitanjeOdgovor pitanje="Može li neko da promeni link na stalku?">
                Ne. Posle podešavanja zaključamo čip, tako da se link ne može prepisati.
              </PitanjeOdgovor>
              <PitanjeOdgovor pitanje="Treba li mi Google profil?">
                Da, potreban vam je Google My Business profil. Ako ga nemate, napravite ga besplatno
                za par minuta, ili nam recite i provedemo vas kroz to telefonom.
              </PitanjeOdgovor>
              <PitanjeOdgovor pitanje="Imate li još pitanja?">
                Pošaljite nam pitanje na{" "}
                <a href={`mailto:${site.email}`} className="text-primary underline">
                  {site.email}
                </a>
                , rado ćemo odgovoriti.
              </PitanjeOdgovor>
            </Akordeon>
          </div>
        </div>
      </Sekcija>
    </>
  );
}

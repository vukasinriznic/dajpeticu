"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dugme, DUGME_ISTAKNUTO } from "@/components/core/Dugme";
import { OcenaZvezdicama } from "@/components/core/OcenaZvezdicama";
import { Podvuceno } from "@/components/core/Podvuceno";
import { KorakStavka } from "@/components/marketing/KorakStavka";
import { Utisak } from "@/components/marketing/Utisak";
import { Akordeon, PitanjeOdgovor } from "@/components/marketing/PitanjeOdgovor";
import { Sekcija } from "@/components/sajt/Sekcija";
import { UNaVidiku } from "@/components/core/UNaVidiku";
import { Kartica3D } from "@/components/sajt/Kartica3D";
import { DemoDodira } from "@/components/sajt/DemoDodira";
import { KakoRadiScroll } from "@/components/sajt/KakoRadiScroll";
import { KarticaSlojevi, KarticaSlojeviStatic } from "@/components/sajt/KarticaSlojevi";
import { Cenovnik } from "@/components/sajt/Cenovnik";
import { useKorpa } from "@/components/sajt/KorpaKontekst";
import { site } from "@/lib/site";

function idiNa(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
}

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
  // KarticaSlojevi.tsx/DemoDodira.tsx, umesto fiksnog broja koji bi na
  // uskim telefonima štrčao van ekrana. Plafon (wrapper max-w ispod)
  // usklađen na 524px (19.09.2026., eksplicitno traženo — "ista veličina
  // kao slika u CARD sekciji", koja koristi Kartica3D sirina={524} i
  // oslanja se na flexbox shrink umesto JS merenja). Obe sad računaju
  // IDENTIČNU formulu — min(dostupna širina, 524) — samo različitim
  // mehanizmom (JS ovde, CSS flex-shrink tamo), pa se poklapaju piksel
  // za piksel na svakoj širini, ne samo približno na uskim telefonima.
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
        className="relative grid min-h-screen content-start lg:content-center overflow-hidden bg-surface-0 px-5 pt-28 pb-[clamp(56px,9vw,120px)] lg:py-8"
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
          {/* items-center lg:items-start (19.09.2026.) — naslov i podnaslov
              centrirani na mobilnom, po istom obrascu kao slika/dugme/
              zvezde/tekst ispod (sve već centrirano); desktop nepromenjen
              (items-start, levo poravnato). */}
          <div className="flex min-w-0 flex-col items-center gap-5 lg:items-start">
            {/* Svaki red se otkriva sleva nadesno (dp-otkrivanje-sleva) —
                eksplicitna odluka da naslov, iako je LCP element, dobije
                upečatljiv ulazak; trajanja su kratka (700ms) da hit na
                percepciju brzine učitavanja ostane mali. Podvlaka ispod
                "pet zvezdica" se namerno NE otkriva u isto vreme — vidi
                podvucenoIscrtano gore, povlači se tek pošto se ceo hero
                sleže. */}
            {/* Mobilni pod 60px (3.75rem), bio 56px — eksplicitno traženo
                19.09.2026. Desktop max (6.5rem) nepromenjen. */}
            <h1 className="m-0 text-center font-prikaz text-[clamp(3.75rem,7.5vw,6.5rem)] leading-display font-semibold tracking-display text-text-strong lg:text-left">
              <span className="inline-block animate-[dp-otkrivanje-sleva_700ms_cubic-bezier(.2,.7,.3,1)_both]">
                Jedan tap
              </span>
              <br />
              <span className="inline-block animate-[dp-otkrivanje-sleva_700ms_cubic-bezier(.2,.7,.3,1)_150ms_both] text-primary">
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
                  (1.25rem, bio 18px) — eksplicitno traženo 19.09.2026. */}
              <p
                className="m-0 max-w-[46ch] text-center font-prikaz text-[clamp(1.25rem,2.6vw,1.4rem)] leading-heading font-medium text-text-strong whitespace-nowrap lg:text-left"
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
              {/* VRAĆENO na centrirano (19.09.2026., isti dan — korisnik
                  prvo tražio levo poravnanje, pa se predomislio nazad na
                  centar). poravnanje prop na Kartica3D uklonjen (default je
                  "center", vidi Kartica3D.tsx). mx-auto centrira omotač
                  samog, justify-center centrira fotografiju unutar njega. */}
              <div ref={mobilnaSlikaRef} className="mx-auto flex w-full max-w-[524px] justify-center pt-2">
                <Kartica3D sirina={sirinaMobilneSlike} />
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

                w-full justify-center (mobilno, isti dan) — dugme centrirano
                na sredinu ekrana, jedini element koji odudara od inače
                levo poravnate hero kolone (items-start na roditelju).
                lg:w-auto lg:justify-start vraća desktop na originalno
                ponašanje (dugme prati levi rub kolone kao i ostatak). */}
            <UNaVidiku kasnjenje={120} className="flex w-full flex-wrap items-center justify-center gap-3 lg:w-auto lg:justify-start lg:mt-4">
              <Dugme
                size="lg"
                className={DUGME_ISTAKNUTO}
                onClick={() => otvoriModal()}
              >
                Poruči stalak
              </Dugme>
            </UNaVidiku>
            {/* Mobilno: zvezde i tekst u odvojenim redovima (traženo
                18.09.2026. — na mobilnom je tekst upadao u isti red kao
                zvezde). Desktop nepromenjen (flex-row, jedan red).

                Zvezde vraćene, ali centrirane na mobilnom (19.09.2026.,
                korisnik se predomislio — prvo uklonjene, pa vraćene istog
                dana). Roditelj je flex-col items-center na mobilnom, pa
                zvezde (nisu w-full) prirodno sede centrirane iznad teksta
                bez ikakvog dodatnog poravnanja. Tekst dobija "w-full
                text-center" na mobilnom, lg:w-auto lg:text-left vraća
                desktop na originalno ponašanje (jedan red, levo). */}
            <UNaVidiku kasnjenje={240} className="flex w-full flex-col items-center gap-2 lg:w-auto lg:flex-row lg:items-center lg:gap-3">
              <OcenaZvezdicama velicina={22} />
              <span className="w-full text-center font-tekst text-body-sm text-text-muted lg:w-auto lg:text-left">
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
      <Sekcija id="card" ton="alt" className="nav-tamno !bg-[#0B2E20]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <UNaVidiku className="flex max-w-[62ch] flex-col items-start gap-8">
            <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-on-inverse">
              <Podvuceno prelomNaMobilnom>Recenzije rastu same od sebe</Podvuceno>
            </h2>
            <p className="m-0 font-tekst text-h3 leading-heading text-text-quiet-on-inverse">
              Stalak radi za vas i kad niste tu. Svaki dolazak mušterije je prilika da vas neko
              novi pronađe na Google-u.
            </p>
            <Dugme
              variant="gold"
              size="lg"
              className={`mt-2 ${DUGME_ISTAKNUTO}`}
              onClick={() => otvoriModal()}
            >
              Poruči stalak
            </Dugme>
          </UNaVidiku>
          <UNaVidiku kasnjenje={150} className="relative flex justify-center">
            {/* Brend-tonirani glow iza kartice — ista logika kao radijalni
                sloj u hero-u, ovde u zlatnoj nijansi da poveže sa "Poruči
                karticu" dugmetom i zvezdicama. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(55% 55% at 50% 45%, rgb(255 197 61 / 0.16), transparent 70%)",
              }}
            />
            <Kartica3D sirina={524} interaktivna={false} />
          </UNaVidiku>
        </div>
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
          <p className="m-0 font-tekst text-h3 leading-heading text-text-body">
            Mi ga podesimo. Vi ga stavite na željeno mesto.
          </p>
        </UNaVidiku>
        <div className="grid grid-cols-1 gap-12 lg:hidden">
          <div className="flex flex-col gap-8">
            <UNaVidiku>
              <KorakStavka broj={1} naslov="Postavite stalak">
                Tamo gde pogled mušterije prirodno pada dok čeka, na pultu, stolu ili kod kase.
              </KorakStavka>
            </UNaVidiku>
            <UNaVidiku kasnjenje={100}>
              <KorakStavka broj={2} naslov="Mušterija tapne ili skenira">
                Odmah se otvara vaša Google strana za ocenu, bez pretrage i čekanja.
              </KorakStavka>
            </UNaVidiku>
            <UNaVidiku kasnjenje={200}>
              <KorakStavka broj={3} naslov="Recenzija je objavljena">
                Čestitamo, upravo ste povećali šanse da vas pronađe nova mušterija.
              </KorakStavka>
            </UNaVidiku>
          </div>
          <UNaVidiku kasnjenje={150}>
            <DemoDodira />
          </UNaVidiku>
        </div>
        {/* Desktop: sekcija se "zaključa" i koraci se ređaju kako se skroluje. */}
        <KakoRadiScroll />
      </Sekcija>

      {/* KARTICA_STRUKTURA — bivša "Zašto radi", inverzna sekcija. Premeštena
          da ide odmah posle "Kako radi" (pre "Cijene"). */}
      <Sekcija id="kartica-struktura" ton="inverse" className="nav-tamno">
        <KarticaSlojevi />
        <KarticaSlojeviStatic />
      </Sekcija>

      {/* ISKUSTVA */}
      <Sekcija id="iskustva" ton="alt">
        <UNaVidiku className="flex max-w-[62ch] flex-col items-start gap-4">
          <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-strong">
            <Podvuceno>Šta kažu vlasnici</Podvuceno>
          </h2>
          <p className="m-0 font-tekst text-h3 leading-heading text-text-body">
            Pridružite se biznisima koji već sakupljaju petice.
          </p>
        </UNaVidiku>
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <UNaVidiku rastegni>
            <Utisak
              citat="Stavio sam stalak na pult u ponedeljak, do petka smo imali više novih ocena nego za prethodna 2 meseca."
              ime="Marko Jović"
              posao="Frizerski salon"
              grad="Kragujevac"
            />
          </UNaVidiku>
          <UNaVidiku rastegni kasnjenje={100}>
            <Utisak
              ton="inverse"
              citat="Na prvu mi je delovalo skupo staviti stalak na svaki sto. Ispostavilo se da je to bila najisplativija odluka, recenzije stižu neprekidno. Preporuka!"
              ime="Tijana Ilić"
              posao="Kafić"
              grad="Novi Sad"
            />
          </UNaVidiku>
          <UNaVidiku rastegni kasnjenje={200}>
            <Utisak
              citat="Kod nas osoblje ne mora ništa da objašnjava, a recenzije rastu... pohvale."
              ime="Dušan Petrović"
              posao="Restoran"
              grad="Niš"
            />
          </UNaVidiku>
        </div>
      </Sekcija>

      {/* CIJENE */}
      <Sekcija id="cijene" ton="inverse" className="nav-tamno">
        <UNaVidiku className="flex max-w-[62ch] flex-col items-start gap-4">
          <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-on-inverse">
            <Podvuceno prelomNaMobilnom>Bez pretplate. Bez mesečnih troškova.</Podvuceno>
          </h2>
          <p className="m-0 font-tekst text-h3 leading-heading text-text-quiet-on-inverse">
            Više stalaka znači više prilika da vas mušterija oceni, i nižu cenu po stalku.
          </p>
        </UNaVidiku>
        <Cenovnik onOdaberi={(n) => otvoriModal(n)} />
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

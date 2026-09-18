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
  // uskim telefonima štrčao van ekrana.
  const mobilnaSlikaRef = useRef<HTMLDivElement>(null);
  const [sirinaMobilneSlike, setSirinaMobilneSlike] = useState(280);
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
        className="relative grid min-h-screen content-start lg:content-center overflow-hidden bg-surface-0 px-5 pt-28 pb-8 lg:py-8"
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
            Gradijent je najjači tačno iza teksta (levo) i nestaje ka desnoj
            strani gde je kartica, da se pozadina tamo i dalje vidi. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgb(255 255 255 / 0.82) 0%, rgb(255 255 255 / 0.6) 32%, rgb(255 255 255 / 0.15) 55%, transparent 72%)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-[var(--container)] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-5">
            {/* Svaki red se otkriva sleva nadesno (dp-otkrivanje-sleva) —
                eksplicitna odluka da naslov, iako je LCP element, dobije
                upečatljiv ulazak; trajanja su kratka (700ms) da hit na
                percepciju brzine učitavanja ostane mali. Podvlaka ispod
                "pet zvezdica" se namerno NE otkriva u isto vreme — vidi
                podvucenoIscrtano gore, povlači se tek pošto se ceo hero
                sleže. */}
            <h1 className="m-0 font-prikaz text-[clamp(3.5rem,7.5vw,6.5rem)] leading-display font-semibold tracking-display text-text-strong">
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
                  clamp umesto deljenog tokena, isti vw/max kao text-h3
                  (2.6vw, 1.5rem) da desktop ostane nepromenjen, samo je
                  mobilni pod spušten na 18px (18.09.2026., eksplicitno
                  traženo). <br/> umesto prirodnog prelamanja — dve rečenice
                  uvek idu u dva reda, ne zavisi od širine ekrana. */}
              <p
                className="m-0 max-w-[46ch] font-prikaz text-[clamp(1.125rem,2.6vw,1.5rem)] leading-heading font-medium text-text-strong"
                style={{ transform: "translateY(2px)" }}
              >
                Konkurencija nije bolja od vas.
                <br />
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
              <div ref={mobilnaSlikaRef} className="mx-auto flex w-full max-w-[320px] justify-center py-2">
                <Kartica3D sirina={sirinaMobilneSlike} />
              </div>
            </UNaVidiku>
            <UNaVidiku kasnjenje={120} className="mt-4 flex flex-wrap items-center gap-3">
              <Dugme
                size="lg"
                className={DUGME_ISTAKNUTO}
                onClick={() => otvoriModal()}
              >
                Poruči stalak
              </Dugme>
            </UNaVidiku>
            <UNaVidiku kasnjenje={240} className="flex items-center gap-3">
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
      <Sekcija id="card" ton="alt" className="nav-tamno !bg-[#0B2E20]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <UNaVidiku className="flex max-w-[62ch] flex-col items-start gap-8">
            <h2 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-on-inverse">
              <Podvuceno>Recenzije rastu same od sebe</Podvuceno>
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
            <Podvuceno>Bez pretplate. Bez mesečnih troškova.</Podvuceno>
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

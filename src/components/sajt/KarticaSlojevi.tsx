"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Podvuceno } from "@/components/core/Podvuceno";

// Redosled je od prednje strane ka zadnjoj. Slike iz public/kartica/ su
// prethodno svedene na isti četvorougao (homografija nad originalima iz
// public/sloj_*.png), na platno 2520px, pa im se telo kartice poklapa u
// granicama pola procenta. Platno je namerno veliko: pri svođenju se
// sloj_1 najviše menja i na manjem platnu je gubio oko trećine vertikalne
// rezolucije.
//
// `skala` zatvara ono što ostaje: tela se poklapaju, ali meki oreol oko
// svakog sloja ne, pa je na sklopljenoj kartici curilo oko 1.300 piksela
// tanke ivice. Merenjem nad stvarnim renderom (ne nad idealizovanim
// maskama — bilinearno uzorkovanje razliva alfu dalje nego što se očekuje)
// curenje pada na nulu ispod 0.95. Uzeto je 0.93-0.92 za slojeve 2-4, sa
// rezervom i monotono opadajuće po dubini, pa dublji sloj deluje i malo
// dalji. Sloj 1 je izuzetak (0.96, veće od ostalih): nova fotografija
// (13.09) ima oštru ivicu pa na skala:1 vizuelno "štrči", ali sloj_3 (bakarna
// antena) ima siluetu koja blago odstupa od kanonske (izmereno, ne
// idealizovano), pa sloj 1 mora dovoljno da je premaši sa svih strana da
// ne bi curilo u uglovima gde su ta odstupanja najveća (dole i levo).
const SLOJEVI = [
  { slika: "/images/kartica/sloj_1.webp", opis: "Prednja strana sa Google oznakom i QR kodom", skala: 0.96 },
  { slika: "/images/kartica/sloj_2.webp", opis: "Zaštitni sloj sa ležištem za čip", skala: 0.93 },
  { slika: "/images/kartica/sloj_3.webp", opis: "Bakarna antena i NFC čip", skala: 0.925 },
  { slika: "/images/kartica/sloj_4.webp", opis: "Zadnja osnova stalka", skala: 0.92 },
];

// Kartica se rastavlja po Z osi (dubini), a cela grupa se pritom naginje
// unazad. Na početku je razmak po Z tačno nula, pa su svi slojevi u istoj
// ravni i kartica je sklopljena po geometriji, a ne po podešavanju — i to
// važi pri bilo kom nagibu, jer se grupa rotira kao celina.
//
// Kartica kreće već nagnuta, u tročetvrtinskom pogledu. Razlog nije samo
// izgled: vidljivost razmaka zavisi od PROIZVODA razmaka i sin(nagiba), pa
// kad oba krenu od nule, prva trećina skrola ode na golu rotaciju u kojoj
// se nijedan sloj još ne pomalja. Sa početnim nagibom sinus je odmah
// pristojan, pa razdvajanje počne da se vidi gotovo odmah.
const NAGIB_POCETNI = 20;
const NAGIB_KRAJNJI = 55;

// Razmak ide po krivoj, ne linearno — diže se rano dok nagib još stiže.
// Zajedno sa početnim nagibom, slojevi se razdvoje unutar prvih ~10%
// skrola umesto tek posle trećine.
const KRIVA_RAZMAKA = 0.65;

// Kartica na početku zauzima veći deo ekrana pa se kroz animaciju smanjuje,
// tako da rastavljeni slojevi na kraju stanu u kadar. scale3d (ne scale)
// namerno: 2D skala ne dira Z osu, pa bi se kartica smanjivala dok bi
// razmak između slojeva ostajao isti — gomila bi se raspala.
const SKALA_POCETNA = 1.24;
const SKALA_KRAJNJA = 1;

// Slike su snimljene sa karticom zakošenom oko 9° u ravni. Na početku se ta
// košnja umanjuje otprilike na pola (ostaje ~4°) — sasvim uspravna kartica
// deluje ukočeno, a puna košnja previše nakrivo. Do kraja animacije se
// pušta nazad na 0, jer zakošena gomila bolje čita kao izometrijski
// rastavljen prikaz.
const ROTACIJA_POCETNA = 5;
const ROTACIJA_KRAJNJA = 0;

// Razmak između susednih slojeva, kao udeo širine kutije. Čip na sloju 3
// stoji u centru kartice (y 1146-1354 od 2520), a sloj 2 mu seže do 0.279
// visine ispod svog centra, pa ga oslobađa tek razmak veći od
// 0.324 × cot(nagib) — na 55° to je 0.227. Uzeto 0.25, sa rezervom.
const RAZMAK_Z = 0.25;

// Blaga perspektiva: dovoljna da se oseti dubina, a da zadnji sloj ne
// ispadne upadljivo sitniji od prednjeg (na ±1.5 razmaka daje oko ±10%).
const PERSPEKTIVA = 2600;

// Animacija se završi pre kraja skrola da rastavljena kartica ostane da
// "stoji" još malo pre nego što se sekcija otkači — inače poslednji kadar
// prođe u trenutku.
const KRAJ = 0.85;

function stilGrupe(otvorenost: number) {
  const nagib = NAGIB_POCETNI + (NAGIB_KRAJNJI - NAGIB_POCETNI) * otvorenost;
  const rotacija = ROTACIJA_POCETNA + (ROTACIJA_KRAJNJA - ROTACIJA_POCETNA) * otvorenost;
  const skala = SKALA_POCETNA + (SKALA_KRAJNJA - SKALA_POCETNA) * otvorenost;
  return {
    transformStyle: "preserve-3d" as const,
    // Čita se zdesna nalevo: prvo se cela gomila skalira, pa ispravi u svojoj
    // ravni, pa nagne unazad.
    transform: `rotateX(${nagib}deg) rotateZ(${rotacija}deg) scale3d(${skala}, ${skala}, ${skala})`,
  };
}

// Razmak po dubini za dati sloj. Izdvojeno jer isti proračun treba i
// oznakama sa strane, a rasklopiti ga na dva mesta znači da se razidju.
function dubinaSloja(i: number, otvorenost: number, sirinaKutije: number, skala: number) {
  const napredak = Math.pow(otvorenost, KRIVA_RAZMAKA);
  return ((SLOJEVI.length - 1) / 2 - i) * RAZMAK_Z * sirinaKutije * napredak * skala;
}

function stilSloja(sloj: (typeof SLOJEVI)[number], i: number, otvorenost: number, sirinaKutije: number) {
  // Prednji sloj ide ka gledaocu, zadnji od njega — gomila ostaje centrirana.
  // Bez skale ovde: scale3d na grupi već skalira i Z osu.
  const z = dubinaSloja(i, otvorenost, sirinaKutije, 1);
  return { transform: `translateZ(${z}px) scale(${sloj.skala})` };
}

// Redosled crtanja je obrnut od logičkog: zadnja strana kartice ide PRVA u
// DOM, prednja poslednja. Razlog je što u preserve-3d kontekstu z-index ne
// važi — slojevi se slikaju po dubini, a na početku animacije su svi na
// z = 0, dakle komplanarni, pa o redosledu odlučuje DOM. Bez ovoga zadnja
// strana prekrije prednju dok je kartica sklopljena.
const CRTANJE = SLOJEVI.map((sloj, i) => ({ sloj, i })).reverse();

const OZNAKE = [
  { strana: "levo", naslov: "Prednja strana", tekst: "12,75 × 7,6 cm, taman toliko da upadne u oči." },
  { strana: "desno", naslov: "Zaštitni sloj", tekst: "Štiti čip i drži ga čvrsto na mestu." },
  { strana: "levo", naslov: "NFC čip", tekst: "Mi ga podesimo i zaključamo, zauvek ostaje vaš link." },
  { strana: "desno", naslov: "Zadnja strana", tekst: "Osnova koja sve spaja u jednu čvrstu celinu." },
] as const;

// Poluširina kartice u platnu (četvorougao ide od x=527 do x=2024 od 2520).
const POLU_SIRINA = 748.5 / 2520;

// Odmak i širina oznaka se izvode iz raspoloživog prostora, ne fiksno:
// na 1024px (najuži desktop) fiksne vrednosti po strani izlaze iz ekrana.
const ODMAK_OZNAKE = 300;
// Naslov je pod podvlakom, koja ne prelama red — okvir mora da primi i
// najduži ("Prednja strana") u jednoj liniji.
const SIRINA_OZNAKE = 230;
const RUB = 20;

// Linija se zaustavlja pre teksta da se ne dodiruju.
const RAZMAK_DO_TEKSTA = 16;

// Koliko oznaka doklizi naviše dok se pojavljuje.
const ULAZ_OZNAKE = 12;

function meraOznaka(sirinaOkvira: number) {
  const pola = sirinaOkvira / 2 - RUB;
  const sirina = Math.min(SIRINA_OZNAKE, pola * 0.45);
  return { sirina, odmak: Math.min(ODMAK_OZNAKE, pola - sirina) };
}

// Oznake ulaze pred kraj, kad slojevi već stoje razdvojeno, i to jedna za
// drugom odozgo nadole — redosled ulaska prati redosled slojeva u gomili.
// Poslednja se dovrši tačno na kraju animacije.
const POJAVA_OZNAKA = 0.62;
const KORAK_OZNAKE = 0.07;
const TRAJANJE_OZNAKE = 1 - POJAVA_OZNAKA - KORAK_OZNAKE * (OZNAKE.length - 1);

// Gde se sloj nađe na ekranu i koliko je široka kartica na toj dubini —
// isti proračun koji browser radi nad transformacijama, samo unapred, da bi
// tekst i linija mogli da se poklope sa svojim slojem. Oznake stoje IZVAN
// 3D grupe (inače bi se i one naginjale), pa im pozicija mora ovako.
function geometrijaSloja(i: number, otvorenost: number, W: number) {
  const nagib = ((NAGIB_POCETNI + (NAGIB_KRAJNJI - NAGIB_POCETNI) * otvorenost) * Math.PI) / 180;
  const skala = SKALA_POCETNA + (SKALA_KRAJNJA - SKALA_POCETNA) * otvorenost;
  const z = dubinaSloja(i, otvorenost, W, skala);
  const perspektiva = PERSPEKTIVA / (PERSPEKTIVA - z * Math.cos(nagib));
  return {
    y: -z * Math.sin(nagib) * perspektiva,
    poluSirina: POLU_SIRINA * W * SLOJEVI[i].skala * skala * perspektiva,
  };
}

function Oznake({
  otvorenost,
  sirina,
  sirinaOkvira,
}: {
  otvorenost: number;
  sirina: number;
  sirinaOkvira: number;
}) {
  if (!sirina || !sirinaOkvira) return null;
  const mera = meraOznaka(sirinaOkvira);

  return (
    <div className="pointer-events-none absolute inset-0">
      {OZNAKE.map((o, i) => {
        const { y, poluSirina } = geometrijaSloja(i, otvorenost, sirina);
        const levo = o.strana === "levo";
        const duzinaLinije = Math.max(mera.odmak - RAZMAK_DO_TEKSTA - poluSirina, 0);
        const vidljivost = Math.min(
          Math.max((otvorenost - (POJAVA_OZNAKA + i * KORAK_OZNAKE)) / TRAJANJE_OZNAKE, 0),
          1,
        );
        const ulaz = (1 - vidljivost) * ULAZ_OZNAKE;
        // Tekst je uvek levo poravnat, i sa leve i sa desne strane kartice —
        // ravna leva ivica se lakše čita od poravnanja uz liniju.
        const stranaTeksta = levo
          ? { right: `calc(50% + ${mera.odmak}px)`, textAlign: "left" as const }
          : { left: `calc(50% + ${mera.odmak}px)`, textAlign: "left" as const };
        const stranaLinije = levo
          ? { right: `calc(50% + ${poluSirina}px)` }
          : { left: `calc(50% + ${poluSirina}px)` };

        return (
          <div key={o.naslov} style={{ opacity: vidljivost }}>
            <div
              aria-hidden="true"
              className="absolute h-px bg-white/30"
              style={{ ...stranaLinije, top: "50%", width: duzinaLinije, transform: `translateY(${y}px)` }}
            />
            {/* Širina po sadržaju (uz gornju granicu): okvir se skuplja do
                teksta, pa linija dočeka tekst umesto da se kači na praznu
                ivicu fiksnog okvira — što se videlo kod kratkih naslova sa
                leve strane. gap-2.5 jer podvlaka visi ispod osnovne linije. */}
            <div
              className="absolute flex flex-col gap-2.5"
              style={{
                ...stranaTeksta,
                top: "50%",
                width: "max-content",
                maxWidth: mera.sirina,
                transform: `translateY(calc(-50% + ${y + ulaz}px))`,
              }}
            >
              <span className="font-prikaz text-h3 leading-heading font-normal text-text-on-inverse">
                <span className="mr-2 text-[var(--color-gold)]">{i + 1}</span>
                <Podvuceno>{o.naslov}</Podvuceno>
              </span>
              <p className="m-0 font-tekst text-body-sm leading-body text-text-quiet-on-inverse">
                {o.tekst}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Rastavljena kartica bez zaključavanja ekrana — koristi je i mobilni i
// desktop kad korisnik traži manje kretanja. maxSirina je opciono — kad se
// izostavi (mobilni poziv, KarticaSlojeviStatic ispod), slika ide na punu
// širinu kolone (19.09.2026., eksplicitno traženo — "full width naseg
// containera"; brojevi sa strane isprobani pa OTKAZANI istom porukom).
function StatickiPrikaz({ maxSirina }: { maxSirina?: number }) {
  const kutijaRef = useRef<HTMLDivElement>(null);
  const [sirina, setSirina] = useState(0);

  useEffect(() => {
    const izmeri = () => {
      const k = kutijaRef.current;
      if (k) setSirina(k.offsetWidth);
    };
    izmeri();
    window.addEventListener("resize", izmeri);
    return () => window.removeEventListener("resize", izmeri);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="mx-auto w-full" style={{ perspective: `${PERSPEKTIVA}px`, maxWidth: maxSirina }}>
        <div ref={kutijaRef} className="relative aspect-square" style={stilGrupe(1)}>
          {CRTANJE.map(({ sloj, i }) => (
            <div key={sloj.slika} className="absolute inset-0" style={stilSloja(sloj, i, 1, sirina)}>
              <Image src={sloj.slika} alt={sloj.opis} fill sizes="640px" quality={90} className="object-contain" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {OZNAKE.map((o, i) => (
          <div key={o.naslov} className="flex flex-col gap-2.5">
            <span className="font-prikaz text-h3 leading-heading font-normal text-text-on-inverse">
              <span className="mr-2 text-[var(--color-gold)]">{i + 1}</span>
              <Podvuceno>{o.naslov}</Podvuceno>
            </span>
            <p className="m-0 font-tekst text-body-sm leading-body text-text-quiet-on-inverse">
              {o.tekst}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Koliko slika svakog kadra sustiže skrol. Niže = mekše, ali i tromije.
const PRIGUSENJE = 0.12;

export function KarticaSlojevi() {
  const omotacRef = useRef<HTMLDivElement>(null);
  const kutijaRef = useRef<HTMLDivElement>(null);
  const okvirRef = useRef<HTMLDivElement>(null);
  const [progres, setProgres] = useState(0);
  const [sirina, setSirina] = useState(0);
  const [sirinaOkvira, setSirinaOkvira] = useState(0);
  const [smanjenoKretanje, setSmanjenoKretanje] = useState(false);

  useEffect(() => {
    const upit = window.matchMedia("(prefers-reduced-motion: reduce)");
    const primeni = () => setSmanjenoKretanje(upit.matches);
    primeni();
    upit.addEventListener("change", primeni);
    return () => upit.removeEventListener("change", primeni);
  }, []);

  useEffect(() => {
    const el = omotacRef.current;
    if (!el || smanjenoKretanje) return;

    let cilj = 0;
    let trenutni = 0;
    let petlja = 0;

    const izmeri = () => {
      const r = el.getBoundingClientRect();
      const ukupno = r.height - window.innerHeight;
      cilj = ukupno > 0 ? Math.min(Math.max(-r.top / ukupno, 0), 1) : 0;
      // Širine se mere ovde — translateZ mora u pikselima (CSS ne prima
      // procente), pa razmak mora da prati stvarnu veličinu kutije.
      // offsetWidth, ne getBoundingClientRect: ovaj drugi vraća projektovanu
      // širinu (kutija je pod rotateX u perspektivi), pa bi razmak rastao
      // zajedno sa nagibom i sam sebe pojačavao.
      const k = kutijaRef.current;
      if (k) setSirina(k.offsetWidth);
      const okvir = okvirRef.current;
      if (okvir) setSirinaOkvira(okvir.offsetWidth);
    };

    // Slika ne prati skrol jedan-na-jedan nego ga sustiže. Točkić miša
    // skroluje u koracima od ~100px, a celu animaciju pokreće oko 900px —
    // bez ovoga jedan zarez točkića pomeri animaciju za desetak procenata
    // odjednom, što se vidi kao skok.
    const kadar = () => {
      const razlika = cilj - trenutni;
      trenutni = Math.abs(razlika) < 0.0005 ? cilj : trenutni + razlika * PRIGUSENJE;
      setProgres(trenutni);
      petlja = trenutni === cilj ? 0 : requestAnimationFrame(kadar);
    };

    const naSkrol = () => {
      izmeri();
      if (!petlja) petlja = requestAnimationFrame(kadar);
    };

    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    window.addEventListener("resize", naSkrol);
    return () => {
      window.removeEventListener("scroll", naSkrol);
      window.removeEventListener("resize", naSkrol);
      if (petlja) cancelAnimationFrame(petlja);
    };
  }, [smanjenoKretanje]);

  // Uz prefers-reduced-motion nema ni zaključavanja ekrana ni 3D vrtnje —
  // ista kartica, samo odmah rastavljena i mirna.
  if (smanjenoKretanje) {
    return (
      <div className="hidden lg:block">
        <StatickiPrikaz maxSirina={520} />
      </div>
    );
  }

  const otvorenost = Math.min(progres / KRAJ, 1);

  return (
    <div ref={omotacRef} className="relative hidden lg:block" style={{ height: "200vh" }}>
      <div
        ref={okvirRef}
        className="sticky top-20 flex h-[calc(100vh-80px)] items-center justify-center"
        style={{ perspective: `${PERSPEKTIVA}px` }}
      >
        {/* Rastavljena kompozicija iznosi ~0.93 × širine kutije, pa je kutija
            ograničena na 83vh da bi na kraju stala ispod 80vh. */}
        <div
          ref={kutijaRef}
          className="relative aspect-square"
          style={{ width: "min(820px, 100%, 83vh)", ...stilGrupe(otvorenost) }}
        >
          {CRTANJE.map(({ sloj, i }) => (
            <div
              key={sloj.slika}
              className="absolute inset-0"
              style={stilSloja(sloj, i, otvorenost, sirina)}
            >
              {/* sizes = kutija × SKALA_POCETNA, tj. najveća širina koju slika
                  stvarno zauzme (na početku animacije). Browser to sam množi
                  gustinom ekrana, pa ne treba ništa dodavati za retinu. */}
              <Image src={sloj.slika} alt={sloj.opis} fill sizes="930px" quality={90} className="object-contain" />
            </div>
          ))}
        </div>
        <Oznake otvorenost={otvorenost} sirina={sirina} sirinaOkvira={sirinaOkvira} />
      </div>
    </div>
  );
}

// Mobilno: bez zaključavanja ekrana (100vh je nepredvidiv na mobilnim
// browserima, isti razlog kao kod KakoRadiScroll) — kartica se prikazuje već
// rastavljena, kao obična statična ilustracija. Puna Oznaka (naslov+opis)
// nema gde da stane na uskom ekranu, pa taj sadržaj ide kao lista ispod.
// Linija+broj sa strane (dodato pa OTKAZANO 19.09.2026., isti dan) —
// korisnik je prvo tražio da izgleda kao desktop oznaka (broj+linija,
// bez teksta), pa se predomislio: bez brojeva, slika na PUNU širinu
// kolone (maxSirina izostavljen — bez njega StatickiPrikaz-ov "w-full"
// se ničim ne ograničava).
export function KarticaSlojeviStatic() {
  return (
    <div className="lg:hidden">
      <StatickiPrikaz />
    </div>
  );
}

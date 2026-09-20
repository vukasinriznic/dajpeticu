import type { Metadata } from "next";
import Link from "next/link";
import { Sekcija } from "@/components/sajt/Sekcija";
import { Podvuceno } from "@/components/core/Podvuceno";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Uslovi korišćenja",
  description: "Uslovi korišćenja sajta i kupovine Daj Peticu NFC stalka — porudžbina, dostava, plaćanje pouzećem i pravo na odustanak.",
  alternates: { canonical: "/uslovi" },
};

function Odeljak({ naslov, children }: { naslov: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="m-0 font-prikaz text-h2 leading-heading font-normal text-text-strong">{naslov}</h2>
      <div className="flex flex-col gap-3 font-tekst text-body leading-body text-text-body">{children}</div>
    </div>
  );
}

export default function UsloviPage() {
  return (
    <Sekcija ton="light" className="!pt-28 lg:!pt-[clamp(56px,9vw,120px)]">
      <div className="flex flex-col gap-4">
        <h1 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-strong">
          <Podvuceno>Uslovi korišćenja</Podvuceno>
        </h1>
        <p className="m-0 font-tekst text-h3 leading-heading text-text-body">
          Ovi uslovi važe za svaku porudžbinu preko sajta {site.naziv}. Poručivanjem stalka
          prihvatate ono što piše ispod.
        </p>
      </div>
      <div className="flex flex-col gap-10">
        <Odeljak naslov="Ko prodaje">
          <p className="m-0">
            Prodavac je {site.naziv}. Za sva pitanja pišite na{" "}
            <a href={`mailto:${site.email}`} className="text-primary underline">
              {site.email}
            </a>{" "}
            ili pozovite{" "}
            <a href={site.telefonHref} className="text-primary underline">
              {site.telefon}
            </a>
            .
          </p>
        </Odeljak>

        <Odeljak naslov="Proizvod">
          <p className="m-0">
            Prodajemo jedan proizvod, NFC stalak koji mušteriji otvara Google stranu za ocenu na
            dodir ili skeniranje. Stalak je dostupan u beloj i crnoj boji, veličine 12,75 × 7,6 cm.
          </p>
        </Odeljak>

        <Odeljak naslov="Cena i plaćanje">
          <p className="m-0">
            Sve cene stalaka na sajtu su u RSD. Plaćate pouzećem, gotovinom kuriru ili poštaru pri
            preuzimanju pošiljke.
          </p>
        </Odeljak>

        <Odeljak naslov="Isporuka">
          <p className="m-0">
            Stalak podesimo istog ili sledećeg radnog dana i šaljemo poštom, obično stiže za 2
            radna dana. Trenutno dostavljamo samo na adrese u Srbiji.
          </p>
          <p className="m-0">
            Za porudžbinu jednog stalka poštarinu plaćate kuriru ili poštaru pri preuzimanju
            pošiljke. Od dva stalka poštarinu pokrivamo mi.
          </p>
        </Odeljak>

        <Odeljak naslov="Pravo na odustanak">
          <p className="m-0">
            Kao potrošač imate pravo da odustanete od porudžbine u roku od 14 dana od prijema
            pošiljke, bez obrazloženja. Javite nam se mejlom, dogovaramo se oko vraćanja i
            povraćaja novca.
          </p>
        </Odeljak>

        <Odeljak naslov="Zamena u slučaju kvara">
          <p className="m-0">
            Ako stalak ne radi ispravno, pošaljite ga nazad, zamena je bez pitanja u prvih 90 dana
            od prijema. Detalji su na strani{" "}
            <Link href="/garancija" className="text-primary underline">
              Garancija
            </Link>
            .
          </p>
        </Odeljak>

        <Odeljak naslov="Podešavanje i zaključavanje čipa">
          <p className="m-0">
            Pre slanja podesimo čip na link koji nam pošaljete (vaša Google strana za ocenu) i
            zaključamo ga, tako da se kasnije ne može prepisati. Proverite da je link tačan pre
            nego što potvrdite porudžbinu.
          </p>
        </Odeljak>

        <Odeljak naslov="Izmene ovih uslova">
          <p className="m-0">
            Uslove možemo povremeno menjati, aktuelna verzija je uvek na ovoj stranici. Izmene ne
            važe za porudžbine koje su već potvrđene.
          </p>
        </Odeljak>
      </div>
    </Sekcija>
  );
}


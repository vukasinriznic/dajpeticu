import type { Metadata } from "next";
import Link from "next/link";
import { Sekcija } from "@/components/sajt/Sekcija";
import { Podvuceno } from "@/components/core/Podvuceno";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Garancija",
  description: "90 dana zamena bez pitanja za Daj Peticu NFC stalak — bez traženja objašnjenja ili dokaza kupovine.",
  alternates: { canonical: "/garancija" },
};

function Odeljak({ naslov, children }: { naslov: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="m-0 font-prikaz text-h2 leading-heading font-normal text-text-strong">{naslov}</h2>
      <div className="flex flex-col gap-3 font-tekst text-body leading-body text-text-body">{children}</div>
    </div>
  );
}

export default function GarancijaPage() {
  return (
    <Sekcija ton="light" className="!pt-28 lg:!pt-[clamp(56px,9vw,120px)]">
      <div className="flex flex-col gap-4">
        <h1 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-strong">
          <Podvuceno>Garancija</Podvuceno>
        </h1>
        <p className="m-0 font-tekst text-h3 leading-heading text-text-body">
          Stalak nema bateriju ni pokretne delove, pa retko šta može da pođe naopako. Ako se ipak
          desi, evo šta radimo.
        </p>
      </div>
      <div className="flex flex-col gap-10">
        <Odeljak naslov="Šta pokriva garancija">
          <p className="m-0">
            Ako stalak ne radi ispravno, ne čita se na telefonu ili je stigao oštećen, to je pokriveno
            garancijom.
          </p>
        </Odeljak>

        <Odeljak naslov="Koliko traje">
          <p className="m-0">
            90 dana od dana kad ste preuzeli pošiljku. U tom roku je zamena bez pitanja, ne tražimo
            objašnjenje niti dokaz kupovine.
          </p>
        </Odeljak>

        <Odeljak naslov="Šta nije pokriveno">
          <p className="m-0">
            Oštećenja nastala nepažnjom (savijanje, lomljenje, kvašenje) ili namernim oštećenjem
            čipa nisu pokrivena. Uobičajeno habanje štampe posle dugog korišćenja takođe nije kvar.
          </p>
        </Odeljak>

        <Odeljak naslov="Kako da prijavite kvar">
          <p className="m-0">
            Pišite nam na{" "}
            <a href={`mailto:${site.email}`} className="text-primary underline">
              {site.email}
            </a>{" "}
            sa mejlom ili telefonom koji ste koristili pri porudžbini i kratkim opisom šta se
            dešava. Dogovorićemo se oko slanja stalka nazad.
          </p>
        </Odeljak>

        <Odeljak naslov="Šta dobijate">
          <p className="m-0">
            Nov, ispravan stalak podešen na isti link kao i prvi put. Slanje novog stalka je na
            naš račun. Ako više ne želite zamenu, javite nam se, rešavamo to pojedinačno.
          </p>
        </Odeljak>

        <Odeljak naslov="Predomislili ste se, a stalak je ispravan?">
          <p className="m-0">
            To nije garancija nego pravo na odustanak, imate 14 dana od prijema da vratite
            porudžbinu bez razloga. Detalji su na strani{" "}
            <Link href="/uslovi" className="text-primary underline">
              Uslovi korišćenja
            </Link>
            .
          </p>
        </Odeljak>
      </div>
    </Sekcija>
  );
}

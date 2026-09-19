import type { Metadata } from "next";
import { Sekcija } from "@/components/sajt/Sekcija";
import { Podvuceno } from "@/components/core/Podvuceno";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description: "Koje podatke Daj Peticu prikuplja pri porudžbini NFC stalka, zašto, i kako ih čuvamo.",
  alternates: { canonical: "/privatnost" },
};

function Odeljak({ naslov, children }: { naslov: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="m-0 font-prikaz text-h2 leading-heading font-normal text-text-strong">{naslov}</h2>
      <div className="flex flex-col gap-3 font-tekst text-body leading-body text-text-body">{children}</div>
    </div>
  );
}

export default function PrivatnostPage() {
  return (
    <Sekcija ton="light" className="!pt-28 lg:!pt-[clamp(56px,9vw,120px)]">
      <div className="flex flex-col gap-4">
        <h1 className="m-0 font-prikaz text-display-2 leading-heading font-normal tracking-heading text-text-strong">
          <Podvuceno>Politika privatnosti</Podvuceno>
        </h1>
        <p className="m-0 font-tekst text-h3 leading-heading text-text-body">
          Ovde piše koje podatke prikupljamo kad poručite stalak preko sajta {site.naziv} i šta
          radimo sa njima.
        </p>
      </div>
      <div className="flex flex-col gap-10">

        <Odeljak naslov="Koje podatke prikupljamo">
          <p className="m-0">
            Kad naručite, tražimo ime, prezime, email, telefon, adresu za dostavu (adresa, grad,
            poštanski broj, država), naziv biznisa i boju/količinu stalka koju poručujete. PIB
            tražimo samo ako naručujete za firmu, i nije obavezan.
          </p>
        </Odeljak>

        <Odeljak naslov="Zašto ih prikupljamo">
          <p className="m-0">
            Isključivo da obradimo i isporučimo porudžbinu, potvrdimo detalje telefonom ili
            mejlom, i podesimo link na vašu Google stranu na samom stalku.
          </p>
        </Odeljak>

        <Odeljak naslov="Gde se čuvaju">
          <p className="m-0">
            Podaci se čuvaju u bazi (Supabase), a obaveštenje o porudžbini nam stiže preko Resend
            servisa za slanje mejlova. Oba servisa vide podatke samo u meri potrebnoj da ta usluga
            radi, ne koriste ih ni za šta drugo.
          </p>
        </Odeljak>

        <Odeljak naslov="Bezbednost podataka">
          <p className="m-0">
            Pristup bazi je zaštićen i ograničen samo na nas, niko drugi nema uvid u vaše podatke.
            Nijedan prenos podataka preko interneta nije stopostotno siguran, ali vodimo računa da
            se podaci čuvaju i šalju na uobičajen, bezbedan način.
          </p>
        </Odeljak>

        <Odeljak naslov="Deljenje sa trećim licima">
          <p className="m-0">
            Ne prodajemo niti delimo vaše podatke u marketinške svrhe. Adresu i telefon delimo
            samo sa dostavnom službom, i to isključivo radi isporuke pošiljke.
          </p>
        </Odeljak>

        <Odeljak naslov="Kolačići">
          <p className="m-0">
            Sajt trenutno ne koristi kolačiće za praćenje niti analitiku. Sadržaj korpe (šta ste
            dodali pre nego što pošaljete porudžbinu) čuvamo u localStorage vašeg browsera, ne na
            serveru, taj podatak ostaje samo na vašem uređaju i mi mu nemamo pristup.
          </p>
        </Odeljak>

        <Odeljak naslov="Koliko dugo ih čuvamo">
          <p className="m-0">
            Podatke o porudžbini čuvamo dok je to potrebno radi evidencije i eventualne zamene u
            garantnom roku. Na vaš zahtev ih brišemo, osim ako zakon nalaže drugačije.
          </p>
        </Odeljak>

        <Odeljak naslov="Vaša prava">
          <p className="m-0">
            Možete tražiti uvid, ispravku ili brisanje svojih podataka u svakom trenutku, besplatno.
          </p>
        </Odeljak>

        <Odeljak naslov="Izmene ove politike">
          <p className="m-0">
            Politiku privatnosti možemo povremeno menjati, aktuelna verzija je uvek na ovoj
            stranici.
          </p>
        </Odeljak>

        <Odeljak naslov="Kontakt">
          <p className="m-0">
            Za sva pitanja o privatnosti i vašim podacima, pišite nam na{" "}
            <a href={`mailto:${site.email}`} className="text-primary underline">
              {site.email}
            </a>
            .
          </p>
        </Odeljak>
      </div>
    </Sekcija>
  );
}


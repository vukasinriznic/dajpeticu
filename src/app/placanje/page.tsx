"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dugme } from "@/components/core/Dugme";
import { Podvuceno } from "@/components/core/Podvuceno";
import { Sekcija } from "@/components/sajt/Sekcija";
import { KorpaFormaNarudzbine } from "@/components/sajt/KorpaFormaNarudzbine";
import { useKorpa, type StavkaKorpe } from "@/components/sajt/KorpaKontekst";
import { ZaglavljePlacanje } from "@/components/sajt/ZaglavljePlacanje";
import { pratiDogadjaj, stavkaZaAnalitiku } from "@/lib/analitika";

type SnimakKorpe = { stavke: StavkaKorpe[]; ukupnaKolicina: number; ukupnaCena: number };

// Tamnozelena/zlatna tema — po ugledu na DodajUKorpuPopup.tsx, ista logika
// (fiksna tema, ne prati boju stalka). Prikazuje SAMO formu za dostavu;
// pregled/izmena stavki živi u KorpaDrawer.tsx (klik na ikonicu korpe).
// Van (sajt) route grupe — sopstveni pojednostavljeni header
// (ZaglavljePlacanje), bez footera (Podnozje se ovde namerno ne renderuje).
export default function PlacanjePage() {
  const router = useRouter();
  const { stavke, hidrirano, ukupnaKolicina, ukupnaCena } = useKorpa();
  // Drži se OVDE (ne u KorpaFormaNarudzbine), jer uspešno slanje odmah prazni
  // korpu — da stranica ne bi preskočila na "korpa je prazna" pre nego što
  // korisnik vidi potvrdu, provera uspeha mora doći PRE provere praznine.
  const [poslato, setPoslato] = useState<{ telefon: string } | null>(null);

  // Poslednje NEPRAZNO stanje korpe — kad korisnik isprazni korpu preko
  // drawer-a dok je već na /placanje (a ne pre ulaska na stranicu), stavke
  // padnu na 0 pre nego što router.replace("/") stigne da izvrši
  // navigaciju, pa bi se forma na trenutak zamenila praznom sekcijom.
  // Umesto da se prikaz osloni na "žive" (trenutne) vrednosti, drži se
  // poslednji snimak i njega renderuje sve dok se ne ode sa stranice.
  const [snimak, setSnimak] = useState<SnimakKorpe | null>(null);
  useEffect(() => {
    if (stavke.length > 0) setSnimak({ stavke, ukupnaKolicina, ukupnaCena });
  }, [stavke, ukupnaKolicina, ukupnaCena]);

  // Prazna korpa = nema šta da se plati, stranica nije dostupna — umesto
  // poruke, direktno na početnu. Čeka se "hidrirano" (localStorage pročitan)
  // da se pravi korisnik sa punom korpom ne izbaci na trenutak praznog
  // stanja pre hidracije; "poslato" isključuje redirekciju posle uspešne
  // porudžbine, kad se korpa namerno prazni da bi se prikazala potvrda.
  useEffect(() => {
    if (hidrirano && stavke.length === 0 && !poslato) router.replace("/");
  }, [hidrirano, stavke.length, poslato, router]);

  // Potvrda je jedan ekran bez skrola — vrati pogled na vrh (forma je bila
  // skrolovana) da se ne vidi prazan prostor ispod potvrde.
  useEffect(() => {
    if (poslato) window.scrollTo(0, 0);
  }, [poslato]);

  const prikaz = stavke.length > 0 ? { stavke, ukupnaKolicina, ukupnaCena } : snimak;

  if (poslato) {
    // Bez ZaglavljePlacanje/Sekcija ovde namerno — ovo je krajnja tačka toka
    // (nema više kuda da se ide osim nazad na početnu), pa cela stranica
    // postaje jedna centrirana potvrda preko celog ekrana, bez nav-a koji
    // bi sugerisao da ima još nešto da se radi.
    return (
      <section className="flex h-[100dvh] flex-col items-center justify-center gap-4 overflow-hidden bg-bg-inverse px-5 text-center lg:h-auto lg:min-h-screen lg:overflow-visible">
        <Image src="/images/checked.png" alt="" width={72} height={72} />
        <h1 className="m-0 font-prikaz text-h1 leading-heading font-normal text-white">
          Primili smo porudžbinu.
        </h1>
        <p className="m-0 max-w-[62ch] font-tekst text-body text-[rgba(191,227,208,0.85)]">
          Zovemo vas na {poslato.telefon} da potvrdimo adresu i link vaše Google strane.
        </p>
        <Dugme variant="gold" onClick={() => router.push("/")}>
          Nazad na početnu
        </Dugme>
      </section>
    );
  }

  // Nema forme za praznu korpu — useEffect iznad već šalje na početnu.
  // Ovo se vidi samo pri direktnom ulasku na /placanje sa već praznom
  // korpom (nema šta da se zamrzne) ili pre nego što se "hidrirano"
  // postavi, pa je namerno prazna sekcija bez teksta, ne cela "korpa je
  // prazna" poruka.
  if (!hidrirano || !prikaz) {
    return (
      <>
        <ZaglavljePlacanje />
        <Sekcija ton="inverse">
          <div className="mx-auto max-w-[62ch]" />
        </Sekcija>
      </>
    );
  }

  return (
    <>
      <ZaglavljePlacanje />
      {/* !pt-28 na mobilnom (19.09.2026., eksplicitno traženo — "padding
          kao u hero sekciji") — Sekcija.tsx-ov deljeni py-[clamp(56px,...)]
          (56px pod) ne razdvaja dovoljno naslov od fiksnog ZaglavljePlacanje
          header-a (iste visine kao glavni Zaglavlje.tsx, ~82px) na uskim
          ekranima, isti razlog zbog kog je hero dobio pt-28 ranije ove
          sesije. "!" obavezan da pobedi Sekcija.tsx-ov bazni py- (Tailwind
          v4 redosled generisanja, isti obrazac kao svuda ove sesije).
          lg: vraća originalnu deljenu vrednost. */}
      <Sekcija ton="inverse" className="!pt-28 lg:!pt-[clamp(56px,9vw,120px)]">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-8">
          <h1 className="m-0 font-prikaz text-display-2 leading-heading font-normal text-white">
            <Podvuceno>Dostava</Podvuceno>
          </h1>
          <KorpaFormaNarudzbine
            stavke={prikaz.stavke}
            ukupnaKolicina={prikaz.ukupnaKolicina}
            ukupnaCena={prikaz.ukupnaCena}
            onUspeh={(p) => {
              setPoslato({ telefon: p.telefon });
              // purchase — samo id porudžbine, vrednost i stavke (bez ličnih podataka).
              pratiDogadjaj("purchase", {
                transaction_id: p.id,
                currency: "RSD",
                value: p.ukupnaCena,
                items: prikaz.stavke.map(stavkaZaAnalitiku),
              });
            }}
          />
          {/* Stranica namerno nema Podnozje (fokus na formi) — ali stranica
              koja uzima lične podatke ne sme da bude bez ijednog linka ka
              uslovima/privatnosti, pa ide tanak red umesto celog footera.
              Iste boje kao Podnozje.tsx (text-quiet-on-inverse je isti
              #bfe3d0 kao rgba(191,227,208,...) koji se koristi svuda po
              ovoj stranici). */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 border-t border-white/14 pt-6 text-caption text-text-quiet-on-inverse">
            <Link href="/uslovi" className="transition-colors duration-200 hover:text-text-on-inverse">
              Uslovi
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/privatnost" className="transition-colors duration-200 hover:text-text-on-inverse">
              Privatnost
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/garancija" className="transition-colors duration-200 hover:text-text-on-inverse">
              Garancija
            </Link>
          </div>
        </div>
      </Sekcija>
    </>
  );
}

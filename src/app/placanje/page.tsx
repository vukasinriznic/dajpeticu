"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dugme } from "@/components/core/Dugme";
import { OcenaZvezdicama } from "@/components/core/OcenaZvezdicama";
import { Podvuceno } from "@/components/core/Podvuceno";
import { Sekcija } from "@/components/sajt/Sekcija";
import { KorpaFormaNarudzbine } from "@/components/sajt/KorpaFormaNarudzbine";
import { useKorpa } from "@/components/sajt/KorpaKontekst";
import { ZaglavljePlacanje } from "@/components/sajt/ZaglavljePlacanje";
import { formatRSD } from "@/lib/cene";

// Tamnozelena/zlatna tema — po ugledu na DodajUKorpuPopup.tsx, ista logika
// (fiksna tema, ne prati boju stalka). Prikazuje SAMO formu za dostavu;
// pregled/izmena stavki živi u KorpaDrawer.tsx (klik na ikonicu korpe).
// Van (sajt) route grupe — sopstveni pojednostavljeni header
// (ZaglavljePlacanje), bez footera (Podnozje se ovde namerno ne renderuje).
export default function PlacanjePage() {
  const router = useRouter();
  const { stavke, hidrirano } = useKorpa();
  // Drži se OVDE (ne u KorpaFormaNarudzbine), jer uspešno slanje odmah prazni
  // korpu — da stranica ne bi preskočila na "korpa je prazna" pre nego što
  // korisnik vidi potvrdu, provera uspeha mora doći PRE provere praznine.
  const [poslato, setPoslato] = useState<{ ukupnaCena: number; telefon: string } | null>(null);

  // Prazna korpa = nema šta da se plati, stranica nije dostupna — umesto
  // poruke, direktno na početnu. Čeka se "hidrirano" (localStorage pročitan)
  // da se pravi korisnik sa punom korpom ne izbaci na trenutak praznog
  // stanja pre hidracije; "poslato" isključuje redirekciju posle uspešne
  // porudžbine, kad se korpa namerno prazni da bi se prikazala potvrda.
  useEffect(() => {
    if (hidrirano && stavke.length === 0 && !poslato) router.replace("/");
  }, [hidrirano, stavke.length, poslato, router]);

  if (poslato) {
    return (
      <>
        <ZaglavljePlacanje />
        <Sekcija ton="inverse">
          <div className="mx-auto flex max-w-[62ch] flex-col items-start gap-4">
            <OcenaZvezdicama velicina={28} />
            <h1 className="m-0 font-prikaz text-h1 leading-heading font-normal text-white">
              Primili smo porudžbinu.
            </h1>
            <p className="m-0 font-tekst text-body text-[rgba(191,227,208,0.85)]">
              Zovemo vas na {poslato.telefon} da potvrdimo adresu i link vaše Google strane. Poštaru
              plaćate {formatRSD(poslato.ukupnaCena)}.
            </p>
            <Dugme variant="gold" onClick={() => router.push("/")}>
              Nazad na početnu
            </Dugme>
          </div>
        </Sekcija>
      </>
    );
  }

  // Nema forme za praznu korpu — useEffect iznad već šalje na početnu.
  // Ovo se vidi samo u tom kratkom trenutku dok redirekcija ne izvrši (ili
  // pre nego što se "hidrirano" postavi), pa je namerno prazna sekcija bez
  // teksta, ne cela "korpa je prazna" poruka.
  if (!hidrirano || stavke.length === 0) {
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
      <Sekcija ton="inverse">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-8">
          <h1 className="m-0 font-prikaz text-display-2 leading-heading font-normal text-white">
            <Podvuceno>Dostava</Podvuceno>
          </h1>
          <KorpaFormaNarudzbine onUspeh={setPoslato} />
        </div>
      </Sekcija>
    </>
  );
}

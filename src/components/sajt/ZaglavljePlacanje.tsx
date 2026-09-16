"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Logotip } from "@/components/core/Logotip";
import { useKorpa } from "@/components/sajt/KorpaKontekst";

const PRAG_SKROLA = 12;

// Pojednostavljen header samo za /placanje — cela stranica je uvek
// tamnozelena (nema svetlih sekcija ispod), pa nema potrebe za
// scroll-zavisnom detekcijom pozadine kao u Zaglavlje.tsx: logo i ikonica
// korpe su fiksno u "tamnoj" varijanti. Samo logo + korpa (bez nav linkova,
// "Poruči" dugmeta ili mobilnog menija — na ovoj stranici nema šta da se
// skroluje ka, korisnik je već u toku porudžbine). Container širine iste kao
// forma ispod (max-w-[640px] u placanje/page.tsx), ne pun sajt-container.
export function ZaglavljePlacanje() {
  const { otvoriKorpu, ukupnaKolicina } = useKorpa();
  // Isti stakleni blur na skrol kao Zaglavlje.tsx — bez toga se logo/ikonica
  // korpe slabo vide preko forme koja prolazi ispod fiksnog header-a.
  const [skrolovano, setSkrolovano] = useState(false);

  useEffect(() => {
    const naSkrol = () => setSkrolovano(window.scrollY > PRAG_SKROLA);
    naSkrol();
    window.addEventListener("scroll", naSkrol, { passive: true });
    return () => window.removeEventListener("scroll", naSkrol);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 transition-[backdrop-filter] duration-300 ${
        skrolovano ? "backdrop-blur-md" : "backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex max-w-[640px] items-center justify-between px-5 pt-6 pb-2.5">
        <Logotip kontekst="header" />
        <button
          type="button"
          onClick={otvoriKorpu}
          aria-label={ukupnaKolicina > 0 ? `Korpa, ${ukupnaKolicina} stalaka` : "Korpa"}
          className="relative grid h-11 w-11 place-items-center border-0 bg-none transition-transform duration-200 hover:scale-110"
        >
          <Image src="/shopping-cart.png" alt="" width={22} height={22} className="invert" />
          {ukupnaKolicina > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--color-gold)] px-1 font-tekst text-[10px] font-semibold text-[var(--color-bg-inverse)]">
              {ukupnaKolicina}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

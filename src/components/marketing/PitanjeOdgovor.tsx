"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

// Samo jedno pitanje sme biti otvoreno, pa stanje živi u Akordeonu a ne u
// pojedinačnom redu. Tekst pitanja služi kao identitet — pitanja su ionako
// jedinstvena, pa nema potrebe uvoditi zasebne id-eve.
const Kontekst = createContext<{
  otvoreno: string | null;
  prebaci: (pitanje: string) => void;
} | null>(null);

export function Akordeon({
  prvoOtvoreno,
  children,
}: {
  prvoOtvoreno?: string;
  children: ReactNode;
}) {
  const [otvoreno, setOtvoreno] = useState<string | null>(prvoOtvoreno ?? null);
  return (
    <Kontekst.Provider
      value={{
        otvoreno,
        prebaci: (pitanje) => setOtvoreno((trenutno) => (trenutno === pitanje ? null : pitanje)),
      }}
    >
      <div className="flex flex-col">{children}</div>
    </Kontekst.Provider>
  );
}

export function PitanjeOdgovor({ pitanje, children }: { pitanje: string; children: ReactNode }) {
  const kontekst = useContext(Kontekst);
  if (!kontekst) throw new Error("PitanjeOdgovor mora stajati unutar Akordeona.");
  const otvoreno = kontekst.otvoreno === pitanje;

  return (
    <div className="border-b border-border-soft">
      <button
        type="button"
        onClick={() => kontekst.prebaci(pitanje)}
        aria-expanded={otvoreno}
        className="group flex min-h-12 w-full items-center justify-between gap-4 border-0 bg-none py-5 text-left font-prikaz text-h3 leading-heading font-normal text-text-strong"
      >
        {pitanje}
        {/* scale je u Tailwind-u v4 zasebno CSS svojstvo, kao i rotate — mora
            izričito u listu tranzicija, inače uvećanje na hover odskoči. */}
        <span
          className={`inline-flex shrink-0 transition-[rotate,color,scale] duration-300 ease-out group-hover:scale-125 ${
            otvoreno ? "rotate-45 text-[var(--color-gold-ink)]" : "text-primary"
          }`}
        >
          <Plus size={22} />
        </span>
      </button>
      <div
        aria-hidden={!otvoreno}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          otvoreno ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="m-0 mb-5 max-w-[62ch] text-pretty font-tekst text-body leading-body text-text-body">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

// Zlatna dvostruka podvlaka ispod teksta — nosi je hero naslov ("pet
// zvezdica"), naslovi sekcija i oznake delova kartice.
export function Podvuceno({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {/* Bez ovog omotača, slovo sa donjom kukom (npr. "j" u "Recenzije") bi
          bilo ISPOD linije u DOM redosledu, pa bi u CSS redosledu crtanja
          apsolutno pozicionisan <img> (koji uvek crta POSLE običnog teksta u
          istom stacking kontekstu) prekrio taj deo slova. z-10 ovde i z-0 na
          slici prisiljavaju tekst da crta iznad linije. */}
      <span className="relative z-10">{children}</span>
      {/* eslint-disable-next-line @next/next/no-img-element -- dekorativna linija, ne treba next/image optimizacija */}
      <img
        src="/best_underline_lines.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 z-0 h-[0.32em] w-full"
        style={{ bottom: "-0.26em" }}
      />
    </span>
  );
}

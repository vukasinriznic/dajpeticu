"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Dugme } from "@/components/core/Dugme";
import { MAX_KOLICINA, formatRSD, cenaKarticaZaStavku, kolicinaSlovima } from "@/lib/cene";
import type { StavkaKorpe } from "@/components/sajt/KorpaKontekst";

// Tamnozelena/zlatna tema — jedina upotreba ovog fajla je KorpaDrawer.tsx.
export function KorpaStavka({
  stavka,
  ukupnaKolicinaKorpe,
  onAzuriraj,
  onUkloni,
}: {
  stavka: StavkaKorpe;
  ukupnaKolicinaKorpe: number;
  onAzuriraj: (patch: Partial<Pick<StavkaKorpe, "kolicina">>) => void;
  onUkloni: () => void;
}) {
  // Cena stavke zavisi od ukupne količine cele korpe (popust po tier-u), ne
  // samo od sopstvene količine — zato prima ukupnaKolicinaKorpe kao prop.
  const cena = cenaKarticaZaStavku(ukupnaKolicinaKorpe, stavka.kolicina);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-field border border-[rgba(255,197,61,0.25)] bg-[rgba(255,197,61,0.06)] p-5">
      <div className="flex items-center gap-3">
        {/* Ista minijatura kao na dugmadima Beli/Crni u DodajUKorpuPopup.tsx —
            brzo vizuelno podseti koja je boja stalka u pitanju. */}
        <span className="relative h-12 w-8 shrink-0 overflow-hidden">
          <Image
            src={stavka.boja === "crna" ? "/images/stalak_crni.webp" : "/images/stalak_beli.webp"}
            alt=""
            fill
            sizes="32px"
            quality={90}
            className="object-contain"
          />
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-tekst text-body font-medium text-white">
            {stavka.boja === "crna" ? "Crni" : "Beli"} stalak
          </span>
          <span className="font-tekst text-body-sm text-[rgba(191,227,208,0.75)]">
            {kolicinaSlovima(stavka.kolicina)} · {formatRSD(cena)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Dugme
          type="button"
          variant="outline"
          size="xs"
          aria-label="Manje stalaka"
          className="!h-10 !w-10 !min-w-0 !px-0 !border-[var(--color-gold)] !text-[var(--color-gold)] hover:!bg-[rgba(255,197,61,0.12)]"
          onClick={() => onAzuriraj({ kolicina: Math.max(1, stavka.kolicina - 1) })}
        >
          −
        </Dugme>
        <span className="min-w-[2em] text-center font-prikaz text-h3 text-white">
          {stavka.kolicina}
        </span>
        <Dugme
          type="button"
          variant="outline"
          size="xs"
          aria-label="Više stalaka"
          className="!h-10 !w-10 !min-w-0 !px-0 !border-[var(--color-gold)] !text-[var(--color-gold)] hover:!bg-[rgba(255,197,61,0.12)]"
          onClick={() => onAzuriraj({ kolicina: Math.min(MAX_KOLICINA, stavka.kolicina + 1) })}
        >
          +
        </Dugme>
        <button
          type="button"
          onClick={onUkloni}
          aria-label="Ukloni stavku"
          className="grid h-10 w-10 place-items-center rounded-full border-0 bg-none text-[rgba(191,227,208,0.75)] transition-colors duration-200 hover:bg-[var(--color-danger-quiet)] hover:text-[var(--color-danger)]"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

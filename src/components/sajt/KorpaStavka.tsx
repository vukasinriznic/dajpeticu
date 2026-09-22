"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Dugme } from "@/components/core/Dugme";
import { MAX_KOLICINA, formatRSD, cenaKarticaZaStavku, jedinicnaCena, kolicinaSlovima } from "@/lib/cene";
import { slikaProizvoda } from "@/lib/proizvod";
import type { StavkaKorpe } from "@/components/sajt/KorpaKontekst";

// Prvobitna cena jednog stalka (ista kao u DodajUKorpuPopup.tsx) — precrtana kad korpa ima 1 stalak.
const CENA_PRVOBITNA_ZA_JEDAN = 3790;
const CENA_JEDNE = jedinicnaCena(1);

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
  // Precrtana cena: sa 1 stalkom u korpi prvobitna (3 790), inače cena bez
  // popusta na količinu — isto kao u popupu.
  const precrtana =
    (ukupnaKolicinaKorpe <= 1 ? CENA_PRVOBITNA_ZA_JEDAN : CENA_JEDNE) * stavka.kolicina;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-field border border-[rgba(255,197,61,0.25)] bg-[rgba(255,197,61,0.06)] p-5">
      <div className="flex items-center gap-3">
        {/* Ista minijatura kao na dugmadima Beli/Crni u DodajUKorpuPopup.tsx —
            brzo vizuelno podseti koja je boja stalka u pitanju. */}
        <span className="relative h-12 w-8 shrink-0 overflow-hidden">
          <Image
            src={slikaProizvoda(stavka.velicina, stavka.boja)}
            alt=""
            fill
            sizes="96px"
            quality={90}
            className="object-contain"
          />
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-tekst text-body font-medium text-white">
            {stavka.velicina === "manji" ? "Manji" : "Veći"} {stavka.boja === "crna" ? "crni" : "beli"} stalak
          </span>
          <span className="font-tekst text-body-sm text-[rgba(191,227,208,0.75)]">
            {kolicinaSlovima(stavka.kolicina)} ·{" "}
            {precrtana > cena && <span className="mr-1 line-through opacity-70">{formatRSD(precrtana)}</span>}
            {formatRSD(cena)}
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

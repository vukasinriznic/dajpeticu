"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Dugme } from "@/components/core/Dugme";
import {
  MAX_KOLICINA,
  formatRSD,
  cenaStavkeUKorpi,
  jedinicnaCena,
  jedinicnaCenaManjiPrikaz,
  kolicinaSlovima,
} from "@/lib/cene";
import { slikaProizvoda, opticnaKorekcijaSkalaKorpa } from "@/lib/proizvod";
import type { StavkaKorpe } from "@/components/sajt/KorpaKontekst";

// Prvobitne ("bile") cene za 1 komad — iste vrednosti kao u
// DodajUKorpuPopup.tsx, odvojene po veličini.
const CENA_PRVOBITNA_ZA_JEDAN = 3800;
const CENA_PRVOBITNA_ZA_JEDAN_MANJI = 2900;
const CENA_JEDNE = jedinicnaCena(1);
const CENA_JEDNE_MANJI = jedinicnaCenaManjiPrikaz(1);

// Tamnozelena/zlatna tema — jedina upotreba ovog fajla je KorpaDrawer.tsx.
export function KorpaStavka({
  stavka,
  sveStavke,
  onAzuriraj,
  onUkloni,
}: {
  stavka: StavkaKorpe;
  // Cena stavke zavisi od ukupne količine SVIH stavki ISTE veličine u
  // korpi (popust po tier-u, svaka veličina ima sopstveni cenovnik/pool —
  // vidi cenaStavkeUKorpi u cene.ts), zato prima celu korpu, ne samo broj.
  sveStavke: StavkaKorpe[];
  onAzuriraj: (patch: Partial<Pick<StavkaKorpe, "kolicina">>) => void;
  onUkloni: () => void;
}) {
  const cena = cenaStavkeUKorpi(sveStavke, stavka);
  const ukupnaKolicinaIsteVelicine = sveStavke
    .filter((s) => s.velicina === stavka.velicina)
    .reduce((z, s) => z + s.kolicina, 0);
  // Precrtana cena: sa 1 komadom te veličine u korpi — prvobitna ("bila")
  // cena; inače cena bez popusta na količinu. Isto za obe veličine, isti
  // obrazac kao u popupu.
  const precrtana =
    stavka.velicina === "manji"
      ? (ukupnaKolicinaIsteVelicine <= 1 ? CENA_PRVOBITNA_ZA_JEDAN_MANJI : CENA_JEDNE_MANJI) * stavka.kolicina
      : (ukupnaKolicinaIsteVelicine <= 1 ? CENA_PRVOBITNA_ZA_JEDAN : CENA_JEDNE) * stavka.kolicina;

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
            style={{ transform: `scale(${opticnaKorekcijaSkalaKorpa(stavka.velicina, stavka.boja)})` }}
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

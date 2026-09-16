import { Check } from "lucide-react";
import { Kartica } from "@/components/core/Kartica";
import { Znacka } from "@/components/core/Znacka";
import { Dugme } from "@/components/core/Dugme";

export function CenovnaKartica({
  naziv,
  cena,
  jedinica = "RSD",
  napomena,
  stavke,
  znacka,
  istaknuta = false,
  cta,
  onOdaberi,
}: {
  naziv: string;
  cena: string;
  jedinica?: string;
  napomena?: string;
  stavke: string[];
  znacka?: string;
  istaknuta?: boolean;
  cta: string;
  onOdaberi: () => void;
}) {
  return (
    <Kartica
      pad="lg"
      className={`flex flex-col gap-5 !duration-500 !ease-out hover:-translate-y-1.5 hover:shadow-[0_0_0_2px_var(--color-gold),0_12px_32px_-8px_rgba(255,197,61,0.55)] ${
        istaknuta ? "border-2 border-[var(--color-gold)] shadow-lg" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-prikaz text-h3 font-normal text-text-strong">{naziv}</span>
        {znacka && <Znacka ton="gold">{znacka}</Znacka>}
      </div>
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className="font-prikaz text-h1 leading-none font-normal text-[var(--color-gold-ink)]">{cena}</span>
        <span className="font-tekst text-body-sm text-text-muted">{jedinica}</span>
      </div>
      {napomena && (
        <span className="-mt-3 font-tekst text-caption text-text-muted">{napomena}</span>
      )}
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {stavke.map((s) => (
          <li key={s} className="flex items-start gap-3 font-tekst text-body leading-snug text-text-body">
            <Check size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-[var(--color-gold-ink)]" />
            {s}
          </li>
        ))}
      </ul>
      <Dugme
        variant="gold-outline"
        size="lg"
        full
        onClick={onOdaberi}
        className="mt-auto"
      >
        {cta}
      </Dugme>
    </Kartica>
  );
}

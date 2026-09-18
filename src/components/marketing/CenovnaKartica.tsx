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
      className={`flex flex-col gap-5 !duration-500 !ease-out -translate-y-1.5 !shadow-[0_0_0_2px_var(--color-gold),0_12px_32px_-8px_rgba(255,197,61,0.55)] lg:translate-y-0 lg:!shadow-none lg:hover:-translate-y-1.5 lg:hover:!shadow-[0_0_0_2px_var(--color-gold),0_12px_32px_-8px_rgba(255,197,61,0.55)] ${
        istaknuta ? "border-2 border-[var(--color-gold)] shadow-lg" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-prikaz text-h3 font-normal text-text-strong">{naziv}</span>
        {znacka && <Znacka ton="gold">{znacka}</Znacka>}
      </div>
      <div className="flex flex-wrap items-baseline gap-1.5">
        {/* Mobilni pod 36px (bio 28px, text-h1 default), desktop max
            nepromenjen (40px) — eksplicitno traženo 19.09.2026. */}
        <span className="font-prikaz text-[clamp(2.25rem,4.4vw,2.5rem)] leading-none font-normal text-[var(--color-gold-ink)]">{cena}</span>
        {/* "RSD" 18px na mobilnom (bilo ~14px, text-body-sm) — desktop
            NEPROMENJEN (mobilni cilj je VEĆI od desktop maksimuma, pa
            jedan clamp ne može oboje da izrazi — otud eksplicitna lg:
            grana nazad na originalni token umesto proširenog clamp-a). */}
        <span className="font-tekst text-[18px] text-text-muted lg:text-body-sm">{jedinica}</span>
      </div>
      {napomena && (
        <span className="-mt-3 font-tekst text-caption text-text-muted">{napomena}</span>
      )}
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {stavke.map((s) => (
          <li
            key={s}
            className="flex items-start gap-3 font-tekst text-[16px] leading-snug text-text-body lg:text-body"
          >
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
        className="mt-auto !border-[var(--color-gold)] !bg-[var(--color-gold)] !text-[var(--color-bg-inverse)] lg:!border-[var(--color-gold-ink)] lg:!bg-transparent lg:!text-[var(--color-gold-ink)] lg:hover:!border-[var(--color-gold)] lg:hover:!bg-[var(--color-gold)] lg:hover:!text-[var(--color-bg-inverse)]"
      >
        {cta}
      </Dugme>
    </Kartica>
  );
}

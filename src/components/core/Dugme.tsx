import type { ButtonHTMLAttributes, ReactNode } from "react";

const VARIJANTE = {
  primary:
    "bg-primary text-text-on-primary shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-active",
  secondary:
    "bg-primary-quiet text-primary border border-primary-line hover:bg-primary-quiet-hover",
  outline:
    "bg-transparent text-primary border-2 border-primary hover:bg-primary-quiet",
  ghost: "bg-transparent text-text-body hover:bg-surface-2",
  // Zlatna varijanta — jedini izuzetak od "zlatna samo za zvezdice" (vidi
  // globals.css): koristi se za CTA dugmad na tamnozelenoj pozadini, gde
  // zelena varijanta gubi kontrast.
  gold: "bg-[var(--color-gold)] text-[var(--color-bg-inverse)] shadow-sm hover:brightness-95 active:brightness-90",
  // Za sekundarne dugmad na/pored tamnozelene pozadine, ili gde zelen tekst
  // treba da bude zlatan — koristi tamniji --color-gold-ink (ne sam
  // --color-gold) jer svetlo zlatna kao TEKST na beloj podlozi ima slab
  // kontrast; gold-ink je baš zbog toga i postoji u sistemu. Na hover se
  // "puni" u puno zlatno (isti izgled kao "gold" varijanta u mirovanju).
  "gold-outline":
    "bg-transparent text-[var(--color-gold-ink)] border-2 border-[var(--color-gold-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-bg-inverse)] hover:border-[var(--color-gold)]",
} as const;

// Istaknuti oblik CTA dugmeta — tri zaobljena ugla i jedan oštar (gore levo),
// uz zeleni odsjaj. Dele ga hero, "card" sekcija i podnožje, pa stoji ovde a
// ne kao lokalna konstanta u svakoj od njih.
export const DUGME_ISTAKNUTO =
  "!h-13 !rounded-tl-none !rounded-tr-full !rounded-br-full !rounded-bl-full px-10 shadow-[0_14px_32px_-10px_rgba(14,122,79,0.6)]";

const VELICINE = {
  xs: "h-10 px-5 text-body-sm min-w-0",
  sm: "h-12 px-6.5 text-body-sm min-w-0",
  md: "h-14 px-7 text-[1.125rem] min-w-[150px]",
  lg: "h-16 px-9 text-[1.1875rem] min-w-[150px]",
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIJANTE;
  size?: keyof typeof VELICINE;
  full?: boolean;
  children: ReactNode;
};

export function Dugme({
  variant = "primary",
  size = "md",
  full = false,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2.5 rounded-button border-0 font-tekst font-normal leading-none whitespace-normal transition-[background,box-shadow,transform,border-color,color] duration-200 ease-[cubic-bezier(.2,.7,.3,1)] active:scale-[0.985] disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-ink-400 disabled:shadow-none ${VARIJANTE[variant]} ${VELICINE[size]} ${full ? "w-full min-w-0" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

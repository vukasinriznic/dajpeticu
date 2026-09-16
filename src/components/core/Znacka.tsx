import type { ReactNode } from "react";

const TONOVI = {
  neutral: "bg-surface-2 text-text-body",
  primary: "bg-primary-quiet text-primary",
  solid: "bg-primary text-text-on-primary",
  outline: "bg-transparent text-primary shadow-[inset_0_0_0_1px_var(--color-primary-line)]",
  gold: "bg-[var(--color-gold)] text-[var(--color-bg-inverse)]",
} as const;

export function Znacka({
  ton = "primary",
  className = "",
  children,
}: {
  ton?: keyof typeof TONOVI;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 rounded-badge px-3 py-0.5 font-tekst text-caption font-normal leading-tight ${TONOVI[ton]} ${className}`}
    >
      {children}
    </span>
  );
}

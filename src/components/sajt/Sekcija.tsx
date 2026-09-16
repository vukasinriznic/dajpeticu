import type { ReactNode } from "react";

const TONOVI = {
  light: "bg-surface-0",
  // "alt" je nekad nosio bg-surface-1 (blago plavičasto-siva nijansa, #f6f7fa)
  // za ritam između sekcija — sad čisto belo svuda, po zahtevu.
  alt: "bg-surface-0",
  inverse: "bg-bg-inverse",
} as const;

export function Sekcija({
  id,
  ton = "light",
  className = "",
  children,
}: {
  id?: string;
  ton?: keyof typeof TONOVI;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${TONOVI[ton]} px-5 py-[clamp(56px,9vw,120px)] ${className}`}
    >
      <div className="mx-auto flex max-w-[var(--container)] flex-col gap-12">{children}</div>
    </section>
  );
}

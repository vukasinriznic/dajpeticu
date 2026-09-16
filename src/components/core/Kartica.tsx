import type { HTMLAttributes, ReactNode } from "react";

const TONOVI = {
  default: "bg-surface-0 border border-border-soft shadow-sm text-text-body",
  sunken: "bg-surface-2 border border-transparent text-text-body",
  inverse: "bg-bg-inverse border border-transparent text-text-on-inverse",
  outline: "bg-transparent border border-border text-text-body",
} as const;

const PADOVI = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

type Props = HTMLAttributes<HTMLDivElement> & {
  ton?: keyof typeof TONOVI;
  pad?: keyof typeof PADOVI;
  interaktivna?: boolean;
  children: ReactNode;
};

export function Kartica({
  ton = "default",
  pad = "md",
  interaktivna = false,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <div
      className={`rounded-card transition-[box-shadow,transform,translate,border-color] duration-200 ease-[cubic-bezier(.2,.7,.3,1)] ${TONOVI[ton]} ${PADOVI[pad]} ${interaktivna ? "hover:-translate-y-[3px] hover:border-primary-line hover:shadow-md" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

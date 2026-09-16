import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Kartica } from "@/components/core/Kartica";

export function KarticaPogodnosti({
  ikonica: Ikonica,
  naslov,
  ton = "default",
  children,
}: {
  ikonica: LucideIcon;
  naslov: string;
  ton?: "default" | "inverse";
  children: ReactNode;
}) {
  const inverse = ton === "inverse";
  return (
    <Kartica ton={ton} pad="lg" interaktivna className="flex flex-col gap-4">
      <span
        className={`grid h-13 w-13 shrink-0 place-items-center rounded-field ${
          inverse ? "bg-white/12" : "bg-primary-quiet"
        }`}
      >
        <Ikonica size={24} strokeWidth={2} className={inverse ? "text-text-on-inverse" : "text-primary"} />
      </span>
      <h3
        className={`m-0 text-balance font-prikaz text-h3 leading-heading font-normal ${
          inverse ? "text-text-on-inverse" : "text-text-strong"
        }`}
      >
        {naslov}
      </h3>
      <p
        className={`m-0 font-tekst text-body leading-body ${
          inverse ? "text-text-quiet-on-inverse" : "text-text-body"
        }`}
      >
        {children}
      </p>
    </Kartica>
  );
}

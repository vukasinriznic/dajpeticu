import { Store, User } from "lucide-react";
import { OcenaZvezdicama } from "@/components/core/OcenaZvezdicama";
import { Kartica } from "@/components/core/Kartica";

export function Utisak({
  citat,
  ime,
  posao,
  grad,
  slika,
  ton = "default",
}: {
  citat: string;
  ime: string;
  posao?: string;
  grad?: string;
  slika?: string;
  ton?: "default" | "inverse";
}) {
  const inverse = ton === "inverse";
  return (
    <Kartica
      ton={ton}
      pad="lg"
      className={`relative flex flex-col gap-4 overflow-hidden ${
        inverse ? "" : "!border-border-strong !shadow-md"
      }`}
    >
      {/* Veliki dekorativni navodnik u uglu — čist vizuelni akcenat da se
          odmah prepozna "ovo je citat", ne samo tekst pod znacima navoda. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-3 right-4 font-prikaz text-[5rem] leading-none select-none ${
          inverse ? "text-white/10" : "text-primary-quiet"
        }`}
      >
        "
      </span>
      <OcenaZvezdicama velicina={20} />
      <p
        className={`relative z-[1] m-0 font-prikaz text-h3 leading-snug text-pretty ${
          inverse ? "text-text-on-inverse" : "text-text-strong"
        }`}
      >
        „{citat}“
      </p>
      <div className="mt-auto flex items-center gap-3">
        {/* Krug sa fotografijom — placeholder ikonica dok ne stignu prave
            slike vlasnika (svesno NE koristimo stock fotografiju stvarne
            osobe za izmišljenu izjavu — vidi napomenu u razgovoru). */}
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full ${
            inverse ? "bg-white/10" : "bg-surface-2"
          }`}
        >
          {slika ? (
            // eslint-disable-next-line @next/next/no-img-element -- placeholder slot, next/image nepotrebno pre prave slike
            <img src={slika} alt="" className="h-full w-full object-cover" />
          ) : (
            <User size={20} className={inverse ? "text-white/70" : "text-text-muted"} strokeWidth={1.5} />
          )}
        </div>
        <div className={`font-tekst text-body-sm ${inverse ? "text-text-quiet-on-inverse" : "text-text-muted"}`}>
          <strong className={`block font-normal ${inverse ? "text-text-on-inverse" : "text-text-body"}`}>
            {ime}
          </strong>
          <span className="inline-flex items-center gap-1">
            <Store size={14} className={inverse ? "text-white/50" : "text-text-muted"} />
            {posao}
            {grad ? `, ${grad}` : ""}
          </span>
        </div>
      </div>
    </Kartica>
  );
}

import { Nfc } from "lucide-react";
import { OcenaZvezdicama } from "@/components/core/OcenaZvezdicama";

// Fizički proizvod prikazan kroz brend elemente — nema fotografije kartice.
export function MaketaKartice({
  sirina = 320,
  ton = "ink",
  nagib = -6,
  className = "",
}: {
  sirina?: number;
  ton?: "ink" | "light";
  nagib?: number;
  className?: string;
}) {
  const tamna = ton === "ink";
  return (
    <div
      className={`flex flex-col justify-between rounded-field shadow-lg ${
        tamna ? "border border-white/10 bg-bg-inverse" : "border border-border bg-surface-0"
      } ${className}`}
      style={{
        width: sirina,
        aspectRatio: "1.586",
        transform: `rotate(${nagib}deg)`,
        padding: "clamp(14px, 6%, 24px)",
      }}
    >
      <div className="flex items-start justify-between gap-2.5">
        <span
          className={`font-prikaz font-normal tracking-[-0.015em] ${tamna ? "text-white" : "text-primary"}`}
          style={{ fontSize: sirina * 0.062 }}
        >
          Daj Peticu
        </span>
        <span
          className={`grid place-items-center rounded-[6px] ${tamna ? "bg-white/12" : "bg-primary-quiet"}`}
          style={{ width: sirina * 0.09, height: sirina * 0.09 }}
        >
          <Nfc
            style={{ width: sirina * 0.055, height: sirina * 0.055 }}
            className={tamna ? "text-white" : "text-primary"}
          />
        </span>
      </div>
      <div className="flex flex-col" style={{ gap: sirina * 0.022 }}>
        <OcenaZvezdicama velicina={sirina * 0.075} />
        <span
          className={`font-tekst font-normal ${tamna ? "text-white" : "text-text-strong"}`}
          style={{ fontSize: sirina * 0.052 }}
        >
          Prisloni telefon
        </span>
        <span
          className={`font-tekst ${tamna ? "text-text-quiet-on-inverse" : "text-text-muted"}`}
          style={{ fontSize: sirina * 0.04 }}
        >
          i ostavi recenziju
        </span>
      </div>
    </div>
  );
}

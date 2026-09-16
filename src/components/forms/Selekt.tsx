"use client";

import { useId, useState, type ChangeEvent } from "react";

// Isti izgled kao Unos.tsx (rounded-field, fokus prsten) — postoji da
// "Država" u formi za dostavu ne odudara od ostalih polja.
export function Selekt({
  label,
  help,
  error,
  name,
  value,
  onChange,
  options,
  className = "",
  tamno = false,
}: {
  label: string;
  help?: string;
  error?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  className?: string;
  // Tamna varijanta — vidi Unos.tsx, isti obrazac (koristi se na /placanje).
  tamno?: boolean;
}) {
  const [fokus, setFokus] = useState(false);
  const uid = useId();
  const granica = error
    ? "border-danger"
    : fokus
      ? tamno
        ? "border-[var(--color-gold)]"
        : "border-primary"
      : tamno
        ? "border-[rgba(191,227,208,0.35)]"
        : "border-border";

  return (
    <div className={`flex flex-col gap-2 font-tekst ${className}`}>
      <label htmlFor={uid} className={`text-body-sm font-medium ${tamno ? "text-white" : "text-text-body"}`}>
        {label}
      </label>
      <div
        className={`flex items-center rounded-field border px-4 shadow-[inset_0_1px_2px_rgb(14_92_85_/_0.05)] transition-[border-color,box-shadow] duration-200 ${tamno ? "bg-[rgba(255,255,255,0.06)]" : "bg-surface-0"} ${granica} ${
          fokus ? (tamno ? "shadow-[0_0_0_3px_rgba(255,197,61,0.28)]" : "shadow-focus") : ""
        }`}
      >
        <select
          id={uid}
          name={name}
          value={value}
          onFocus={() => setFokus(true)}
          onBlur={() => setFokus(false)}
          onChange={onChange}
          className={`h-[calc(3.375rem-2px)] min-w-0 flex-1 border-0 bg-transparent font-tekst text-body outline-none ${tamno ? "text-white [color-scheme:dark]" : "text-text-strong"}`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {(error || help) && (
        <span className={`text-caption ${error ? "text-danger" : tamno ? "text-[rgba(191,227,208,0.75)]" : "text-text-muted"}`}>
          {error || help}
        </span>
      )}
    </div>
  );
}

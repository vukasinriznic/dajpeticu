"use client";

import { ChevronDown, Check } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type OpcijaSelekta = { value: string; label: string; ikonica?: ReactNode };

// Isti izgled kao Unos.tsx (rounded-field, fokus prsten) — ali potpuno
// sopstveni combobox umesto native <select>. Native padajući meni je OS
// stilizovan (font/boje van naše kontrole), pa bi uvek odudarao od ostatka
// sajta; sa jednom opcijom za sada ("Srbija") ovo je jeftino, a spremno za
// više zemalja kasnije.
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
  onChange: (vrednost: string) => void;
  options: OpcijaSelekta[];
  className?: string;
  // Tamna varijanta — vidi Unos.tsx, isti obrazac (koristi se na /placanje).
  tamno?: boolean;
}) {
  const [otvoren, setOtvoren] = useState(false);
  const uid = useId();
  const omotacRef = useRef<HTMLDivElement>(null);
  const izabrana = options.find((o) => o.value === value);

  useEffect(() => {
    if (!otvoren) return;
    const naKlik = (e: MouseEvent) => {
      if (omotacRef.current && !omotacRef.current.contains(e.target as Node)) setOtvoren(false);
    };
    const naEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoren(false);
    };
    document.addEventListener("mousedown", naKlik);
    document.addEventListener("keydown", naEscape);
    return () => {
      document.removeEventListener("mousedown", naKlik);
      document.removeEventListener("keydown", naEscape);
    };
  }, [otvoren]);

  const granica = error
    ? "border-danger"
    : otvoren
      ? tamno
        ? "border-[var(--color-gold)]"
        : "border-primary"
      : tamno
        ? "border-[rgba(191,227,208,0.35)]"
        : "border-border";

  return (
    <div ref={omotacRef} className={`relative flex flex-col gap-2 font-tekst ${className}`}>
      <label id={uid} className={`text-body-sm font-medium ${tamno ? "text-white" : "text-text-body"}`}>
        {label}
      </label>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={otvoren}
        aria-labelledby={uid}
        name={name}
        onClick={() => setOtvoren((o) => !o)}
        className={`flex h-[calc(3.375rem-2px)] items-center gap-2 rounded-field border px-4 text-left shadow-[inset_0_1px_2px_rgb(14_92_85_/_0.05)] transition-[border-color,box-shadow] duration-200 ${tamno ? "bg-[rgba(255,255,255,0.06)]" : "bg-surface-0"} ${granica} ${
          otvoren ? (tamno ? "shadow-[0_0_0_3px_rgba(255,197,61,0.28)]" : "shadow-focus") : ""
        }`}
      >
        {izabrana?.ikonica}
        <span className={`flex-1 font-tekst text-body ${tamno ? "text-white" : "text-text-strong"}`}>
          {izabrana?.label ?? ""}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${otvoren ? "rotate-180" : ""} ${tamno ? "text-[rgba(191,227,208,0.75)]" : "text-text-muted"}`}
        />
      </button>
      {otvoren && (
        <ul
          role="listbox"
          aria-labelledby={uid}
          className={`absolute top-full left-0 z-20 mt-2 w-full overflow-hidden rounded-field border shadow-lg ${
            tamno
              ? "border-[rgba(255,197,61,0.25)] bg-[var(--color-bg-inverse)]"
              : "border-border bg-surface-0"
          }`}
        >
          {options.map((o) => {
            const oznacena = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={oznacena}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOtvoren(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-3 text-left font-tekst text-body transition-colors duration-150 ${
                    tamno
                      ? `text-white hover:bg-[rgba(255,197,61,0.12)] ${oznacena ? "bg-[rgba(255,197,61,0.08)]" : ""}`
                      : `text-text-strong hover:bg-primary-quiet ${oznacena ? "bg-primary-quiet" : ""}`
                  }`}
                >
                  {o.ikonica}
                  <span className="flex-1">{o.label}</span>
                  {oznacena && (
                    <Check size={16} className={tamno ? "text-[var(--color-gold)]" : "text-primary"} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {(error || help) && (
        <span className={`text-caption ${error ? "text-danger" : tamno ? "text-[rgba(191,227,208,0.75)]" : "text-text-muted"}`}>
          {error || help}
        </span>
      )}
    </div>
  );
}

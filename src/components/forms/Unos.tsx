"use client";

import { forwardRef, useId, useState, type ChangeEvent } from "react";

type ZajednickoSvojstvo = {
  label: string;
  help?: string;
  error?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  prefix?: string;
  placeholder?: string;
  className?: string;
  // Tamna varijanta — zlatna bordura i "mint" tekst umesto zelene/tamne, za
  // upotrebu na tamnozelenoj pozadini (vidi DodajUKorpuPopup.tsx).
  tamno?: boolean;
};

type Props =
  | (ZajednickoSvojstvo & {
      multiline?: false;
      type?: string;
      inputMode?: "text" | "numeric" | "tel";
      autoComplete?: string;
    })
  | (ZajednickoSvojstvo & { multiline: true; rows?: number });

// forwardRef samo za jednolinijski <input> (ne za textarea) — jedina
// potreba za ovim je DodajUKorpuPopup.tsx koji kači Google Places
// Autocomplete direktno na DOM element polja "Naziv biznisa".
export const Unos = forwardRef<HTMLInputElement, Props>(function Unos(props, ref) {
  const { label, help, error, name, value, onChange, prefix, placeholder, className = "", tamno = false } = props;
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
      <label
        htmlFor={uid}
        className={`text-body-sm font-medium ${tamno ? "text-white" : "text-text-body"}`}
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-field border px-4 shadow-[inset_0_1px_2px_rgb(14_92_85_/_0.05)] transition-[border-color,box-shadow] duration-200 ${tamno ? "bg-[rgba(255,255,255,0.06)]" : "bg-surface-0"} ${granica} ${
          fokus ? (tamno ? "shadow-[0_0_0_3px_rgba(255,197,61,0.28)]" : "shadow-focus") : ""
        }`}
      >
        {prefix && (
          <span className={`text-body ${tamno ? "text-[rgba(191,227,208,0.75)]" : "text-text-muted"}`}>
            {prefix}
          </span>
        )}
        {props.multiline ? (
          <textarea
            id={uid}
            name={name}
            value={value}
            rows={props.rows ?? 4}
            onFocus={() => setFokus(true)}
            onBlur={() => setFokus(false)}
            onChange={onChange}
            className={`min-w-0 flex-1 resize-y border-0 bg-transparent py-3 font-tekst text-body leading-body outline-none ${tamno ? "text-white" : "text-text-strong"}`}
          />
        ) : (
          <input
            ref={ref}
            id={uid}
            name={name}
            type={props.type ?? "text"}
            inputMode={props.inputMode}
            autoComplete={props.autoComplete}
            value={value}
            placeholder={placeholder}
            onFocus={() => setFokus(true)}
            onBlur={() => setFokus(false)}
            onChange={onChange}
            // data-tamno — browser autofill (Chrome/Edge) crta sopstvenu belu
            // pozadinu preko input-a, ignorišući bg-transparent; fix živi u
            // globals.css (input:autofill), ovaj atribut mu bira taman/svetao
            // par boja.
            data-tamno={tamno || undefined}
            className={`h-[calc(3.375rem-2px)] min-w-0 flex-1 border-0 bg-transparent font-tekst text-body outline-none ${tamno ? "text-white placeholder:text-[rgba(255,255,255,0.4)]" : "text-text-strong placeholder:text-text-muted"}`}
          />
        )}
      </div>
      {(error || help) && (
        <span
          className={`text-caption ${error ? "text-danger" : tamno ? "text-[rgba(191,227,208,0.75)]" : "text-text-muted"}`}
        >
          {error || help}
        </span>
      )}
    </div>
  );
});

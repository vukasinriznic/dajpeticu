"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  type?: "radio" | "checkbox";
  label: string;
  description?: string;
  boxed?: boolean;
};

export function Izbor({
  type = "checkbox",
  label,
  description,
  checked,
  id,
  boxed = false,
  className = "",
  ...rest
}: Props) {
  const generisaniId = useId();
  const uid = id || generisaniId;
  const [hover, setHover] = useState(false);

  return (
    <label
      htmlFor={uid}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex min-h-12 cursor-pointer gap-3 font-tekst ${description ? "items-start" : "items-center"} ${
        boxed
          ? `rounded-field border p-4 transition-[border-color,background] duration-200 ${
              checked
                ? "border-primary bg-primary-quiet"
                : hover
                  ? "border-border-strong bg-surface-0"
                  : "border-border bg-surface-0"
            }`
          : ""
      } ${className}`}
    >
      <input
        id={uid}
        type={type}
        checked={checked}
        className="h-6 w-6 shrink-0 accent-primary"
        style={{ marginTop: description ? 2 : 0 }}
        {...rest}
      />
      <span className="flex flex-col gap-0.5">
        <span
          className={`text-body text-text-strong ${description ? "font-medium" : "font-normal"}`}
        >
          {label}
        </span>
        {description && (
          <span className="text-caption leading-snug text-text-muted">{description}</span>
        )}
      </span>
    </label>
  );
}

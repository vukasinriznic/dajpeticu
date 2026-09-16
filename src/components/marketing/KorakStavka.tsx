import type { ReactNode } from "react";

export function KorakStavka({
  broj,
  naslov,
  children,
}: {
  broj: number;
  naslov: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary font-prikaz text-[1.25rem] leading-none font-normal text-text-on-primary">
        {broj}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="m-0 font-prikaz text-h3 leading-heading font-normal text-text-strong">
          {naslov}
        </h3>
        <p className="m-0 font-tekst text-body leading-body text-text-body">{children}</p>
      </div>
    </div>
  );
}

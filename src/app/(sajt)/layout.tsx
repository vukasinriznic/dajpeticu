import { Zaglavlje } from "@/components/sajt/Zaglavlje";
import { Podnozje } from "@/components/sajt/Podnozje";

// Grupa za sve "obične" stranice sajta (početna, uslovi, privatnost,
// garancija) — pune Zaglavlje+Podnozje. /placanje NIJE u ovoj grupi: ima
// sopstveni pojednostavljeni nav i bez footera (vidi placanje/page.tsx).
export default function SajtLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Zaglavlje />
      <main className="flex-1">{children}</main>
      <Podnozje />
    </>
  );
}

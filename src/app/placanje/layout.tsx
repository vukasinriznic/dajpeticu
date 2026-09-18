import type { Metadata } from "next";

// page.tsx je "use client" (forma zavisi od korpe/stanja), pa ne može sam
// da izveze metadata — ovaj layout postoji samo zbog toga. noindex jer je
// ovo checkout korak (sadržaj zavisi od trenutne korpe, nema svoju vrednost
// za pretragu, a ume i da preusmeri na "/" kad je korpa prazna).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PlacanjeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

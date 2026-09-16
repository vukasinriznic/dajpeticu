import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import { KorpaProvider } from "@/components/sajt/KorpaKontekst";
import "./globals.css";

// Tipografija Opcija A — vraćeno kao radna osnova dok se ceo sajt ne izgradi;
// finalni izbor fonta pada na kraju (vidi tipografija-daj-peticu.html artifact
// za ostale probane opcije B–H). latin-ext obavezan za č/ć/š/ž/đ.
const playfair = Playfair_Display({
  variable: "--font-prikaz-font",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-tekst-font",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Daj Peticu - NFC stalak za Google recenzije",
    template: `%s · ${site.naziv}`,
  },
  description: site.opis,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Daj Peticu — NFC stalak za Google recenzije",
    description: site.opis,
    url: site.url,
    siteName: site.naziv,
    locale: "sr_RS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col">
        <KorpaProvider>{children}</KorpaProvider>
      </body>
    </html>
  );
}

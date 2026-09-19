import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import { KorpaProvider } from "@/components/sajt/KorpaKontekst";
import { Analitika } from "@/components/sajt/Analitika";
import { StabilnaVisina } from "@/components/sajt/StabilnaVisina";
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
  // Nema "alternates.canonical" ovde namerno — Next.js NE meša (deep-merge)
  // roditeljski i dečji "alternates" po stranici, pa bi blanket "/" ovde
  // značio da SVAKA stranica (uslovi, privatnost, garancija...) dobije
  // canonical koji pokazuje na početnu. Svaka indeksirana stranica postavlja
  // sopstveni canonical u svom "page.tsx".
  robots: { index: true, follow: true },
  openGraph: {
    title: "Daj Peticu — NFC stalak za Google recenzije",
    description: site.opis,
    url: site.url,
    siteName: site.naziv,
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daj Peticu — NFC stalak za Google recenzije",
    description: site.opis,
  },
};

// Organization structured data — sitewide (za razliku od Product schema,
// koja živi samo na početnoj gde se proizvod stvarno "prodaje"). Namerno
// NEMA "aggregateRating"/"review" polja — testimonijali na sajtu su
// izričito nestvarni (placeholder dok ne stignu prave izjave mušterija), a
// lažni review structured data je protiv Google-ovih pravila i rizikuje
// kaznu, ne samo etičko pitanje.
const organizacijaJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.naziv,
  url: site.url,
  logo: `${site.url}/apple-icon.png`,
  telephone: site.telefonHref.replace("tel:", ""),
  email: site.email,
  sameAs: [site.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacijaJsonLd) }}
        />
        <KorpaProvider>{children}</KorpaProvider>
        <StabilnaVisina />
        <Analitika />
      </body>
    </html>
  );
}

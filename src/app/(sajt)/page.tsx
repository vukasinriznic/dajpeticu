import type { Metadata } from "next";
import { PocetnaStranica } from "@/components/sajt/PocetnaStranica";
import { jedinicnaCena } from "@/lib/cene";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Cena se čita iz iste tabele koju cene.ts koristi svuda drugde (jedinicna
// cena za 1 komad, bez popusta na količinu) — nikad ne duplirati broj ovde
// ručno, da structured data ne "odluta" od stvarne cene ako se tabela
// promeni. Bez "aggregateRating" — vidi napomenu uz Organization schema u
// layout.tsx, isti razlog.
const proizvodJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Daj Peticu NFC stalak",
  description: site.opis,
  // Slika koju Google koristi kao sličicu uz rezultat pretrage (25.09.2026.)
  // — bez ovoga sam bira sliku sa stranice i uzeo je sivu pozadinu hero-a.
  image: [`${site.url}/images/stalak-pretraga.jpg`],
  brand: { "@type": "Brand", name: site.naziv },
  offers: {
    "@type": "Offer",
    url: site.url,
    priceCurrency: "RSD",
    price: jedinicnaCena(1),
    availability: "https://schema.org/InStock",
    // Politika povraćaja (25.09.2026.) — mora da odgovara stranici Uslovi
    // ("Pravo na odustanak": 14 dana od prijema, bez obrazloženja). 90 dana
    // zamene u slučaju kvara je garancija, ne povraćaj, pa se ovde ne navodi.
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "RS",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
      merchantReturnLink: `${site.url}/uslovi`,
    },
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(proizvodJsonLd) }}
      />
      <PocetnaStranica />
    </>
  );
}

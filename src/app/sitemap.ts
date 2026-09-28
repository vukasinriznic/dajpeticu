import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// "/placanje" i "/api/*" se namerno ne navode ovde — checkout korak i API
// rute nemaju šta da traže u pretrazi (isto zašto "/placanje" ima
// robots:{index:false} u svom layout.tsx, i "/api" u robots.ts ispod).
export default function sitemap(): MetadataRoute.Sitemap {
  const sada = new Date();
  return [
    {
      url: `${site.url}/`,
      lastModified: sada,
      changeFrequency: "monthly",
      priority: 1,
      // Google-ov "image sitemap" signal (25.09.2026.) — Google je za sličicu
      // uz rezultat pretrage sam birao PROMINENTNIJU sliku sa stranice
      // (hero fotografiju stalka, uspravnu, 848×1401) umesto ove kvadratne
      // koju smo dali u Product structured data, pa je ispalo loše
      // uklopljeno (crne trake). Ovo je dodatni, zvaničan Google signal (van
      // structured data) da je BAŠ ova slika ta koju treba koristiti.
      images: [`${site.url}/images/stalak-pretraga.jpg`],
    },
    { url: `${site.url}/uslovi`, lastModified: sada, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/privatnost`, lastModified: sada, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/garancija`, lastModified: sada, changeFrequency: "yearly", priority: 0.5 },
  ];
}

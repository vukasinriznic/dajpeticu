import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// "/placanje" i "/api/*" se namerno ne navode ovde — checkout korak i API
// rute nemaju šta da traže u pretrazi (isto zašto "/placanje" ima
// robots:{index:false} u svom layout.tsx, i "/api" u robots.ts ispod).
export default function sitemap(): MetadataRoute.Sitemap {
  const sada = new Date();
  return [
    { url: `${site.url}/`, lastModified: sada, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/uslovi`, lastModified: sada, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/privatnost`, lastModified: sada, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/garancija`, lastModified: sada, changeFrequency: "yearly", priority: 0.5 },
  ];
}

// Google Analytics 4 — pomoćne funkcije. Sve je NO-OP dok NEXT_PUBLIC_GA_ID
// nije podešen ili dok korisnik nije doneo izbor; GA se učitava tek kad ID
// postoji (vidi components/sajt/Analitika.tsx).
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export type Pristanak = "da" | "ne" | null;

const KLJUC = "dp-pristanak-analitika";
const DOGADJAJ_PROMENE = "dp-pristanak";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function citajPristanak(): Pristanak {
  try {
    const v = window.localStorage.getItem(KLJUC);
    return v === "da" || v === "ne" ? v : null;
  } catch {
    return null;
  }
}

export function postaviPristanak(izbor: "da" | "ne") {
  try {
    window.localStorage.setItem(KLJUC, izbor);
  } catch {
    // localStorage nedostupan — izbor važi samo do zatvaranja stranice
  }
  window.gtag?.("consent", "update", { analytics_storage: izbor === "da" ? "granted" : "denied" });
  window.dispatchEvent(new Event(DOGADJAJ_PROMENE));
}

export function pretplatiNaPristanak(cb: () => void) {
  window.addEventListener(DOGADJAJ_PROMENE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(DOGADJAJ_PROMENE, cb);
    window.removeEventListener("storage", cb);
  };
}

// Događaj ka GA4 (preporučeni e-commerce događaji: add_to_cart,
// begin_checkout, purchase). Bez ličnih podataka — nikad naziv biznisa,
// ime, email, telefon ni adresa.
export function pratiDogadjaj(ime: string, parametri?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", ime, parametri);
}

export function stavkaZaAnalitiku(s: { boja: string; kolicina: number }) {
  return {
    item_id: `stalak-${s.boja}`,
    item_name: `NFC stalak (${s.boja === "crna" ? "crni" : "beli"})`,
    quantity: s.kolicina,
  };
}

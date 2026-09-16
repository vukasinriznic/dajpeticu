// Učitava Google Maps JavaScript API (sa Places bibliotekom) tačno jednom,
// bez obzira koliko puta se pozove — potrebno jer se popup za dodavanje u
// korpu ne demontira između otvaranja (vidi DodajUKorpuPopup.tsx), pa bi
// naivan pristup ubacio isti <script> više puta.

let ucitavanje: Promise<void> | null = null;

export function ucitajGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (ucitavanje) return ucitavanje;

  ucitavanje = new Promise((resolve, reject) => {
    const kljuc = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!kljuc) {
      reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY nije podešen."));
      return;
    }
    const skripta = document.createElement("script");
    skripta.src = `https://maps.googleapis.com/maps/api/js?key=${kljuc}&libraries=places`;
    skripta.async = true;
    skripta.onload = () => resolve();
    skripta.onerror = () => reject(new Error("Google Maps skripta nije uspela da se učita."));
    document.head.appendChild(skripta);
  });

  return ucitavanje;
}

declare global {
  interface Window {
    google?: typeof google;
  }
}

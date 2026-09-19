import "server-only";

// Jednostavno ograničenje učestalosti (po ključu, obično IP) u memoriji
// instance. NAPOMENA: na Vercel-u svaka serverless instanca ima sopstvenu
// memoriju, pa ovo hvata samo jednostavne skripte/dupli-klik, ne pravi
// distribuiran napad — pravu zaštitu daje Vercel Firewall rate-limit pravilo
// (vidi BEZBEDNOST.md), ovo je dodatni sloj bez spoljnih servisa.
const zapisi = new Map<string, number[]>();

export function dozvoljeno(kljuc: string, maxUProzoru: number, prozorMs: number): boolean {
  const sada = Date.now();
  const poslednji = (zapisi.get(kljuc) ?? []).filter((t) => sada - t < prozorMs);
  if (poslednji.length >= maxUProzoru) {
    zapisi.set(kljuc, poslednji);
    return false;
  }
  poslednji.push(sada);
  zapisi.set(kljuc, poslednji);
  // Sprečava rast memorije: povremeno počisti stare ključeve.
  if (zapisi.size > 5000) {
    for (const [k, v] of zapisi) if (v.every((t) => sada - t >= prozorMs)) zapisi.delete(k);
  }
  return true;
}

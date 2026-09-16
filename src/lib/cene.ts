// Cenovna tabela — revidirana na niže (13.09.2026) da bude konkurentnija
// (konkurencija ne nudi popust na količinu uopšte). Nije formula, koraci su
// namerno neravnomerni (veliki odmah posle 1, 2, 5, 10 kom, pa sve sitniji
// do 25), pa je tabela pretraga, ne izračunavanje.
const CENA_PO_KOLICINI: Record<number, number> = {
  1: 3290,
  2: 2990,
  3: 2810,
  4: 2670,
  5: 2578,
  6: 2418,
  7: 2278,
  8: 2158,
  9: 2058,
  10: 1989,
  11: 1949,
  12: 1909,
  13: 1869,
  14: 1829,
  15: 1789,
  16: 1749,
  17: 1729,
  18: 1709,
  19: 1689,
  20: 1669,
  21: 1649,
  22: 1629,
  23: 1609,
  24: 1599,
  25: 1590,
};

// Porudžbine se za sada ne primaju iznad 25 kartica (veće količine —
// posebna sekcija/kontakt, planirano kasnije, van ovog toka).
export const MAX_KOLICINA = 25;

export const POSTARINA = 390;

// Podsticaj na veću porudžbinu: besplatna dostava od 2 stalka, gratis mala
// Google kartica (poklon, ne posebna stavka u korpi — obećanje ispunjeno pri
// pakovanju) od 3 stalka. Prag se računa na ukupnu količinu cele korpe, isto
// kao i popust po količini.
export const PRAG_BESPLATNE_DOSTAVE = 2;
export const PRAG_GRATIS_POKLONA = 3;

export function postarina(ukupnaKolicina: number): number {
  return ukupnaKolicina >= PRAG_BESPLATNE_DOSTAVE ? 0 : POSTARINA;
}

export function jedinicnaCena(kolicina: number): number {
  const k = Math.min(Math.max(Math.round(kolicina), 1), MAX_KOLICINA);
  return CENA_PO_KOLICINI[k];
}

export function cenaKartica(kolicina: number): number {
  return jedinicnaCena(kolicina) * kolicina;
}

// Korpa može imati više stavki (npr. 3 crne + 2 bele kartice) — popust po
// količini se računa na ZBIR cele korpe, ne po stavci, kao svaki normalan
// količinski popust. `jedinicnaCena(ukupnaKolicinaKorpe)` daje cenu iz
// tabele, pa se tom cenom množi količina KONKRETNE stavke.
export function cenaKarticaZaStavku(ukupnaKolicinaKorpe: number, stavkaKolicina: number): number {
  return jedinicnaCena(ukupnaKolicinaKorpe) * stavkaKolicina;
}

export function ukupnoKorpa(stavke: { kolicina: number }[]): number {
  const ukupnaKolicina = stavke.reduce((zbir, s) => zbir + s.kolicina, 0);
  const cenaKartica = stavke.reduce(
    (zbir, s) => zbir + cenaKarticaZaStavku(ukupnaKolicina, s.kolicina),
    0,
  );
  return cenaKartica + postarina(ukupnaKolicina);
}

// 1 stalak · 2-4 stalka · 5+ stalaka (uz mod-100 za 21, 22, 101…)
export function reciKartica(n: number): string {
  const d100 = n % 100;
  const d10 = n % 10;
  if (d100 >= 11 && d100 <= 14) return "stalaka";
  if (d10 === 1) return "stalak";
  if (d10 >= 2 && d10 <= 4) return "stalka";
  return "stalaka";
}

export function kolicinaSlovima(n: number): string {
  return `${n} ${reciKartica(n)}`;
}

export function formatBroj(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatRSD(n: number): string {
  return `${formatBroj(n)} RSD`;
}

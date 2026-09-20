// Cenovna tabela — revidirana na niže (13.09.2026) da bude konkurentnija
// (konkurencija ne nudi popust na količinu uopšte). Nije formula, koraci su
// namerno neravnomerni (veliki odmah posle 1, 2, 5, 10 kom, pa sve sitniji
// do 25), pa je tabela pretraga, ne izračunavanje.
// Cena po komadu, izvedena iz OKRUGLIH ukupnih cena (20.09.2026.) — vlasnik
// zadaje okrugle iznose, a cena po komadu je ukupno / količina i uvek ceo
// broj. Ukupno: 1=3.290, 2=5.990, 3=8.400, 4=10.700, 5=12.890, 6=14.490,
// 7=15.890, 8=17.280, 9=18.450, 10=19.890, 11=21.340, 12=22.920, 13=24.310,
// 14=25.620, 15=26.790, 16=28.000, 17=29.410, 18=30.780, 19=32.110,
// 20=33.400, 21=34.650, 22=35.750, 23=37.030, 24=38.400, 25=39.800.
const CENA_PO_KOLICINI: Record<number, number> = {
  1: 3290,
  2: 2995,
  3: 2800,
  4: 2675,
  5: 2578,
  6: 2415,
  7: 2270,
  8: 2160,
  9: 2050,
  10: 1989,
  11: 1940,
  12: 1910,
  13: 1870,
  14: 1830,
  15: 1786,
  16: 1750,
  17: 1730,
  18: 1710,
  19: 1690,
  20: 1670,
  21: 1650,
  22: 1625,
  23: 1610,
  24: 1600,
  25: 1592,
};

// Porudžbine se za sada ne primaju iznad 25 kartica (veće količine —
// posebna sekcija/kontakt, planirano kasnije, van ovog toka).
export const MAX_KOLICINA = 25;

// Podsticaj na veću porudžbinu: besplatna dostava od 2 stalka, gratis mala
// Google kartica (poklon, ne posebna stavka u korpi — obećanje ispunjeno pri
// pakovanju) od 3 stalka. Prag se računa na ukupnu količinu cele korpe, isto
// kao i popust po količini.
export const PRAG_BESPLATNE_DOSTAVE = 2;
export const PRAG_GRATIS_POKLONA = 3;

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
  // Poštarina se NE računa u iznos (20.09.2026.): pri 1 stalku kupac plaća
  // kuriru pri preuzimanju (piše u uslovima), od 2 stalka je pokrivamo mi.
  return cenaKartica;
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

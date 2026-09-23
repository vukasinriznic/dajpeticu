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

// Podsticaji na veću porudžbinu — ni jedan od njih nije posebna stavka u
// korpi niti menja stvarno naplaćen iznos (ukupnoKorpa ispod); sva tri su
// samo obećanja ispunjena pri pakovanju.
// - Besplatna dostava (24.09.2026., PROMENJENO sa praga po količini na prag
//   po CENI) — od preko 5.000 RSD ukupne vrednosti korpe. Kao i ranije,
//   računa se na CELU korpu (veći i manji stalak zajedno), jer je dostava o
//   fizičkoj pošiljci, ne o cenovniku po proizvodu.
// - Gratis mala Google kartica — od 3 stalka, bilo koje veličine/boje,
//   zbir cele korpe (nepromenjeno).
// - Gratis VEĆI stalak (24.09.2026., novo) — kad korpa ima 10 ili više
//   MANJIH stalaka (bilo koje boje) — samo manji se broje, veći se ne
//   računaju u ovaj prag (kupac koji već kupuje veće nema poseban podsticaj
//   da ih poredja do 10, poklon je vezan konkretno za "10 malih").
export const PRAG_BESPLATNE_DOSTAVE_RSD = 5000;
export const PRAG_GRATIS_POKLONA = 3;
export const PRAG_GRATIS_VECI_STALAK = 10;

export function jedinicnaCena(kolicina: number): number {
  const k = Math.min(Math.max(Math.round(kolicina), 1), MAX_KOLICINA);
  return CENA_PO_KOLICINI[k];
}

export function cenaKartica(kolicina: number): number {
  return jedinicnaCena(kolicina) * kolicina;
}

// Manji stalak (23.09.2026.) — potpuno drugačiji cenovnik od većeg: vlasnik
// je odredio OKRUGLE UKUPNE cene direktno (isti brojevi kao u PDF cenovniku
// koji se šalje kupcima — DAJPETICU_DRIVE/CENE_PDF/Cenovnik_Kartice.pdf),
// ne cenu po komadu koja se množi količinom (ta tabela se ne deli čisto na
// cele dinare). Stvarno naplaćen iznos je UVEK direktno iz ove tabele;
// "cena po komadu" za manji se samo IZVODI (ukupno/količina) za prikaz.
const UKUPNA_CENA_MANJI: Record<number, number> = {
  1: 2490,
  2: 4490,
  3: 6390,
  4: 7990,
  5: 9790,
  6: 10990,
  7: 11990,
  8: 12990,
  9: 13990,
  10: 14990,
  11: 16290,
  12: 17290,
  13: 18290,
  14: 19290,
  15: 20290,
  16: 21190,
  17: 22190,
  18: 23190,
  19: 24390,
  20: 25190,
  21: 26290,
  22: 26990,
  23: 27990,
  24: 28990,
  25: 29990,
};

function steziKolicinu(kolicina: number): number {
  return Math.min(Math.max(Math.round(kolicina), 1), MAX_KOLICINA);
}

export function ukupnaCenaManji(kolicina: number): number {
  return UKUPNA_CENA_MANJI[steziKolicinu(kolicina)];
}

// Samo za prikaz ("X RSD/kom") — deljenje ukupne cene tim brojem komada ne
// daje uvek ceo broj (cenovnik je zadat kao ukupno, ne po komadu), pa se
// ovde samo zaokružuje radi lepog prikaza; stvarna cena ostaje
// ukupnaCenaManji(), nikad ovaj broj × količina.
export function jedinicnaCenaManjiPrikaz(kolicina: number): number {
  const k = steziKolicinu(kolicina);
  return Math.round(ukupnaCenaManji(k) / k);
}

// Veći i manji stalak su različiti proizvodi sa različitim cenovnicima —
// količinski popust se NE meša između njih. Svaka veličina ima sopstveni
// "pool" (zbir SAMO stavki te veličine u korpi, bilo koje boje), ne zbir
// cele korpe. "velicina" je opciono i podrazumeva "veci" — stariji pozivi
// (pre 23.09.2026., kad je postojao samo jedan proizvod) i dalje rade.
type VelicinaStavke = "veci" | "manji";
type StavkaZaCenu = { kolicina: number; velicina?: VelicinaStavke };

function ukupnaKolicinaZaVelicinu(stavke: StavkaZaCenu[], velicina: VelicinaStavke): number {
  return stavke
    .filter((s) => (s.velicina ?? "veci") === velicina)
    .reduce((zbir, s) => zbir + s.kolicina, 0);
}

// Izvezeno za PRAG_GRATIS_VECI_STALAK — koriste popup/korpa/forma za
// plaćanje da prikažu "Gratis veći stalak" poruku, isti obrazac kao
// ukupnaKolicinaZaVelicinu iznad, samo javno dostupan van ovog fajla.
export function ukupnaKolicinaManjihUKorpi(stavke: StavkaZaCenu[]): number {
  return ukupnaKolicinaZaVelicinu(stavke, "manji");
}

// Cena JEDNE stavke (jednog reda u korpi) — zavisi od ukupne količine SVIH
// stavki ISTE veličine u korpi (popust po tier-u), ne cele korpe.
// Veći: tačno cena-po-komadu × sopstvena količina (uvek se tačno sabira do
// ukupno, jer je cenovnik zadat po komadu).
// Manji: PROPORCIONALAN deo ukupne cene tier-a (cenovnik je po UKUPNOJ
// količini, ne po komadu) — kad je u korpi samo JEDNA stavka te veličine
// (najčešći slučaj), ovo je prosto ukupnaCenaManji(kolicina). Sa više boja
// iste veličine u korpi, deli se srazmerno i zaokružuje po redu; stvarno
// NAPLAĆEN ukupan iznos korpe (ukupnoKorpa ispod) i dalje dolazi direktno
// iz tabele, ne sabiranjem redova, pa sitno zaokruživanje ovde (do 1-2 RSD)
// nikad ne menja šta se stvarno naplati.
export function cenaStavkeUKorpi(stavke: StavkaZaCenu[], stavka: StavkaZaCenu): number {
  const velicina = stavka.velicina ?? "veci";
  const ukupnaZaVelicinu = ukupnaKolicinaZaVelicinu(stavke, velicina);
  if (velicina === "manji") {
    if (ukupnaZaVelicinu <= 0) return 0;
    return Math.round(ukupnaCenaManji(ukupnaZaVelicinu) * (stavka.kolicina / ukupnaZaVelicinu));
  }
  return jedinicnaCena(ukupnaZaVelicinu) * stavka.kolicina;
}

// Zadržano zbog kompatibilnosti gde se poziva sa "ukupnaKolicinaKorpe"
// direktno izračunatom napolju (uvek za VEĆI stalak — manji ide isključivo
// preko cenaStavkeUKorpi, koji zna da razdvoji veličine).
export function cenaKarticaZaStavku(ukupnaKolicinaKorpe: number, stavkaKolicina: number): number {
  return jedinicnaCena(ukupnaKolicinaKorpe) * stavkaKolicina;
}

export function ukupnoKorpa(stavke: StavkaZaCenu[]): number {
  const veciKolicina = ukupnaKolicinaZaVelicinu(stavke, "veci");
  const manjiKolicina = ukupnaKolicinaZaVelicinu(stavke, "manji");
  const cenaVeci = veciKolicina > 0 ? cenaKartica(veciKolicina) : 0;
  const cenaManji = manjiKolicina > 0 ? ukupnaCenaManji(manjiKolicina) : 0;
  // Poštarina se NE računa u iznos (20.09.2026.): pri 1 stalku kupac plaća
  // kuriru pri preuzimanju (piše u uslovima), od 2 stalka je pokrivamo mi.
  // Prag se računa na UKUPAN broj komada u korpi (bilo koje veličine) —
  // dostava/poklon su o fizičkoj pošiljci, ne o cenovniku po proizvodu.
  return cenaVeci + cenaManji;
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

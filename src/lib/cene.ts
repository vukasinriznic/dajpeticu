// Cenovna tabela VEĆEG stalka — nove niže cene (31.10.2026., pred pokretanje
// plaćenih reklama; konkurencija je skuplja). Kao i kod manjeg, vlasnik zadaje
// OKRUGLE UKUPNE cene po količini (nisu deljive celim brojem po komadu, npr.
// 7.790 / 3), pa je stvarno naplaćen iznos UVEK direktno iz ove tabele, a
// "cena po komadu" se samo izvodi (zaokruženo) radi prikaza. Nije formula,
// koraci su neravnomerni (blagi do 10 kom, od 11 nepromenjeno kao ranije).
const UKUPNA_CENA_VECI: Record<number, number> = {
  1: 2990,
  2: 5490,
  3: 7790,
  4: 9890,
  5: 11890,
  6: 13690,
  7: 15390,
  8: 16990,
  9: 18490,
  10: 19890,
  11: 21340,
  12: 22920,
  13: 24310,
  14: 25620,
  15: 26790,
  16: 28000,
  17: 29410,
  18: 30780,
  19: 32110,
  20: 33400,
  21: 34650,
  22: 35750,
  23: 37030,
  24: 38400,
  25: 39800,
};

// Porudžbine se za sada ne primaju iznad 25 kartica (veće količine —
// posebna sekcija/kontakt, planirano kasnije, van ovog toka).
export const MAX_KOLICINA = 25;

// Podsticaji na veću porudžbinu — ni jedan od njih nije posebna stavka u
// korpi niti menja stvarno naplaćen iznos (ukupnoKorpa ispod); oba su samo
// obećanja ispunjena pri pakovanju.
// - Besplatna dostava (24.09.2026., PROMENJENO sa praga po količini na prag
//   po CENI) — od preko 5.000 RSD ukupne vrednosti korpe. Kao i ranije,
//   računa se na CELU korpu (veći i manji stalak zajedno), jer je dostava o
//   fizičkoj pošiljci, ne o cenovniku po proizvodu.
// - Gratis VEĆI stalak (24.09.2026., novo; prag spušten sa 10 na 5
//   08.10.2026., eksplicitno traženo) — kad korpa ima 5 ili više MANJIH
//   stalaka (bilo koje boje) — samo manji se broje, veći se ne računaju u
//   ovaj prag (poklon je vezan konkretno za "5 malih").
// - Gratis MANJI stalak (24.09.2026., novo; prag spušten sa 3 na 2
//   08.10.2026., eksplicitno traženo) — simetrično obrnuto: kad korpa ima 2
//   ili više VEĆIH stalaka (bilo koje boje), samo veći se broje.
export const PRAG_BESPLATNE_DOSTAVE_RSD = 5000;
export const PRAG_GRATIS_VECI_STALAK = 5;
export const PRAG_GRATIS_MANJI_STALAK = 2;

function steziKolicinu(kolicina: number): number {
  return Math.min(Math.max(Math.round(kolicina), 1), MAX_KOLICINA);
}

// Ukupna cena za K većih stalaka — direktno iz tabele.
export function cenaKartica(kolicina: number): number {
  return UKUPNA_CENA_VECI[steziKolicinu(kolicina)];
}

// Samo za prikaz ("X RSD/kom") — zaokruženo; stvarna cena je cenaKartica(),
// nikad ovaj broj × količina.
export function jedinicnaCena(kolicina: number): number {
  const k = steziKolicinu(kolicina);
  return Math.round(UKUPNA_CENA_VECI[k] / k);
}

// Manji stalak (23.09.2026., nove niže cene 31.10.2026.) — sopstveni cenovnik
// (isti brojevi kao u PDF cenovniku koji se šalje kupcima —
// DAJPETICU_DRIVE/CENE_PDF/Cenovnik_Kartice.pdf): OKRUGLE UKUPNE cene
// direktno, ne cena po komadu. Stvarno naplaćen iznos je UVEK direktno iz
// ove tabele; "cena po komadu" se samo IZVODI (ukupno/količina) za prikaz.
const UKUPNA_CENA_MANJI: Record<number, number> = {
  1: 1990,
  2: 3690,
  3: 5290,
  4: 6790,
  5: 8190,
  6: 9490,
  7: 10690,
  8: 11790,
  9: 12890,
  10: 13990,
  11: 15290,
  12: 16290,
  13: 17290,
  14: 18290,
  15: 19290,
  16: 20190,
  17: 21190,
  18: 22190,
  19: 23390,
  20: 24190,
  21: 25290,
  22: 25990,
  23: 26990,
  24: 27990,
  25: 28990,
};

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

// Izvezeno za PRAG_GRATIS_VECI_STALAK/PRAG_GRATIS_MANJI_STALAK — koriste
// popup/korpa/forma za plaćanje da prikažu "Gratis veći/manji stalak"
// poruku, isti obrazac kao ukupnaKolicinaZaVelicinu iznad, samo javno
// dostupan van ovog fajla.
export function ukupnaKolicinaManjihUKorpi(stavke: StavkaZaCenu[]): number {
  return ukupnaKolicinaZaVelicinu(stavke, "manji");
}

export function ukupnaKolicinaVecihUKorpi(stavke: StavkaZaCenu[]): number {
  return ukupnaKolicinaZaVelicinu(stavke, "veci");
}

// Cena JEDNE stavke (jednog reda u korpi) — zavisi od ukupne količine SVIH
// stavki ISTE veličine u korpi (popust po tier-u), ne cele korpe.
// Obe veličine su zadate UKUPNOM cenom po količini (ne po komadu), pa je cena
// reda PROPORCIONALAN deo ukupne cene tier-a — kad je u korpi samo JEDNA
// stavka te veličine (najčešći slučaj), ovo je prosto ukupna cena iz tabele.
// Sa više boja iste veličine u korpi, deli se srazmerno i zaokružuje po redu;
// stvarno NAPLAĆEN ukupan iznos korpe (ukupnoKorpa ispod) i dalje dolazi
// direktno iz tabele, ne sabiranjem redova, pa sitno zaokruživanje ovde (do
// 1-2 RSD) nikad ne menja šta se stvarno naplati.
export function cenaStavkeUKorpi(stavke: StavkaZaCenu[], stavka: StavkaZaCenu): number {
  const velicina = stavka.velicina ?? "veci";
  const ukupnaZaVelicinu = ukupnaKolicinaZaVelicinu(stavke, velicina);
  if (ukupnaZaVelicinu <= 0) return 0;
  const ukupnaCena = velicina === "manji" ? ukupnaCenaManji(ukupnaZaVelicinu) : cenaKartica(ukupnaZaVelicinu);
  return Math.round(ukupnaCena * (stavka.kolicina / ukupnaZaVelicinu));
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

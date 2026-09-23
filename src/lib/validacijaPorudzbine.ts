// Iste funkcije se pozivaju i na klijentu (inline greške u formi) i na
// serveru (odbrana u dubinu — klijentska validacija se nikad ne veruje).

import { MAX_KOLICINA } from "@/lib/cene";

export type Boja = "crna" | "bela";

// Veličina stalka (20.09.2026., popup dobio izbor iznad boje) — "veci" je
// postojeći proizvod (12,75 × 7,6 cm), "manji" je novi (8,56 × 5,4 cm).
// NAPOMENA: cena se ZA SADA računa isto za obe veličine (ista tabela u
// cene.ts) — prava cena manjeg stalka još nije definisana.
export type Velicina = "veci" | "manji";

export type Stavka = {
  boja: Boja;
  velicina: Velicina;
  kolicina: number;
  nazivBiznisa: string;
  // Google Place ID biznisa (ako je izabran iz Autocomplete predloga) — koristi
  // se kasnije za generisanje pravog "ostavi recenziju" linka. Opciono jer
  // korisnik može i samo otkucati naziv bez biranja iz padajuće liste.
  googlePlaceId?: string;
};

export type Porudzbina = {
  email: string;
  drzava: string;
  ime: string;
  prezime: string;
  pib: string;
  adresa: string;
  postanskiBroj: string;
  grad: string;
  telefon: string;
  stavke: Stavka[];
};

export function validirajStavku(
  stavka: Pick<Stavka, "kolicina" | "nazivBiznisa">,
): Partial<Record<"kolicina" | "nazivBiznisa", string>> {
  const greske: Partial<Record<"kolicina" | "nazivBiznisa", string>> = {};
  if (!Number.isInteger(stavka.kolicina) || stavka.kolicina < 1 || stavka.kolicina > MAX_KOLICINA) {
    greske.kolicina = `Količina mora biti između 1 i ${MAX_KOLICINA}.`;
  }
  if (stavka.nazivBiznisa.trim().length < 2) {
    greske.nazivBiznisa = "Unesite naziv biznisa.";
  } else if (stavka.nazivBiznisa.length > MAX_DUZINA.nazivBiznisa) {
    greske.nazivBiznisa = `Naziv može imati najviše ${MAX_DUZINA.nazivBiznisa} znakova.`;
  }
  return greske;
}

// Bez razmaka, zareza, tačke-zareza, navodnika i zagrada — sprečava da jedno
// polje postane više primalaca ili "Ime <adresa>" u mejl zaglavlju.
const EMAIL_REGEX = /^[^\s@,;<>()"']+@[^\s@,;<>()"']+\.[^\s@,;<>()"']+$/;

// Gornje granice dužina (odbrana od gigantskih unosa u bazu i mejlove).
export const MAX_DUZINA = {
  email: 254,
  ime: 60,
  prezime: 60,
  adresa: 150,
  grad: 80,
  drzava: 60,
  telefon: 30,
  pib: 9,
  nazivBiznisa: 120,
} as const;

const PLACE_ID_REGEX = /^[A-Za-z0-9_-]{10,200}$/;
export const jeIspravanPlaceId = (id: string) => PLACE_ID_REGEX.test(id);

export function validirajPorudzbinu(
  p: Omit<Porudzbina, "stavke"> & { stavke: Pick<Stavka, "kolicina" | "nazivBiznisa">[] },
): Partial<Record<keyof Omit<Porudzbina, "stavke">, string>> {
  const greske: Partial<Record<keyof Omit<Porudzbina, "stavke">, string>> = {};

  if (!EMAIL_REGEX.test(p.email.trim())) greske.email = "Unesite ispravan email.";
  if (!p.drzava.trim()) greske.drzava = "Izaberite državu.";
  if (p.ime.trim().length < 2) greske.ime = "Unesite ime.";
  if (p.prezime.trim().length < 2) greske.prezime = "Unesite prezime.";
  if (!p.adresa.trim()) greske.adresa = "Unesite adresu za dostavu.";
  if (!/^\d{5}$/.test(p.postanskiBroj.trim())) greske.postanskiBroj = "Poštanski broj ima pet cifara.";
  if (!p.grad.trim()) greske.grad = "Unesite grad.";
  if (p.telefon.replace(/\D/g, "").length < 8) greske.telefon = "Unesite broj telefona.";
  // Preduge vrednosti (ne uklapaju se u formu ni u mejl) — jedna zajednička
  // poruka; nikad ne dolazi od običnog korisnika koji popunjava polja.
  const PREDUGO = "Uneta vrednost je predugačka.";
  if (p.email.length > MAX_DUZINA.email) greske.email = PREDUGO;
  if (p.ime.length > MAX_DUZINA.ime) greske.ime = PREDUGO;
  if (p.prezime.length > MAX_DUZINA.prezime) greske.prezime = PREDUGO;
  if (p.adresa.length > MAX_DUZINA.adresa) greske.adresa = PREDUGO;
  if (p.grad.length > MAX_DUZINA.grad) greske.grad = PREDUGO;
  if (p.drzava.length > MAX_DUZINA.drzava) greske.drzava = PREDUGO;
  if (p.telefon.length > MAX_DUZINA.telefon) greske.telefon = PREDUGO;
  // PIB je opcion — ako je unet, mora biti 8 ili 9 cifara (preduzetnik/pravno lice u Srbiji).
  if (p.pib.trim() && !/^\d{8,9}$/.test(p.pib.trim())) {
    greske.pib = "PIB ima 8 ili 9 cifara.";
  }

  return greske;
}

// Cena se ne računa iznad MAX_KOLICINA (25) — pravilo je na nivou CELE
// korpe (zbir svih stavki/boja), ne po stavci, jer "25 kartica" znači 25
// komada ukupno u porudžbini, bez obzira na mešavinu boja.
// Granica je PO VELIČINI (23.09.2026., otkad veći i manji stalak imaju
// odvojene cenovnike, svaki definisan samo za 1-25 komada) — 25 velikih I
// 25 malih u istoj korpi je u redu, ali 26 istih nije.
export function validirajUkupnuKolicinu(stavke: Pick<Stavka, "kolicina" | "velicina">[]): string | null {
  for (const v of ["veci", "manji"] as const) {
    const ukupno = stavke.filter((s) => s.velicina === v).reduce((zbir, s) => zbir + s.kolicina, 0);
    if (ukupno > MAX_KOLICINA) {
      return `Za sada primamo porudžbine do ${MAX_KOLICINA} stalaka te veličine. Za veću količinu, javite nam se direktno.`;
    }
  }
  return null;
}

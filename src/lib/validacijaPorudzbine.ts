// Iste funkcije se pozivaju i na klijentu (inline greške u formi) i na
// serveru (odbrana u dubinu — klijentska validacija se nikad ne veruje).

import { MAX_KOLICINA } from "@/lib/cene";

export type Boja = "crna" | "bela";

export type Stavka = {
  boja: Boja;
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
  }
  return greske;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  // PIB je opcion — ako je unet, mora biti 8 ili 9 cifara (preduzetnik/pravno lice u Srbiji).
  if (p.pib.trim() && !/^\d{8,9}$/.test(p.pib.trim())) {
    greske.pib = "PIB ima 8 ili 9 cifara.";
  }

  return greske;
}

// Cena se ne računa iznad MAX_KOLICINA (25) — pravilo je na nivou CELE
// korpe (zbir svih stavki/boja), ne po stavci, jer "25 kartica" znači 25
// komada ukupno u porudžbini, bez obzira na mešavinu boja.
export function validirajUkupnuKolicinu(stavke: Pick<Stavka, "kolicina">[]): string | null {
  const ukupno = stavke.reduce((zbir, s) => zbir + s.kolicina, 0);
  if (ukupno > MAX_KOLICINA) {
    return `Za sada primamo porudžbine do ${MAX_KOLICINA} stalaka. Za veću količinu, javite nam se direktno.`;
  }
  return null;
}

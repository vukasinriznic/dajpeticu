// Prezentacioni podaci za dve veličine stalka (20.09.2026., popup dobio
// izbor veličine) — jedno mesto koje popup/korpa/forma za plaćanje dele,
// da se putanje do slika i nazivi ne dupliraju na 3-4 mesta.
import type { Boja, Velicina } from "@/lib/validacijaPorudzbine";

export const VELICINE: { vrednost: Velicina; naziv: string; dimenzije: string }[] = [
  { vrednost: "veci", naziv: "Veći stalak", dimenzije: "12,75 × 7,6 cm" },
  { vrednost: "manji", naziv: "Manji stalak", dimenzije: "8,56 × 5,4 cm" },
];

// Slika za konkretnu kombinaciju veličine i boje. Manji stalak (bez
// providnog postolja u fotografiji) koristi kartica_*.png, veći koristi
// postojeće stalak_*.webp.
export function slikaProizvoda(velicina: Velicina, boja: Boja): string {
  if (velicina === "manji") {
    return boja === "crna" ? "/images/kartica_crna.png" : "/images/kartica_bela.png";
  }
  return boja === "crna" ? "/images/stalak_crni.webp" : "/images/stalak_beli.webp";
}

// CSS aspect-ratio zapis (širina/visina) — različit razmer fotografije za
// veći (848/1401) i manji (872/1355) stalak, prosleđuje se Kartica3D-u.
// kartica_bela.png/kartica_crna.png su 22.09.2026. ponovo obrađene — prvi
// pokušaj (samo poravnata providna margina oko cele "silhuete" providnog
// stalka) NIJE bio dovoljan: sama KARTICA (beli/crni panel sa QR kodom) je
// na originalnim fotografijama zauzimala različit procenat kadra (bela
// ~73% širine, crna ~57%), jer providni stalak oko crne kartice zauzima
// vidljivo više prostora na toj fotografiji. Rešenje: crna slika je
// UVEĆANA (×1.1755) tako da njen panel (širina) bude piksel-jednak
// belininom, pa su OBE ponovo centrirane/opsečene oko centra panela na
// zajedničko platno — sad su panel I platno identične veličine/razmera za
// obe boje (872×1355 oba fajla), a ceo providni stalak i dalje staje u
// kadar bez sečenja.
export function razmerProizvoda(velicina: Velicina): string {
  return velicina === "manji" ? "872 / 1355" : "848 / 1401";
}

// Isti broj kao string (za obrnut izračun kvadratne širine oko mobilne
// slike — vidi DodajUKorpuPopup.tsx).
export function razmerProizvodaBroj(velicina: Velicina): number {
  return velicina === "manji" ? 872 / 1355 : 848 / 1401;
}

export function nazivProizvoda(velicina: Velicina): string {
  return velicina === "manji" ? "Manji stalak" : "Veći stalak";
}

// Optička korekcija — kartica_bela.png/kartica_crna.png su piksel-tačno
// iste veličine (izmereno), ali crna, kao tamnija površina, IZGLEDA nešto
// krupnije (poznata optička varka, ne stvarna razlika u pikselima). Sitno
// smanjenje SAMO crne varijante manjeg stalka to ispravlja; veći stalak i
// beli manji stalak ostaju netaknuti (scale 1). Dva ODVOJENA iznosa jer je
// korisnik posebno podešavao svaki kontekst (22.09.2026.): minijatura u
// korpi/formi za plaćanje (2,5%) i velika/mobilna slika u samom popupu
// (3%) — drugačija veličina prikaza, drugačija percepcija.
export function opticnaKorekcijaSkalaKorpa(velicina: Velicina, boja: Boja): number {
  return velicina === "manji" && boja === "crna" ? 0.975 : 1;
}

export function opticnaKorekcijaSkalaPopup(velicina: Velicina, boja: Boja): number {
  return velicina === "manji" && boja === "crna" ? 0.97 : 1;
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { posaljiObavestenjeVlasniku, posaljiPotvrduKupcu } from "@/lib/resend";
import { ukupnoKorpa } from "@/lib/cene";
import {
  validirajPorudzbinu,
  validirajStavku,
  validirajUkupnuKolicinu,
  type Boja,
} from "@/lib/validacijaPorudzbine";

type Telo = {
  email?: string;
  drzava?: string;
  ime?: string;
  prezime?: string;
  pib?: string;
  adresa?: string;
  postanskiBroj?: string;
  grad?: string;
  telefon?: string;
  stavke?: { boja?: string; kolicina?: number; nazivBiznisa?: string; googlePlaceId?: string }[];
  // Honeypot — pravi korisnici ga nikad ne popune (vizuelno je van ekrana).
  web?: string;
};

export async function POST(req: Request) {
  let telo: Telo;
  try {
    telo = await req.json();
  } catch {
    return NextResponse.json({ greske: { opsta: "Neispravan zahtev." } }, { status: 400 });
  }

  // Honeypot upalio — tiho vrati uspeh bez upisa, da bot ne zna da je uhvaćen.
  if (telo.web) {
    return NextResponse.json({ id: "ok", ukupnaCena: 0 });
  }

  const stavke = (telo.stavke ?? []).map((s) => ({
    boja: (s.boja === "crna" ? "crna" : "bela") as Boja,
    kolicina: Number(s.kolicina),
    nazivBiznisa: String(s.nazivBiznisa ?? ""),
    ...(s.googlePlaceId ? { googlePlaceId: String(s.googlePlaceId) } : {}),
  }));

  if (stavke.length === 0) {
    return NextResponse.json({ greske: { opsta: "Korpa je prazna." } }, { status: 400 });
  }

  const greskeStavki = stavke.map((s) => validirajStavku(s));
  if (greskeStavki.some((g) => Object.keys(g).length > 0)) {
    return NextResponse.json({ greske: { opsta: "Neispravna stavka u korpi." } }, { status: 400 });
  }

  const greskaKolicine = validirajUkupnuKolicinu(stavke);
  if (greskaKolicine) {
    return NextResponse.json({ greske: { opsta: greskaKolicine } }, { status: 400 });
  }

  const polja = {
    email: String(telo.email ?? ""),
    drzava: String(telo.drzava ?? ""),
    ime: String(telo.ime ?? ""),
    prezime: String(telo.prezime ?? ""),
    pib: String(telo.pib ?? ""),
    adresa: String(telo.adresa ?? ""),
    postanskiBroj: String(telo.postanskiBroj ?? ""),
    grad: String(telo.grad ?? ""),
    telefon: String(telo.telefon ?? ""),
  };

  const greske = validirajPorudzbinu({ ...polja, stavke });
  if (Object.keys(greske).length > 0) {
    return NextResponse.json({ greske }, { status: 400 });
  }

  // Cena se UVEK računa ovde, na serveru — klijentski izračunata cena se
  // nikad ne veruje i nikad se ne upisuje u bazu.
  const ukupnaCena = ukupnoKorpa(stavke);

  const { data, error } = await supabase
    .from("porudzbine")
    .insert({
      email: polja.email,
      drzava: polja.drzava,
      ime: polja.ime,
      prezime: polja.prezime,
      pib: polja.pib || null,
      adresa: polja.adresa,
      postanski_broj: polja.postanskiBroj,
      grad: polja.grad,
      telefon: polja.telefon,
      stavke,
      ukupna_cena_rsd: ukupnaCena,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Upis porudžbine u bazu nije uspeo:", error);
    return NextResponse.json({ greske: { opsta: "Greška na serveru, pokušajte ponovo." } }, { status: 500 });
  }

  // Oba mejla se šalju paralelno — svaki hvata svoju grešku interno (vidi
  // resend.ts), pa jedan koji ne uspe ne utiče na drugi ni na uspeh ovog
  // odgovora (baza je već upisana iznad, to je izvor istine).
  await Promise.all([
    posaljiObavestenjeVlasniku({ ...polja, stavke, ukupnaCena }),
    posaljiPotvrduKupcu({ ...polja, stavke, ukupnaCena }),
  ]);

  return NextResponse.json({ id: data.id, ukupnaCena });
}

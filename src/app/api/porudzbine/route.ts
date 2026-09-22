import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { posaljiObavestenjeVlasniku, posaljiPotvrduKupcu } from "@/lib/resend";
import { ukupnoKorpa } from "@/lib/cene";
import { dozvoljeno } from "@/lib/ogranicenje";
import {
  validirajPorudzbinu,
  validirajStavku,
  validirajUkupnuKolicinu,
  jeIspravanPlaceId,
  type Boja,
  type Velicina,
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
  stavke?: {
    boja?: string;
    velicina?: string;
    kolicina?: number;
    nazivBiznisa?: string;
    googlePlaceId?: string;
  }[];
  // Honeypot — pravi korisnici ga nikad ne popune (vizuelno je van ekrana).
  web?: string;
};

const MAX_TELO_BAJTOVA = 20_000;
// Više od ovoliko VAŽEĆIH porudžbina sa iste IP adrese u prozoru — odbija se
// (vidi ogranicenje.ts za ograničenja ove zaštite).
const MAX_PORUDZBINA_PO_IP = 5;
// Šira granica za sve zahteve (i neispravne) — običan korisnik sa greškama u
// formi nikad ne dolazi blizu, a skripta koja bombarduje rutu staje.
const MAX_ZAHTEVA_PO_IP = 30;
const PROZOR_MS = 10 * 60 * 1000;

function ipAdresa(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "nepoznato"
  );
}

export async function POST(req: Request) {
  // Samo zahtevi sa NAŠEG sajta: browser uz POST uvek šalje Origin, pa
  // tuđa stranica (ili forma na drugom domenu) ne može da nas natera da
  // pravimo porudžbine u ime posetioca. Zahtevi bez Origin-a (curl, skripte)
  // prolaze, ali su ograničeni po IP adresi ispod.
  const origin = req.headers.get("origin");
  if (origin) {
    let isti = false;
    try {
      isti = new URL(origin).host === req.headers.get("host");
    } catch {
      isti = false;
    }
    if (!isti) return NextResponse.json({ greske: { opsta: "Zahtev nije dozvoljen." } }, { status: 403 });
  }
  if (req.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ greske: { opsta: "Zahtev nije dozvoljen." } }, { status: 403 });
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ greske: { opsta: "Neispravan zahtev." } }, { status: 415 });
  }

  if (!dozvoljeno(`zahtev:${ipAdresa(req)}`, MAX_ZAHTEVA_PO_IP, PROZOR_MS)) {
    return NextResponse.json(
      { greske: { opsta: "Previše pokušaja. Pokušajte ponovo za nekoliko minuta." } },
      { status: 429 },
    );
  }

  let telo: Telo;
  try {
    const tekst = await req.text();
    if (tekst.length > MAX_TELO_BAJTOVA) {
      return NextResponse.json({ greske: { opsta: "Zahtev je prevelik." } }, { status: 413 });
    }
    telo = JSON.parse(tekst);
  } catch {
    return NextResponse.json({ greske: { opsta: "Neispravan zahtev." } }, { status: 400 });
  }
  if (!telo || typeof telo !== "object" || Array.isArray(telo)) {
    return NextResponse.json({ greske: { opsta: "Neispravan zahtev." } }, { status: 400 });
  }

  // Honeypot upalio — tiho vrati uspeh bez upisa, da bot ne zna da je uhvaćen.
  if (telo.web) {
    return NextResponse.json({ id: "ok", ukupnaCena: 0 });
  }

  // Više od 10 stavki nikad nema smisla (ukupno je ograničeno na 25 komada).
  if (!Array.isArray(telo.stavke) || telo.stavke.length > 10) {
    return NextResponse.json({ greske: { opsta: "Neispravna korpa." } }, { status: 400 });
  }
  const stavke = telo.stavke.map((s) => ({
    boja: (s.boja === "crna" ? "crna" : "bela") as Boja,
    // Podrazumevano "veci" za bilo šta osim tačno "manji" — isti obrazac
    // kao boja iznad, štiti od neispravne/nedostajuće vrednosti sa klijenta.
    velicina: (s.velicina === "manji" ? "manji" : "veci") as Velicina,
    kolicina: Number(s.kolicina),
    nazivBiznisa: String(s.nazivBiznisa ?? ""),
    // Place ID se čuva samo ako ima oblik pravog ID-a (nikad slobodan tekst).
    ...(s.googlePlaceId && jeIspravanPlaceId(String(s.googlePlaceId))
      ? { googlePlaceId: String(s.googlePlaceId) }
      : {}),
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

  // Stroža granica tek za VAŽEĆE porudžbine (pre upisa i slanja mejlova) —
  // greške u formi se ne kažnjavaju, ali se ne mogu napraviti stotine
  // porudžbina/mejlova sa jedne adrese.
  if (!dozvoljeno(`porudzbina:${ipAdresa(req)}`, MAX_PORUDZBINA_PO_IP, PROZOR_MS)) {
    return NextResponse.json(
      { greske: { opsta: "Previše porudžbina sa iste adrese. Pokušajte ponovo za nekoliko minuta." } },
      { status: 429 },
    );
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

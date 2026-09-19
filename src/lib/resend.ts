import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";
import { esc } from "@/lib/html";
import { formatRSD, kolicinaSlovima } from "@/lib/cene";
import type { Porudzbina } from "@/lib/validacijaPorudzbine";

const resend = new Resend(process.env.RESEND_API_KEY);

// "onboarding@resend.dev" radi bez sopstvenog verifikovanog domena — zameniti
// kad dajpeticu.rs bude registrovan i verifikovan u Resend-u.
const POSILJALAC = "Daj Peticu <onboarding@resend.dev>";

function stavkeHtml(stavke: Porudzbina["stavke"]): string {
  return stavke
    .map(
      (s) =>
        `<li>${kolicinaSlovima(s.kolicina)} (${s.boja === "crna" ? "crni" : "beli"}) — ${esc(s.nazivBiznisa)}</li>`,
    )
    .join("");
}

export async function posaljiObavestenjeVlasniku(porudzbina: Porudzbina & { ukupnaCena: number }) {
  const html = `
    <h2>Nova porudžbina</h2>
    <p><strong>${esc(porudzbina.ime)} ${esc(porudzbina.prezime)}</strong> — ${esc(porudzbina.telefon)} — ${esc(porudzbina.email)}</p>
    <p>${esc(porudzbina.adresa)}, ${esc(porudzbina.postanskiBroj)} ${esc(porudzbina.grad)}, ${esc(porudzbina.drzava)}</p>
    ${porudzbina.pib ? `<p>PIB: ${esc(porudzbina.pib)}</p>` : ""}
    <ul>${stavkeHtml(porudzbina.stavke)}</ul>
    <p><strong>Ukupno: ${formatRSD(porudzbina.ukupnaCena)}</strong></p>
  `;

  // Greška u slanju se loguje, ali se ne baca dalje — porudžbina je već
  // upisana u bazu pre poziva ove funkcije, pa je uspešna bez obzira na
  // ishod mejla (baza je izvor istine, mejl je samo obaveštenje).
  try {
    await resend.emails.send({
      from: POSILJALAC,
      to: site.email,
      subject: `Nova porudžbina — ${kolicinaSlovima(porudzbina.stavke.reduce((z, s) => z + s.kolicina, 0))}`,
      html,
    });
  } catch (greska) {
    console.error("Slanje mejla o porudžbini nije uspelo:", greska);
  }
}

// Potvrda kupcu — odvojena od gornjeg obaveštenja vlasniku (drugi primalac,
// drugačiji ton: kupcu se ne šalje njegov sopstveni telefon/email nazad,
// samo pregled onoga što je poručio). NAPOMENA: dok se dajpeticu.rs ne
// verifikuje u Resend-u, "onboarding@resend.dev" pošiljalac po Resend-ovim
// pravilima sme da šalje SAMO na email vlasnika naloga — mejl kupcu će
// tiho propasti (uhvaćeno ispod, samo logovano) za bilo koju drugu adresu
// dok verifikacija ne bude gotova.
export async function posaljiPotvrduKupcu(porudzbina: Porudzbina & { ukupnaCena: number }) {
  const html = `
    <h2>Hvala na porudžbini, ${esc(porudzbina.ime)}!</h2>
    <p>Primili smo vašu porudžbinu. Zovemo vas na ${esc(porudzbina.telefon)} da potvrdimo adresu i link vaše
    Google strane.</p>
    <ul>${stavkeHtml(porudzbina.stavke)}</ul>
    <p><strong>Ukupno: ${formatRSD(porudzbina.ukupnaCena)}</strong> — plaćate pouzećem.</p>
    <p>Dostava na: ${esc(porudzbina.adresa)}, ${esc(porudzbina.postanskiBroj)} ${esc(porudzbina.grad)}, ${esc(porudzbina.drzava)}</p>
    <p>Pitanja? Javite nam se na ${site.email}.</p>
  `;

  try {
    await resend.emails.send({
      from: POSILJALAC,
      to: porudzbina.email,
      subject: "Vaša porudžbina je primljena — Daj Peticu",
      html,
    });
  } catch (greska) {
    console.error("Slanje potvrde kupcu nije uspelo:", greska);
  }
}

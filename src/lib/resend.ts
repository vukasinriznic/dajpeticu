import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";
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
        `<li>${kolicinaSlovima(s.kolicina)} (${s.boja === "crna" ? "crni" : "beli"}) — ${s.nazivBiznisa}</li>`,
    )
    .join("");
}

export async function posaljiObavestenjeVlasniku(porudzbina: Porudzbina & { ukupnaCena: number }) {
  const html = `
    <h2>Nova porudžbina</h2>
    <p><strong>${porudzbina.ime} ${porudzbina.prezime}</strong> — ${porudzbina.telefon} — ${porudzbina.email}</p>
    <p>${porudzbina.adresa}, ${porudzbina.postanskiBroj} ${porudzbina.grad}, ${porudzbina.drzava}</p>
    ${porudzbina.pib ? `<p>PIB: ${porudzbina.pib}</p>` : ""}
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

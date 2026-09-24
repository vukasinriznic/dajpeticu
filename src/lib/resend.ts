import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";
import { esc } from "@/lib/html";
import { formatRSD, kolicinaSlovima } from "@/lib/cene";
import type { Porudzbina } from "@/lib/validacijaPorudzbine";

const resend = new Resend(process.env.RESEND_API_KEY);

// dajpeticu.shop je verifikovan u Resend-u (24.09.2026.). Ovo sanduče ne
// prima mejlove (nema Enable Receiving), pa svaki mejl nosi replyTo na
// pravu adresu (site.email) — odgovor kupca ili vlasnika ne sme da nestane.
const POSILJALAC = "Daj Peticu <porudzbine@dajpeticu.shop>";

// Mejl klijenti ne znaju moderni CSS (flex, grid, promenljive) — zato
// tabele i inline stilovi. Slike su male PNG kopije iz public/email/
// (originali su ~1 MB, a WebP ne prikazuje Outlook), gledaju se preko
// apsolutnog URL-a jer relativna putanja u mejlu ne postoji.
const SLIKE = `${site.url}/email`;
// Gmail kešira slike (i neuspešna preuzimanja) po URL-u — povećati broj kad
// se neka slika u public/email/ promeni ili je jednom bila nedostupna.
const VER = "?v=3";
const FONT = "Arial, Helvetica, sans-serif";

function slikaStalka(velicina: string, boja: string): string {
  return `${SLIKE}/stalak-${velicina === "manji" ? "manji" : "veci"}-${boja === "crna" ? "crna" : "bela"}.png${VER}`;
}

function stavkeHtml(stavke: Porudzbina["stavke"]): string {
  return stavke
    .map(
      (s) => `
      <tr>
        <td width="84" valign="top" style="padding:10px 16px 10px 0;">
          <img src="${slikaStalka(s.velicina, s.boja)}" width="72" height="119" alt="" style="display:block;width:72px;height:119px;border:0;">
        </td>
        <td valign="middle" style="padding:10px 0;font-family:${FONT};font-size:15px;line-height:1.5;color:#15171c;">
          <strong>${kolicinaSlovima(s.kolicina)}</strong><br>
          ${s.velicina === "manji" ? "Manji" : "Veći"} stalak, ${s.boja === "crna" ? "crni" : "beli"}<br>
          <span style="color:#5f6672;">Za biznis: ${esc(s.nazivBiznisa)}</span>
        </td>
      </tr>`,
    )
    .join("");
}

function ukupnoHtml(ukupnaCena: number, napomena: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;border-top:1px solid #f1e3b8;">
      <tr>
        <td style="padding-top:16px;font-family:${FONT};font-size:15px;color:#15171c;">Ukupno${napomena}</td>
        <td align="right" style="padding-top:16px;font-family:${FONT};font-size:22px;font-weight:bold;color:#b57f00;">${formatRSD(ukupnaCena)}</td>
      </tr>
    </table>`;
}

// Zajednički okvir za oba mejla: logo iznad, bela kartica sa zlatnim
// okvirom, sitan podnožje. Pozadina je svetla (ne tamnozelena) da se logo
// vidi i kad klijent (Gmail tamni režim) prepravi boje.
function okvirMejla(naslov: string, telo: string): string {
  return `<!doctype html>
<html lang="sr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(naslov)}</title></head>
<body style="margin:0;padding:0;background:#eef3f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f0;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="${SLIKE}/logo.png${VER}" width="72" height="72" alt="Daj Peticu" style="display:block;width:72px;height:72px;border:0;">
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:2px solid #ffc53d;border-radius:16px;padding:32px 28px;font-family:${FONT};font-size:15px;line-height:1.6;color:#15171c;">
              <h1 style="margin:0 0 16px;font-family:${FONT};font-size:22px;line-height:1.3;color:#15171c;">${esc(naslov)}</h1>
              ${telo}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:20px;font-family:${FONT};font-size:12px;line-height:1.5;color:#5f6672;">
              Daj Peticu · <a href="${site.url}" style="color:#5f6672;">${site.url.replace("https://", "")}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function posaljiObavestenjeVlasniku(porudzbina: Porudzbina & { ukupnaCena: number }) {
  const html = okvirMejla(
    "Nova porudžbina",
    `
    <p style="margin:0 0 4px;"><strong>${esc(porudzbina.ime)} ${esc(porudzbina.prezime)}</strong></p>
    <p style="margin:0 0 4px;">Telefon: ${esc(porudzbina.telefon)}</p>
    <p style="margin:0 0 4px;">Email: ${esc(porudzbina.email)}</p>
    <p style="margin:0 0 4px;">${esc(porudzbina.adresa)}, ${esc(porudzbina.postanskiBroj)} ${esc(porudzbina.grad)}, ${esc(porudzbina.drzava)}</p>
    ${porudzbina.pib ? `<p style="margin:0 0 4px;">PIB: ${esc(porudzbina.pib)}</p>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${stavkeHtml(porudzbina.stavke)}</table>
    ${ukupnoHtml(porudzbina.ukupnaCena, "")}
  `,
  );

  // Greška u slanju se loguje, ali se ne baca dalje — porudžbina je već
  // upisana u bazu pre poziva ove funkcije, pa je uspešna bez obzira na
  // ishod mejla (baza je izvor istine, mejl je samo obaveštenje).
  try {
    await resend.emails.send({
      from: POSILJALAC,
      to: site.email,
      replyTo: porudzbina.email,
      subject: `Nova porudžbina — ${kolicinaSlovima(porudzbina.stavke.reduce((z, s) => z + s.kolicina, 0))}`,
      html,
    });
  } catch (greska) {
    console.error("Slanje mejla o porudžbini nije uspelo:", greska);
  }
}

// Potvrda kupcu — odvojena od gornjeg obaveštenja vlasniku (drugi primalac,
// drugačiji ton: kupcu se ne šalje njegov sopstveni telefon/email nazad,
// samo pregled onoga što je poručio).
export async function posaljiPotvrduKupcu(porudzbina: Porudzbina & { ukupnaCena: number }) {
  const html = okvirMejla(
    `Hvala na porudžbini, ${porudzbina.ime}!`,
    `
    <p style="margin:0 0 16px;">Primili smo vašu porudžbinu. Zovemo vas na <strong>${esc(porudzbina.telefon)}</strong> da potvrdimo adresu i link vaše Google strane.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stavkeHtml(porudzbina.stavke)}</table>
    ${ukupnoHtml(porudzbina.ukupnaCena, " (plaćate pouzećem)")}
    <p style="margin:20px 0 4px;color:#5f6672;font-size:13px;">Dostava na:</p>
    <p style="margin:0 0 16px;">${esc(porudzbina.adresa)}, ${esc(porudzbina.postanskiBroj)} ${esc(porudzbina.grad)}, ${esc(porudzbina.drzava)}</p>
    <p style="margin:0;color:#5f6672;font-size:13px;">Pitanja? Javite nam se na <a href="mailto:${site.email}" style="color:#b57f00;">${site.email}</a>.</p>
  `,
  );

  try {
    await resend.emails.send({
      from: POSILJALAC,
      to: porudzbina.email,
      replyTo: site.email,
      subject: "Vaša porudžbina je primljena — Daj Peticu",
      html,
    });
  } catch (greska) {
    console.error("Slanje potvrde kupcu nije uspelo:", greska);
  }
}

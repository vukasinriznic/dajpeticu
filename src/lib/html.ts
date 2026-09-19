// Escape korisničkog teksta pre ubacivanja u HTML mejla — bez ovoga bi ime,
// adresa ili naziv biznisa sa <a href=...> ili <script> završili kao živ HTML
// u mejlu vlasniku (phishing/lažni linkovi) i u mejlu koji ide kupcu.
export function esc(tekst: string): string {
  return tekst
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

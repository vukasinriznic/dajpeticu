// Kontakt i brend konstante. Telefon, mejl i Instagram su pravi. `url` je
// glavna adresa sajta (SEO: canonical, sitemap, Open Graph). Domen
// dajpeticu.shop je povezan sa Vercel-om 24.09.2026. sa "www" kao glavnom
// adresom (Vercel preusmerava bez-www na www) — zato je ovde "www", inače bi
// canonical/sitemap pokazivali na adresu koja se preusmerava. Mejl ostaje na
// golom domenu (dajpeticu.shop), to nema veze sa www.
export const site = {
  naziv: "Daj Peticu",
  url: "https://www.dajpeticu.shop",
  opis:
    "NFC stalak koji lokalnom biznisu donosi više Google recenzija. Jedan tap telefonom i mušterija je ostavila peticu, bez aplikacije, bez pretplate.",
  telefon: "+381 65 533 9481",
  telefonHref: "tel:+381655339481",
  email: "dajpeticu.shop@gmail.com",
  instagramNaziv: "dajpeticu",
  instagram: "https://instagram.com/dajpeticu",
};

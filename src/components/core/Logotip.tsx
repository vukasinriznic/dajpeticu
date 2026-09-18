import Link from "next/link";

// Samo zvezda-i-5 ikonica (public/images/logo_zelena.svg), bez "Daj" teksta — uvek
// zelena varijanta, i na tamnoj pozadini, jer bela (public/logo_bela.svg)
// slabo kontrastira na tamnozelenom footeru/header-u.
export function Logotip({
  kontekst = "header",
  className = "",
}: {
  kontekst?: "header" | "footer" | "hero";
  className?: string;
}) {
  const visina = { header: 48, footer: 56, hero: 76 }[kontekst];

  return (
    // href="/" (ne "#top") — logo mora da vrati na početnu i sa drugih
    // strana (uslovi/garancija/privatnost/korpa), gde element id="top" ne
    // postoji.
    <Link href="/" aria-label="Daj Peticu" className={`inline-flex items-center no-underline ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- fiksan asset, next/image nepotrebno na ovoj veličini */}
      <img src="/images/logo_zelena.svg" alt="" width={visina} height={visina} style={{ height: visina, width: visina }} />
    </Link>
  );
}

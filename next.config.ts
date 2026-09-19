import type { NextConfig } from "next";

// Bezbednosna zaglavlja za sve rute. CSP je namerno SAMO bezbedni podskup
// (ne script-src): Next ubacuje inline skripte, a Google Maps/Analytics će
// kasnije dodati spoljne domene — pun script-src bez nonce-a bi ili slomio
// sajt ili bio bezvredan ('unsafe-inline'). Ovaj podskup ne lomi ništa, a
// zatvara clickjacking, <base>/<object> i slanje formi na tuđe adrese.
const BEZBEDNOSNA_ZAGLAVLJA = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Ne otkriva "X-Powered-By: Next.js" — sitna stvar, ali nema razloga da se objavljuje.
  poweredByHeader: false,
  images: {
    // 80 — hero pozadina (white_bg.jpg); 90 — kartica (QR kod i sitan tekst
    // trebaju oštrinu). Next inače dozvoljava samo podrazumevanih 75.
    qualities: [75, 80, 90],
  },
  async headers() {
    return [{ source: "/:path*", headers: BEZBEDNOSNA_ZAGLAVLJA }];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 80 — hero pozadina (white_bg.jpg); 90 — kartica (QR kod i sitan tekst
    // trebaju oštrinu). Next inače dozvoljava samo podrazumevanih 75.
    qualities: [75, 80, 90],
  },
};

export default nextConfig;

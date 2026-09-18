import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Daj Peticu — NFC stalak za Google recenzije";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tekst je namerno bez č/ć/š/ž/đ — Satori (motor iza ImageResponse) bez
// eksplicitno učitanog fonta ume da izostavi ta slova, a preuzimanje pravog
// Google Fonts TTF fajla ovde bi uvelo mrežnu zavisnost o build/request
// vreme (ovo sandbox okruženje je već pokazalo isprekidan pristup
// fonts.googleapis.com — vidi dev log upozorenja). Sav brend tekst na
// sajtu srećom ima i verziju bez dijakritika koja i dalje zvuči prirodno.
export default async function Image() {
  const logo = await readFile(join(process.cwd(), "src/app/apple-icon.png"), "base64");
  const logoSrc = `data:image/png;base64,${logo}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#0b2e20",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) ne podržava next/image */}
        <img src={logoSrc} width={140} height={140} alt="" />
        <div style={{ fontSize: 72, fontWeight: 700, color: "#ffffff", display: "flex" }}>
          Daj Peticu
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, color: "#ffc53d", display: "flex" }}>
          Jedan tap. Pet zvezdica.
        </div>
        <div style={{ fontSize: 28, color: "rgb(191,227,208)", display: "flex" }}>
          NFC stalak za Google recenzije
        </div>
      </div>
    ),
    { ...size },
  );
}

"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";

const MAX_NAGIB = 14; // maksimalni ugao nagiba u stepenima

// Omotač ostaje kvadratan (isto kao pre, ostatak layout-a — hero visina,
// razmak od nava — je uštelovan oko te pretpostavke). Slika je uža od
// kvadrata (734×1207, uspravna kartica na stalku), pa je centriramo unutar
// kvadrata preko UNUTRAŠNJEG diva tačno tog razmera (RAZMER_SLIKE), umesto
// da se oslonimo na object-contain — to je i razlog: object-contain unutar
// kvadratne slike + filter:drop-shadow na <img> u nekim browserima crta
// senku po celoj kvadratnoj kutiji umesto po stvarnoj providnoj konturi
// ("kvadratna" senka na hover-u). Kad senku stavimo na unutrašnji div koji
// tačno prati oblik slike, taj bag nestaje.
const RAZMER_SLIKE_PODRAZUMEVANO = "848 / 1401";
// Stvarna silueta kartice, preračunata u procente KVADRATNOG omotača (ne
// unutrašnjeg diva) — providne margine oko kartice ne smeju da okidaju
// hover, inače efekat deluje kao da reaguje "daleko" od same kartice.
const OKVIR = { levo: 23.23, desno: 23.3, gore: 5.85, dole: 5.92 };
const SIRINA_KARTICE = 100 - OKVIR.levo - OKVIR.desno;
const VISINA_KARTICE = 100 - OKVIR.gore - OKVIR.dole;

// Kartica se nagiba prema pokazivaču, sa senkom koja prati nagib, blagim
// sjajem koji putuje preko površine na hover, i tihim "disanjem" u mirovanju
// dok je niko ne dodiruje (sve isključeno kad interaktivna=false ili kad
// posetilac traži manje animacija). Hover reaguje samo unutar OKVIR-a
// (stvarne kartice), ne cele slike. Fotografija je prava,
// odštampana kartica (public/images/stalak_beli.webp); nema zadnje strane pa nema
// flip-a kao ranije.
export function Kartica3D({
  sirina = 320,
  interaktivna = true,
  className = "",
  slika = "/images/stalak_beli.webp",
  razmerSlike = RAZMER_SLIKE_PODRAZUMEVANO,
}: {
  sirina?: number;
  interaktivna?: boolean;
  className?: string;
  slika?: string;
  razmerSlike?: string;
}) {
  const [nagib, setNagib] = useState({ x: 0, y: 0 });
  const [kursor, setKursor] = useState({ px: 0.5, py: 0.5 });
  const [uHoveru, setUHoveru] = useState(false);
  const hitboxRef = useRef<HTMLDivElement>(null);

  const naPomeraj = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = hitboxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setKursor({ px, py });
    setNagib({ x: -(py - 0.5) * MAX_NAGIB, y: (px - 0.5) * MAX_NAGIB });
  };
  const naUlazak = () => setUHoveru(true);
  const naIzlazak = () => {
    setUHoveru(false);
    setNagib({ x: 0, y: 0 });
  };

  // Senka se pomera suprotno od nagiba — deluje kao da se kartica stvarno
  // odiže sa podloge, a ne samo rotira u mestu.
  const senka = `drop-shadow(${(-nagib.y * 1.6).toFixed(1)}px ${(18 - nagib.x * 1.2).toFixed(1)}px ${uHoveru ? 26 : 16}px rgb(9 38 27 / ${uHoveru ? 0.4 : 0.22}))`;

  // Pozicija sjaja preračunata iz "unutar kartice" (0-1) u "unutar cele
  // kvadratne slike" (%) — sjaj mora vizuelno da bude tačno pod kursorom.
  const punoPx = OKVIR.levo + kursor.px * SIRINA_KARTICE;
  const punoPy = OKVIR.gore + kursor.py * VISINA_KARTICE;

  return (
    <div
      className={`select-none ${className}`}
      style={{
        width: sirina,
        perspective: 1400,
        animation: interaktivna && !uHoveru ? "dp-kartica-disanje 6s ease-in-out infinite" : "none",
      }}
    >
      <div
        role="img"
        aria-label="Stalak Daj Peticu"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotateX(${nagib.x}deg) rotateY(${nagib.y}deg) scale(${uHoveru ? 1.045 : 1})`,
          transition: "transform 300ms cubic-bezier(.2,.7,.3,1)",
        }}
      >
        {/* Ovaj div je tačno oblika slike (ne kvadrata) — senka ide na njega,
            ne na ceo kvadratni omotač, da filter prati stvarnu konturu
            kartice (vidi napomenu uz RAZMER_SLIKE gore). */}
        <div
          style={{
            position: "relative",
            height: "100%",
            aspectRatio: razmerSlike,
            filter: interaktivna ? senka : undefined,
            transition: "filter 300ms ease",
          }}
        >
          <Image
            src={slika}
            alt="Daj Peticu NFC stalak"
            fill
            sizes={`${sirina}px`}
            quality={90}
            priority={interaktivna}
            className="pointer-events-none object-contain"
          />
        </div>
        {interaktivna && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: uHoveru ? 1 : 0,
              background: `radial-gradient(circle at ${punoPx.toFixed(1)}% ${punoPy.toFixed(1)}%, rgb(255 255 255 / 0.55), transparent 45%)`,
              mixBlendMode: "soft-light",
              // Sjaj mora da prati siluetu kartice, ne ceo (providni)
              // okvir slike — bez ove maske izgleda kao pravougaona
              // kutija oko kartice na hover.
              WebkitMaskImage: `url(${slika})`,
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              maskImage: `url(${slika})`,
              maskSize: "contain",
              maskPosition: "center",
              maskRepeat: "no-repeat",
            }}
          />
        )}
        {interaktivna && (
          <div
            ref={hitboxRef}
            onPointerMove={naPomeraj}
            onPointerEnter={naUlazak}
            onPointerLeave={naIzlazak}
            style={{
              position: "absolute",
              left: `${OKVIR.levo}%`,
              right: `${OKVIR.desno}%`,
              top: `${OKVIR.gore}%`,
              bottom: `${OKVIR.dole}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}

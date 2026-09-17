"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Generički "otkrij pri skrolu" omotač — jednom kad element uđe u vidno
// polje, blago se podigne i pojavi (fade + translateY), pa ostaje vidljiv
// (ne nestaje ako se korisnik vrati skrolom nagore). IntersectionObserver
// se prekida posle prvog okidanja (posmatrac.disconnect()) — nema razloga
// da nastavi da posmatra element koji se već pokazao.
// prefers-reduced-motion: sadržaj se odmah prikazuje, bez ikakve animacije
// ili posmatrača.
export function UNaVidiku({
  children,
  className = "",
  kasnjenje = 0,
  rastegni = false,
}: {
  children: ReactNode;
  className?: string;
  // ms — za stepenasti (staggered) ulazak više elemenata u nizu/mreži.
  kasnjenje?: number;
  // Ovaj <div> omotač ume da "prekine" grid items-stretch (npr. kartice u
  // Cenovnik.tsx/Utisak-u) — bez njega bi omotač dobio punu visinu reda, ali
  // njegovo dete (kartica) bi i dalje bilo visine svog sadržaja, pa kartice
  // u istom redu ne bi bile jednake visine. rastegni prosleđuje tu visinu
  // dalje na jedino dete (flex-1 na detetu, wrapper kao flex kolona).
  rastegni?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vidljivo, setVidljivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVidljivo(true);
      return;
    }
    const posmatrac = new IntersectionObserver(
      ([unos]) => {
        if (unos.isIntersecting) {
          setVidljivo(true);
          posmatrac.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" },
    );
    posmatrac.observe(el);
    return () => posmatrac.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(.2,.7,.3,1)] ${
        vidljivo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${rastegni ? "flex h-full flex-col [&>*]:flex-1" : ""} ${className}`}
      style={kasnjenje ? { transitionDelay: `${kasnjenje}ms` } : undefined}
    >
      {children}
    </div>
  );
}

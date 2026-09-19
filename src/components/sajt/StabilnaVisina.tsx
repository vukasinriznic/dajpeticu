"use client";

import { useEffect } from "react";

// Postavlja CSS promenljivu --vh (px) na NAJMANJU visinu ekrana viđenu dok se
// širina ne menja. In-app browseri (Instagram/Facebook) uvlače i izvlače svoju
// traku dok se skroluje, pa se visina prozora stalno menja — sve što se oslanja
// na vh/svh/dvh (hero, sticky "Kako radi") bi se tada preračunavalo usred
// skrola, pomeralo stranicu i pokretalo korake same od sebe. Ovako se visina
// vezuje za najmanju vrednost i ostaje mirna; menja se tek pri rotaciji ekrana
// (promena širine). Obični browseri: ista vrednost kao i ranije za sve praktične
// svrhe (razlika je samo par piksela).
export function StabilnaVisina() {
  useEffect(() => {
    const koren = document.documentElement.style;
    let sirina = window.innerWidth;
    let visina = window.innerHeight;
    const postavi = () => koren.setProperty("--vh", `${visina}px`);
    postavi();
    const naPromenu = () => {
      if (window.innerWidth !== sirina) {
        sirina = window.innerWidth;
        visina = window.innerHeight;
      } else {
        visina = Math.min(visina, window.innerHeight);
      }
      postavi();
    };
    window.addEventListener("resize", naPromenu);
    return () => window.removeEventListener("resize", naPromenu);
  }, []);
  return null;
}

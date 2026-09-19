"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Native <dialog> — ugrađen focus trap, ::backdrop (stil u globals.css),
// zatvaranje na Escape, showModal()/close(). Bez ijedne nove zavisnosti,
// isti duh kao ostatak sajta (ručni scroll+rAF umesto biblioteke).
export function Modal({
  open,
  onClose,
  children,
  variant = "fullscreen",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  // "fullscreen" — DodajUKorpuPopup (fade+scale, vidi globals.css). "drawer"
  // — korpa (KorpaDrawer.tsx), panel usidren desno, 1/3 širine ekrana,
  // uleće sa strane (slide, vidi dialog.korpa-drawer u globals.css).
  variant?: "fullscreen" | "drawer";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // Ručno tempirano zatvaranje (19.09.2026.) — pravi dialog.close() se
  // odlaže 260ms (malo preko 240ms CSS trajanja) dok ".zatvara-se" klasa
  // (globals.css) vizuelno vrati opacity/transform/blur na "zatvoreno"
  // stanje kroz OBIČNU tranziciju. Bez ovoga smo se oslanjali isključivo
  // na allow-discrete (novija CSS mogućnost) za izlaznu animaciju — na
  // korisnikovom telefonu se blur uopšte nije povlačio pri zatvaranju.
  const [zatvaranje, setZatvaranje] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      setZatvaranje(false);
      if (!dialog.open) dialog.showModal();
      return;
    }
    if (dialog.open) {
      setZatvaranje(true);
      const t = setTimeout(() => {
        dialog.close();
        setZatvaranje(false);
      }, 260);
      return () => clearTimeout(t);
    }
  }, [open]);

  // <dialog> sam po sebi ne garantuje da se pozadina ne skroluje u svim
  // browserima — zaključavamo je ručno dok je modal otvoren.
  useEffect(() => {
    if (!open) return;
    // iOS Safari ignoriše overflow:hidden na body — kad se otvori tastatura,
    // stranica se ispod dialoga i dalje može pomeriti i "provirivati" iza
    // tastature. position:fixed na body ukida svaki skrolabilni prostor
    // dokumenta; scroll pozicija se pamti i vraća pri zatvaranju.
    const y = window.scrollY;
    const st = document.body.style;
    const prethodno = { overflow: st.overflow, position: st.position, top: st.top, width: st.width };
    st.overflow = "hidden";
    st.position = "fixed";
    st.top = `-${y}px`;
    st.width = "100%";
    return () => {
      st.overflow = prethodno.overflow;
      st.position = prethodno.position;
      st.top = prethodno.top;
      st.width = prethodno.width;
      window.scrollTo(0, y);
    };
  }, [open]);

  // Dialog prati VIDLJIVI deo ekrana (iznad tastature): na iOS-u tastatura ne
  // menja layout viewport, pa 100dvh ostaje pun ekran i sadržaj završi iza
  // tastature. Visina se postavlja na visualViewport.height (fullscreen).
  useEffect(() => {
    if (!open || variant !== "fullscreen") return;
    const vv = window.visualViewport;
    const dialog = ref.current;
    if (!vv || !dialog) return;
    const podesi = () => {
      dialog.style.height = `${vv.height}px`;
      dialog.style.maxHeight = `${vv.height}px`;
      dialog.style.top = `${vv.offsetTop}px`;
    };
    podesi();
    vv.addEventListener("resize", podesi);
    vv.addEventListener("scroll", podesi);
    return () => {
      vv.removeEventListener("resize", podesi);
      vv.removeEventListener("scroll", podesi);
      dialog.style.height = "";
      dialog.style.maxHeight = "";
      dialog.style.top = "";
    };
  }, [open, variant]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Klik na sam <dialog> element (ne na decu unutra) = klik na ::backdrop.
        if (e.target === ref.current) onClose();
      }}
      // [color-scheme:dark] — oba sadržaja (DodajUKorpuPopup, KorpaDrawer)
      // imaju tamnozelenu pozadinu; bez ovoga browser i dalje crta scrollbar
      // (i ostale native kontrole) u svetloj temi jer ne zna da je sadržaj
      // tamniji, pa scrollbar deluje "belo" umesto da prati temu kao na
      // ostatku sajta.
      className={
        (variant === "drawer"
          ? // h-[100dvh] na mobilnom (19.09.2026., eksplicitno traženo) — h-screen
            // (100vh) je na mobilnim browserima poznato nepouzdan (ne prati
            // sklapanje/širenje adresne trake, ostavlja prazan prostor ili
            // izaziva skrol); dvh je dinamički i stvarno prati vidljivi
            // ekran. sm: vraća originalni h-screen za desktop (gde je
            // ionako identičan, adresna traka se ne pomera). Zlatni levi
            // border UKLONJEN na mobilnom (border-l-0), vraćen na sm+.
            "korpa-drawer fixed inset-y-0 left-auto right-0 m-0 h-[100dvh] max-h-screen w-full border-l-0 sm:h-screen sm:w-[37vw] sm:min-w-[460px] sm:border-l sm:border-l-[var(--color-gold)] max-w-none overflow-y-auto rounded-none border-0 bg-white p-0 [color-scheme:dark]"
          : // !transform-none — samo fade (bez scale) za fullscreen popup: transform
            // na position:fixed elementu na iOS Safari-ju kvari skrol i pomeranje
            // pri otvaranju tastature (fokus na "Naziv biznisa").
            "!transform-none fixed inset-0 m-0 h-[100dvh] max-h-[100dvh] w-screen max-w-none overflow-y-auto overscroll-contain rounded-none border-0 bg-[var(--color-bg-inverse)] p-0 backdrop:!bg-[var(--color-bg-inverse)] backdrop:!backdrop-blur-none [color-scheme:dark]") +
        (zatvaranje ? " zatvara-se" : "")
      }
    >
      {children}
    </dialog>
  );
}

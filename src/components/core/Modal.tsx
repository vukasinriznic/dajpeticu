"use client";

import { useEffect, useRef, type ReactNode } from "react";

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

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // <dialog> sam po sebi ne garantuje da se pozadina ne skroluje u svim
  // browserima — zaključavamo je ručno dok je modal otvoren.
  useEffect(() => {
    if (!open) return;
    const prethodni = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prethodni;
    };
  }, [open]);

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
        variant === "drawer"
          ? "korpa-drawer fixed inset-y-0 left-auto right-0 m-0 h-screen max-h-screen w-full sm:w-[37vw] sm:min-w-[460px] max-w-none overflow-y-auto rounded-none border-0 border-l border-l-[var(--color-gold)] bg-white p-0 [color-scheme:dark]"
          : "fixed inset-0 m-0 h-screen max-h-screen w-screen max-w-none overflow-y-auto rounded-none border-0 bg-white p-0 [color-scheme:dark]"
      }
    >
      {children}
    </dialog>
  );
}

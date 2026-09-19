"use client";

import Script from "next/script";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Dugme } from "@/components/core/Dugme";
import { GA_ID, citajPristanak, postaviPristanak, pretplatiNaPristanak } from "@/lib/analitika";

// GA4 sa Consent Mode: kolačići za analitiku su podrazumevano ODBIJENI
// (analytics_storage: denied) dok korisnik ne prihvati u banneru; izbor se
// pamti u localStorage-u. Bez NEXT_PUBLIC_GA_ID komponenta ne renderuje ništa
// (nema skripti ni banera).
export function Analitika() {
  const pristanak = useSyncExternalStore(pretplatiNaPristanak, citajPristanak, () => "ne" as const);
  // Na serveru/pri hidraciji "ne" → banner se ne vidi dok klijent ne pročita
  // stvarni izbor; zato banner traži null (nije birano) posle mount-a.
  const pokaziBaner = pristanak === null;

  if (!GA_ID) return null;

  const inicijalizacija = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    try{ if(localStorage.getItem('dp-pristanak-analitika')==='da') gtag('consent','update',{analytics_storage:'granted'}); }catch(e){}
    gtag('js', new Date());
    gtag('config', ${JSON.stringify(GA_ID)});
  `;

  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {inicijalizacija}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
        strategy="afterInteractive"
      />
      {pokaziBaner && (
        <div
          role="dialog"
          aria-label="Kolačići za analitiku"
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-[440px] flex-col gap-4 rounded-image border border-[rgba(255,197,61,0.35)] bg-[var(--color-bg-inverse)] p-5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.5)] sm:left-4 sm:mx-0"
        >
          <p className="m-0 font-tekst text-body-sm leading-body text-[rgba(191,227,208,0.9)]">
            Koristimo anonimnu analitiku (Google Analytics) da vidimo kako se sajt koristi i da ga
            poboljšamo. Kolačiće za to uključujemo samo uz vaš pristanak.{" "}
            <Link href="/privatnost" className="text-white underline underline-offset-2">
              Saznajte više
            </Link>
          </p>
          <div className="flex gap-3">
            <Dugme size="xs" variant="gold" className="flex-1" onClick={() => postaviPristanak("da")}>
              Prihvatam
            </Dugme>
            <Dugme
              size="xs"
              variant="outline"
              className="flex-1 !border-[rgba(191,227,208,0.5)] !text-white hover:!bg-[rgba(255,255,255,0.08)]"
              onClick={() => postaviPristanak("ne")}
            >
              Odbijam
            </Dugme>
          </div>
        </div>
      )}
    </>
  );
}

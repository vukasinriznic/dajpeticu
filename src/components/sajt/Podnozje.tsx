"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";
import { Logotip } from "@/components/core/Logotip";
import { Dugme, DUGME_ISTAKNUTO } from "@/components/core/Dugme";
import { site } from "@/lib/site";
import { useKorpa } from "@/components/sajt/KorpaKontekst";

const KONTAKTI = [
  { ikonica: Phone, tekst: site.telefon, href: site.telefonHref },
  { ikonica: Mail, tekst: site.email, href: `mailto:${site.email}` },
  { ikonica: Instagram, tekst: site.instagramNaziv, href: site.instagram, spolja: true },
];

export function Podnozje() {
  const { otvoriModal } = useKorpa();
  return (
    <footer className="bg-bg-inverse px-5 pt-16 pb-10 text-text-on-inverse">
      <div className="mx-auto flex max-w-[var(--container)] flex-wrap justify-between gap-12">
        <div className="flex max-w-[34ch] flex-col gap-4">
          <Logotip kontekst="footer" />
          <p className="m-0 text-body-sm leading-body text-text-quiet-on-inverse">
            Radi i kad vi niste tu, tiho i bez podsećanja.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-body-sm">
          <strong className="font-normal">Kontakt</strong>
          {KONTAKTI.map(({ ikonica: Ikonica, tekst, href, spolja }) => (
            <a
              key={tekst}
              href={href}
              className="group flex items-center gap-2.5 text-text-quiet-on-inverse no-underline transition-[color] duration-200 hover:text-text-on-inverse"
              {...(spolja ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <Ikonica size={18} strokeWidth={1.75} className="shrink-0 text-[var(--color-gold)]" />
              {tekst}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-start gap-4">
          <strong className="text-body-sm font-normal">Poruči za 1 minut</strong>
          <Dugme
            variant="gold"
            size="lg"
            className={DUGME_ISTAKNUTO}
            onClick={() => otvoriModal()}
          >
            Poruči stalak
          </Dugme>
        </div>
      </div>
      {/* Mobilno: © / linkovi / "Site powered by" svaki u svom redu
          (19.09.2026.), ali sama tri pravna linka (Uslovi/Privatnost/
          Garancija) grupisana u JEDAN red sa "·" separatorima (naknadno
          traženo — prvobitno su i ona bila razdvojena, ispalo je previše
          usitnjeno). lg: vraća originalni jednoredni flex-wrap sa ml-auto
          na poslednjoj stavci, nepromenjeno. */}
      <div className="mx-auto mt-10 flex max-w-[var(--container)] flex-col items-start gap-2 border-t border-white/14 pt-5 text-caption text-text-quiet-on-inverse lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-2">
        <span>© {new Date().getFullYear()} Daj Peticu</span>
        <span aria-hidden="true" className="hidden lg:inline">·</span>
        <div className="flex items-center gap-x-2">
          <Link href="/uslovi" className="text-text-quiet-on-inverse transition-colors duration-200 hover:text-text-on-inverse">
            Uslovi
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/privatnost"
            className="text-text-quiet-on-inverse transition-colors duration-200 hover:text-text-on-inverse"
          >
            Privatnost
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/garancija"
            className="text-text-quiet-on-inverse transition-colors duration-200 hover:text-text-on-inverse"
          >
            Garancija
          </Link>
        </div>
        <a
          href="https://www.aferadigital.rs/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-text-quiet-on-inverse no-underline transition-colors duration-200 hover:text-text-on-inverse lg:ml-auto"
        >
          <Image src="/images/logo-mark.png" alt="" width={16} height={14} unoptimized />
          Site powered by Afera Digital
        </a>
      </div>
    </footer>
  );
}

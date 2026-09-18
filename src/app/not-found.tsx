"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dugme } from "@/components/core/Dugme";

// Isti obrazac kao "poslato" stanje na /placanje (page.tsx) — puna
// tamnozelena sekcija, centrirano, bez nav-a/footera, jer je jedina
// smislena radnja odavde "nazad na početnu".
export default function NotFound() {
  const router = useRouter();

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-inverse px-5 text-center">
      <Image src="/images/no-results.png" alt="" width={96} height={96} />
      <h1 className="m-0 font-prikaz text-h1 leading-heading font-normal text-white">
        Stranica nije pronađena.
      </h1>
      <p className="m-0 max-w-[62ch] font-tekst text-body text-[rgba(191,227,208,0.85)]">
        Link koji ste otvorili ne postoji ili je premešten.
      </p>
      <Dugme variant="gold" onClick={() => router.push("/")}>
        Nazad na početnu
      </Dugme>
    </section>
  );
}

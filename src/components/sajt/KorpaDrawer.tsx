"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dugme } from "@/components/core/Dugme";
import { pratiDogadjaj, stavkaZaAnalitiku } from "@/lib/analitika";
import { Podvuceno } from "@/components/core/Podvuceno";
import { KorpaStavka } from "@/components/sajt/KorpaStavka";
import { useKorpa, type StavkaKorpe } from "@/components/sajt/KorpaKontekst";
import {
  formatRSD,
  MAX_KOLICINA,
  PRAG_BESPLATNE_DOSTAVE_RSD,
  PRAG_GRATIS_VECI_STALAK,
  PRAG_GRATIS_MANJI_STALAK,
  ukupnaKolicinaManjihUKorpi,
  ukupnaKolicinaVecihUKorpi,
} from "@/lib/cene";
import { validirajUkupnuKolicinu } from "@/lib/validacijaPorudzbine";

// Isti tamnozeleni/zlatni jezik kao DodajUKorpuPopup.tsx — panel usidren
// desno (Modal.tsx variant="drawer"), otvara se klikom na ikonicu korpe u
// Zaglavlje.tsx. Sadrži samo pregled/izmenu stavki; sami podaci za dostavu
// žive na posebnoj stranici (/placanje), do koje vodi dugme "Plaćanje".
export function KorpaDrawer({
  stavke,
  ukupnaKolicina,
  ukupnaCena,
  onAzuriraj,
  onUkloni,
  onZatvori,
}: {
  stavke: StavkaKorpe[];
  ukupnaKolicina: number;
  ukupnaCena: number;
  onAzuriraj: (id: string, patch: Partial<Pick<StavkaKorpe, "kolicina">>) => void;
  onUkloni: (id: string) => void;
  onZatvori: () => void;
}) {
  const router = useRouter();
  // "Nastavite kupovinu" (oba dugmeta ispod) — otvara popup za dodavanje
  // stalka umesto da vodi na početnu (24.09.2026., eksplicitno traženo):
  // korisnik ostaje u toku porudžbine, bez skrolovanja do dugmeta na
  // stranici. Drawer se zatvara PRE otvaranja popupa, isti redosled kao
  // suprotan smer (DodajUKorpuPopup.tsx-ov onDodaj radi close→open).
  const { otvoriModal } = useKorpa();
  const nastaviKupovinu = () => {
    onZatvori();
    otvoriModal();
  };
  // validirajUkupnuKolicinu() (server strana rute) bi ovo ionako odbio tek
  // na /placanje — upozorenje ovde sprečava da korisnik prvo sabere veliku
  // korpu (i vidi "tačnu" cenu) pa tek na sledećem koraku sazna da
  // porudžbina ne prolazi. Ista funkcija, ista granica — PO VELIČINI
  // (25 većih I 25 manjih u istoj korpi je u redu), ne zbir cele korpe.
  const prekoracenje = validirajUkupnuKolicinu(stavke) !== null;

  return (
    <div className={`flex flex-col bg-[var(--color-bg-inverse)] ${stavke.length === 0 ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh]"}`}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[rgba(255,197,61,0.2)] bg-[var(--color-bg-inverse)] px-6 py-5">
        <h2 className="m-0 font-prikaz text-h2 leading-heading font-normal text-white">
          <Podvuceno>Vaša korpa</Podvuceno> {stavke.length > 0 && `· ${ukupnaKolicina}`}
        </h2>
        <button
          type="button"
          onClick={onZatvori}
          aria-label="Zatvori korpu"
          className="grid h-11 w-11 place-items-center border-0 bg-none outline-none focus:outline-none focus-visible:outline-none text-[var(--color-gold)] transition-transform duration-200 hover:scale-110"
        >
          <X size={28} strokeWidth={2.25} />
        </button>
      </div>

      {stavke.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          {/* Ista PNG ikonica kao u Zaglavlje.tsx, ovde obojena zlatno preko
              CSS mask-a (ikonica je crna/tamna linija na providnom
              pozadini — mask puni siluetu bilo kojom bojom, umesto
              pokušaja da se sam PNG "filter"-uje u tačno zlatnu nijansu). */}
          <span
            aria-hidden="true"
            className="h-12 w-12 shrink-0"
            style={{
              backgroundColor: "var(--color-gold)",
              WebkitMaskImage: "url(/images/shopping-cart.png)",
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              maskImage: "url(/images/shopping-cart.png)",
              maskSize: "contain",
              maskPosition: "center",
              maskRepeat: "no-repeat",
            }}
          />
          <p className="m-0 font-tekst text-body text-[rgba(191,227,208,0.85)]">Vaša korpa je prazna.</p>
          <Dugme variant="gold" onClick={nastaviKupovinu}>
            Nastavite kupovinu
          </Dugme>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-4 px-6 py-6">
            {stavke.map((s) => (
              <KorpaStavka
                key={s.id}
                stavka={s}
                sveStavke={stavke}
                onAzuriraj={(patch) => onAzuriraj(s.id, patch)}
                onUkloni={() => onUkloni(s.id)}
              />
            ))}
          </div>

          <div className="sticky bottom-0 z-10 flex flex-col gap-4 border-t border-[rgba(255,197,61,0.2)] bg-[var(--color-bg-inverse)] px-6 py-6">
            {/* Na malenoj korpi kupac poštarinu plaća kuriru (vidi uslove) i
                to se namerno ne pominje ovde (ništa se ne obećava
                besplatno); iznad praga po CENI (24.09.2026., promenjeno sa
                praga po količini) red sa ikonicom za svaku otključanu
                pogodnost, isti obrazac kao u DodajUKorpuPopup.tsx. */}
            {(() => {
              const imaDostavu = ukupnaCena > PRAG_BESPLATNE_DOSTAVE_RSD;
              const imaVeciStalak = ukupnaKolicinaManjihUKorpi(stavke) >= PRAG_GRATIS_VECI_STALAK;
              const imaManjiStalak = ukupnaKolicinaVecihUKorpi(stavke) >= PRAG_GRATIS_MANJI_STALAK;
              const imaIkakvuPogodnost = imaDostavu || imaVeciStalak || imaManjiStalak;
              return (
                <>
                  {imaIkakvuPogodnost && (
                    <div className="flex flex-col gap-1.5">
                      {imaDostavu && (
                        <div className="flex items-center gap-2">
                          <span className="flex w-7 shrink-0 items-center justify-center">
                            <Image src="/images/shipping_box.png" alt="" width={18} height={18} />
                          </span>
                          <span className="font-tekst text-body-sm font-medium text-white">Besplatna poštarina</span>
                        </div>
                      )}
                      {imaVeciStalak && (
                        <div className="flex items-center gap-2">
                          <span className="flex w-7 shrink-0 items-center justify-center">
                            <Image src="/images/gift_icon.png" alt="" width={18} height={18} />
                          </span>
                          <span className="font-tekst text-body-sm font-medium text-white">Gratis veći stalak</span>
                        </div>
                      )}
                      {imaManjiStalak && (
                        <div className="flex items-center gap-2">
                          <span className="flex w-7 shrink-0 items-center justify-center">
                            <Image src="/images/gift_icon.png" alt="" width={18} height={18} />
                          </span>
                          <span className="font-tekst text-body-sm font-medium text-white">Gratis manji stalak</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`flex items-baseline justify-between gap-4 ${
                      imaIkakvuPogodnost ? "border-t border-[rgba(255,197,61,0.2)] pt-4" : ""
                    }`}
                  >
                    <span className="font-tekst text-body font-normal text-white">Ukupno</span>
                    <span className="font-prikaz text-h1 font-normal text-[var(--color-gold)]">
                      {formatRSD(ukupnaCena)}
                    </span>
                  </div>
                </>
              );
            })()}
            {prekoracenje && (
              <p className="m-0 font-tekst text-body-sm text-[var(--color-danger)]">
                Za sada primamo porudžbine do {MAX_KOLICINA} stalaka. Smanjite količinu ili nam se javite
                direktno za veću porudžbinu.
              </p>
            )}
            <Dugme
              size="lg"
              full
              variant="gold"
              disabled={prekoracenje}
              // Bez onZatvori() — drawer ostaje preko stranice dok se ruta ne
              // promeni (KorpaKontekst ga tada zatvara), da se početna ne vidi.
              onClick={() => {
                pratiDogadjaj("begin_checkout", {
                  currency: "RSD",
                  value: ukupnaCena,
                  items: stavke.map(stavkaZaAnalitiku),
                });
                router.push("/placanje");
              }}
            >
              Plaćanje
            </Dugme>
            <button
              type="button"
              onClick={nastaviKupovinu}
              className="mx-auto font-tekst text-body-sm text-[rgba(191,227,208,0.85)] underline decoration-[rgba(191,227,208,0.5)] underline-offset-2 transition-colors duration-200 hover:text-white"
            >
              Nastavite kupovinu
            </button>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { cenaKartica } from "@/lib/cene";
import { pratiDogadjaj, stavkaZaAnalitiku } from "@/lib/analitika";
import { ukupnoKorpa } from "@/lib/cene";
import type { Boja } from "@/lib/validacijaPorudzbine";
import { Modal } from "@/components/core/Modal";
import { DodajUKorpuPopup } from "@/components/sajt/DodajUKorpuPopup";
import { KorpaDrawer } from "@/components/sajt/KorpaDrawer";

export type StavkaKorpe = {
  id: string;
  boja: Boja;
  kolicina: number;
  nazivBiznisa: string;
  googlePlaceId?: string;
};

type KorpaKontekstTip = {
  stavke: StavkaKorpe[];
  // Da li je localStorage već pročitan — bez ovoga bi /placanje na trenutak
  // video praznu korpu (SSR/pre-hidracije) i pogrešno preusmerio korisnika
  // koji stvarno ima nešto u korpi.
  hidrirano: boolean;
  azurirajStavku: (id: string, patch: Partial<Omit<StavkaKorpe, "id">>) => void;
  ukloniStavku: (id: string) => void;
  isprazniKorpu: () => void;
  ukupnaKolicina: number;
  ukupnaCena: number;
  otvoriModal: (pocetnaKolicina?: number) => void;
  otvoriKorpu: () => void;
  zatvoriKorpu: () => void;
};

const Kontekst = createContext<KorpaKontekstTip | null>(null);

export function useKorpa() {
  const vrednost = useContext(Kontekst);
  if (!vrednost) throw new Error("useKorpa mora stajati unutar KorpaProvider-a.");
  return vrednost;
}

const KLJUC_LOCALSTORAGE = "dp-korpa";

export function KorpaProvider({ children }: { children: ReactNode }) {
  const [stavke, setStavke] = useState<StavkaKorpe[]>([]);
  const [hidrirano, setHidrirano] = useState(false);
  const [otvorenModal, setOtvorenModal] = useState(false);
  const [otvorenaKorpa, setOtvorenaKorpa] = useState(false);
  const [pocetnaKolicina, setPocetnaKolicina] = useState(1);

  // Korpa (drawer) se zatvara TEK kad se ruta stvarno promeni (npr. "Plaćanje"
  // → /placanje). Ranije je dugme zatvaralo drawer odmah, pa se tokom njegovog
  // izlaznog fade-a (260ms) na trenutak videla početna pre nove stranice.
  // Obrazac "prilagodi stanje tokom render-a" (bez efekta).
  const putanja = usePathname();
  const [prethodnaPutanja, setPrethodnaPutanja] = useState(putanja);
  if (putanja !== prethodnaPutanja) {
    setPrethodnaPutanja(putanja);
    setOtvorenaKorpa(false);
  }

  // Hidracija iz localStorage tek POSLE mount-a — u samom render-u bi server
  // (uvek prazna korpa) i klijent (možda već ima nešto u localStorage-u)
  // dali različit sadržaj, što React prijavljuje kao hydration mismatch.
  useEffect(() => {
    try {
      const sacuvano = window.localStorage.getItem(KLJUC_LOCALSTORAGE);
      if (sacuvano) setStavke(JSON.parse(sacuvano));
    } catch {
      // neispravan sadržaj u localStorage-u — nastavi sa praznom korpom
    }
    setHidrirano(true);
  }, []);

  useEffect(() => {
    if (!hidrirano) return; // ne piši nazad pre nego što je pravo stanje učitano
    window.localStorage.setItem(KLJUC_LOCALSTORAGE, JSON.stringify(stavke));
  }, [stavke, hidrirano]);

  const dodajStavku = useCallback((stavka: Omit<StavkaKorpe, "id">) => {
    setStavke((prethodne) => [...prethodne, { ...stavka, id: crypto.randomUUID() }]);
  }, []);

  const azurirajStavku = useCallback((id: string, patch: Partial<Omit<StavkaKorpe, "id">>) => {
    setStavke((prethodne) => prethodne.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const ukloniStavku = useCallback((id: string) => {
    setStavke((prethodne) => prethodne.filter((s) => s.id !== id));
  }, []);

  const isprazniKorpu = useCallback(() => setStavke([]), []);

  const otvoriModal = useCallback((pocetna: number = 1) => {
    setPocetnaKolicina(pocetna);
    setOtvorenModal(true);
  }, []);

  const otvoriKorpu = useCallback(() => setOtvorenaKorpa(true), []);
  const zatvoriKorpu = useCallback(() => setOtvorenaKorpa(false), []);

  const ukupnaKolicina = useMemo(() => stavke.reduce((z, s) => z + s.kolicina, 0), [stavke]);
  const ukupnaCena = useMemo(() => ukupnoKorpa(stavke), [stavke]);

  const value: KorpaKontekstTip = {
    stavke,
    hidrirano,
    azurirajStavku,
    ukloniStavku,
    isprazniKorpu,
    ukupnaKolicina,
    ukupnaCena,
    otvoriModal,
    otvoriKorpu,
    zatvoriKorpu,
  };

  return (
    <Kontekst.Provider value={value}>
      {children}
      <Modal open={otvorenModal} onClose={() => setOtvorenModal(false)}>
        <DodajUKorpuPopup
          otvoren={otvorenModal}
          pocetnaKolicina={pocetnaKolicina}
          onClose={() => setOtvorenModal(false)}
          onDodaj={(stavka) => {
            dodajStavku(stavka);
            pratiDogadjaj("add_to_cart", {
              currency: "RSD",
              value: cenaKartica(stavka.kolicina),
              items: [stavkaZaAnalitiku(stavka)],
            });
            setOtvorenModal(false);
            otvoriKorpu();
          }}
        />
      </Modal>
      <Modal variant="drawer" open={otvorenaKorpa} onClose={zatvoriKorpu}>
        <KorpaDrawer
          stavke={stavke}
          ukupnaKolicina={ukupnaKolicina}
          ukupnaCena={ukupnaCena}
          onAzuriraj={azurirajStavku}
          onUkloni={ukloniStavku}
          onZatvori={zatvoriKorpu}
        />
      </Modal>
    </Kontekst.Provider>
  );
}

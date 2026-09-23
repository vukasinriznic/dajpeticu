import { UNaVidiku } from "@/components/core/UNaVidiku";
import { CenovnaKartica } from "@/components/marketing/CenovnaKartica";
import {
  cenaKartica,
  formatRSD,
  jedinicnaCena,
  jedinicnaCenaManjiPrikaz,
  kolicinaSlovima,
  ukupnaCenaManji,
} from "@/lib/cene";
import { razmerProizvoda, slikaProizvoda } from "@/lib/proizvod";
import type { Velicina } from "@/lib/validacijaPorudzbine";

// Slika+naziv (25.09.2026., eksplicitno traženo) — "x N" umesto "N stalaka",
// uz malu sliku BELE varijante te veličine (paket ne bira boju, slika je
// samo ilustrativna). Prva kartica ostaje veći stalak (kao i pre), druga i
// treća sada nude MANJI stalak (bio veći, 5 i 10 kom) — manji ima sopstveni
// cenovnik (cene.ts, UKUPNA_CENA_MANJI), pa se cena/ušteda/napomena računaju
// po veličini paketa, ne uvek po većem.
const PAKETI = [
  {
    kolicina: 2,
    velicina: "veci" as Velicina,
    naziv: "Veći x 2",
    stavke: ["Za mali salon ili radnju", "Podešavamo i zaključavamo čip", "Stiže poštom za 2 dana"],
  },
  {
    kolicina: 10,
    velicina: "manji" as Velicina,
    naziv: "Manji x 10",
    stavke: ["Po jedna na svaki sto", "Podešavamo i zaključavamo čip", "Zamena bez pitanja 90 dana"],
  },
  {
    kolicina: 20,
    velicina: "manji" as Velicina,
    naziv: "Manji x 20",
    stavke: ["Po jedna na svaki sto", "Podešavamo i zaključavamo čip", "Zamena bez pitanja 90 dana"],
    istaknuta: true,
  },
] as const;

// Ušteda je uvek u odnosu na cenu JEDNOG stalka te iste veličine
// (najskuplji, "pojedinačni" tier), pomnožena količinom u paketu — svaka
// veličina ima sopstveni cenovnik, pa i sopstvenu "pojedinačnu" cenu.
const CENA_JEDNE = jedinicnaCena(1);
const CENA_JEDNE_MANJI = jedinicnaCenaManjiPrikaz(1);

function cenaPaketa(kolicina: number, velicina: Velicina): number {
  return velicina === "manji" ? ukupnaCenaManji(kolicina) : cenaKartica(kolicina);
}

function cenaPoKomaduPaketa(kolicina: number, velicina: Velicina): number {
  return velicina === "manji" ? jedinicnaCenaManjiPrikaz(kolicina) : jedinicnaCena(kolicina);
}

export function Cenovnik({
  onOdaberi,
}: {
  onOdaberi: (kolicina: number, velicina: Velicina) => void;
}) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {PAKETI.map((p, i) => {
        const cenaPoKomadu = cenaPoKomaduPaketa(p.kolicina, p.velicina);
        const cenaJedne = p.velicina === "manji" ? CENA_JEDNE_MANJI : CENA_JEDNE;
        return (
          <UNaVidiku key={`${p.velicina}-${p.kolicina}`} rastegni kasnjenje={i * 100}>
            <CenovnaKartica
              naziv={p.naziv}
              slika={slikaProizvoda(p.velicina, "bela")}
              razmerSlike={razmerProizvoda(p.velicina)}
              cena={formatRSD(cenaPaketa(p.kolicina, p.velicina)).replace(" RSD", "")}
              napomena={`${formatRSD(cenaPoKomadu)} po stalku`}
              stavke={[...p.stavke]}
              // Skraćeno na "-X RSD" (bilo "Ušteda X RSD") — sa malom
              // slikom ispred naziva red više nema mesta za duži tekst na
              // mobilnom (25.09.2026., prijavljeno prelamanje na iPhone
              // 16 širini), a "-" ispred iznosa je uobičajen i jasan zapis
              // popusta i bez reči "Ušteda".
              znacka={`-${formatRSD((cenaJedne - cenaPoKomadu) * p.kolicina)}`}
              istaknuta={"istaknuta" in p ? p.istaknuta : false}
              cta={`Izaberi ${kolicinaSlovima(p.kolicina)}`}
              onOdaberi={() => onOdaberi(p.kolicina, p.velicina)}
            />
          </UNaVidiku>
        );
      })}
    </div>
  );
}

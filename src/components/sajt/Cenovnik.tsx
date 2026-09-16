import { CenovnaKartica } from "@/components/marketing/CenovnaKartica";
import { cenaKartica, formatRSD, jedinicnaCena, kolicinaSlovima } from "@/lib/cene";

const PAKETI = [
  {
    kolicina: 2,
    naziv: "2 stalka",
    stavke: ["Za mali salon ili radnju", "Podešavamo i zaključavamo čip", "Stiže poštom za 2 dana"],
  },
  {
    kolicina: 5,
    naziv: "5 stalaka",
    stavke: ["Kasa, sto, ulaz, terasa", "Podešavamo i zaključavamo čip", "Zamena bez pitanja 90 dana"],
  },
  {
    kolicina: 10,
    naziv: "10 stalaka",
    stavke: ["Po jedna na svaki sto", "Podešavamo i zaključavamo čip", "Zamena bez pitanja 90 dana"],
    istaknuta: true,
  },
] as const;

// Ušteda je uvek u odnosu na cenu jedne kartice (najskuplji, "pojedinačni"
// tier), pomnožena količinom u paketu, isti obračun kao svuda drugde u
// cenama.
const CENA_JEDNE = jedinicnaCena(1);

export function Cenovnik({ onOdaberi }: { onOdaberi: (kolicina: number) => void }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {PAKETI.map((p) => (
        <CenovnaKartica
          key={p.kolicina}
          naziv={p.naziv}
          cena={formatRSD(cenaKartica(p.kolicina)).replace(" RSD", "")}
          napomena={`${formatRSD(jedinicnaCena(p.kolicina))} po stalku`}
          stavke={[...p.stavke]}
          znacka={`Ušteda ${formatRSD((CENA_JEDNE - jedinicnaCena(p.kolicina)) * p.kolicina)}`}
          istaknuta={"istaknuta" in p ? p.istaknuta : false}
          cta={`Izaberi ${kolicinaSlovima(p.kolicina)}`}
          onOdaberi={() => onOdaberi(p.kolicina)}
        />
      ))}
    </div>
  );
}

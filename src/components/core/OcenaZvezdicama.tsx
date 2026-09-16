export function OcenaZvezdicama({
  vrednost = 5,
  max = 5,
  velicina = 20,
  razmak = 3,
  className = "",
}: {
  vrednost?: number;
  max?: number;
  velicina?: number;
  razmak?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${vrednost} od ${max}`}
      className={`inline-flex items-center ${className}`}
      style={{ gap: razmak }}
    >
      {Array.from({ length: max }, (_, i) => (
        <img
          key={i}
          src="/pointed-star.png"
          alt=""
          aria-hidden="true"
          width={velicina}
          height={velicina}
          className={`shrink-0 ${i < vrednost ? "" : "opacity-30 grayscale"}`}
          style={{ width: velicina, height: velicina }}
        />
      ))}
    </span>
  );
}

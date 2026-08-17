import Image from "next/image";
import { logoUrl, type MovieDetails } from "@/lib/tmdb";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
});
const languageNames = new Intl.DisplayNames(["pt-BR"], { type: "language" });
const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });

function formatCurrency(value: number) {
  return value > 0 ? currencyFormatter.format(value) : null;
}

function formatLanguage(code: string) {
  try {
    const name = languageNames.of(code);
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : code;
  } catch {
    return code;
  }
}

function formatRegion(code: string) {
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export default function MovieInfoCard({ movie }: { movie: MovieDetails }) {
  const budget = formatCurrency(movie.budget);
  const revenue = formatCurrency(movie.revenue);
  const originCountries = movie.originCountry.map(formatRegion);
  const productionCountries = movie.productionCountries.map(formatRegion);
  const productionCompanies = movie.productionCompanies.map((company) => ({
    name: company.name,
  }));

  return (
    <aside className="flex flex-col gap-5 rounded-lg border border-brand-divider bg-brand-surface p-5">
      <h2 className="font-heading text-xs font-medium uppercase tracking-[0.08em] text-brand-text/50">
        Ficha técnica
      </h2>

      <dl className="flex flex-col gap-4 text-sm">
        <div>
          <dt className="text-brand-text/50">Idioma original</dt>
          <dd className="mt-1">{formatLanguage(movie.originalLanguage)}</dd>
        </div>

        {originCountries.length > 0 && (
          <div>
            <dt className="text-brand-text/50">País de origem</dt>
            <dd className="mt-1">{originCountries.join(", ")}</dd>
          </div>
        )}

        {budget && (
          <div>
            <dt className="text-brand-text/50">Orçamento</dt>
            <dd className="mt-1">{budget}</dd>
          </div>
        )}

        {revenue && (
          <div>
            <dt className="text-brand-text/50">Receita</dt>
            <dd className="mt-1">{revenue}</dd>
          </div>
        )}

        {productionCountries.length > 0 && (
          <div>
            <dt className="text-brand-text/50">Países de produção</dt>
            <dd className="mt-1">{productionCountries.join(", ")}</dd>
          </div>
        )}

        {movie.productionCompanies.length > 0 && (
          <div>
            <dt className="text-brand-text/50">Produtoras</dt>
            <dd className="mt-1">
              {productionCompanies.map((company) => company.name).join(", ")}
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

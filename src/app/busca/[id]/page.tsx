import { searchMovies, posterUrl } from "@/lib/tmdb";
import PosterCard, { type MovieCard } from "@/components/home/PosterCard";
import SearchPagination from "@/components/SearchPagination";

function parsePage(value: string | string[] | undefined): number {
  const raw = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(raw) && raw >= 1 ? Math.min(Math.trunc(raw), 500) : 1;
}

export default async function SearchPage({ params, searchParams }: PageProps<"/busca/[id]">) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const query = decodeURIComponent(id);
  const page = parsePage(pageParam);

  const { movies, totalPages, totalResults } = await searchMovies(query, page);

  const cards: MovieCard[] = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.year,
    genres: movie.genreNames.slice(0, 2).join(", "),
    poster: posterUrl(movie.posterPath),
  }));

  return (
    <div className="-mt-6 min-h-screen bg-brand-bg px-12 pb-20 pt-10 font-body text-brand-text">
      <h1 className="font-heading text-xl font-medium md:text-2xl">Resultados para &quot;{query}&quot;</h1>
      <p className="mt-1 text-sm text-brand-text/50">
        {totalResults} {totalResults === 1 ? "filme encontrado" : "filmes encontrados"}
      </p>

      {cards.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cards.map((movie) => (
              <PosterCard key={movie.id} movie={movie} />
            ))}
          </div>
          <SearchPagination basePath={`/busca/${id}`} currentPage={page} totalPages={totalPages} />
        </>
      ) : (
        <p className="mt-8 text-brand-text/60">Nenhum filme encontrado para essa busca.</p>
      )}
    </div>
  );
}

import { backdropUrl, getTrendingMovies, getUpcomingMovies, posterUrl, type Movie } from "@/lib/tmdb";
import HeroCarousel, { type HeroSlide } from "@/components/home/HeroCarousel";
import MovieRow, { type MovieCard } from "@/components/home/MovieRow";

// const GENRE_NAV = [
//   "Ação",
//   "Ficção científica",
//   "Drama",
//   "Suspense",
//   "Comédia",
//   "Terror",
//   "Documentário",
//   "Animação",
// ];

function toCard(movie: Movie): MovieCard {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    genres: movie.genreNames.slice(0, 2).join(", "),
    poster: posterUrl(movie.posterPath),
  };
}

export default async function Home() {
  const [trending, upcoming] = await Promise.all([getTrendingMovies(), getUpcomingMovies()]);

  const heroSlides: HeroSlide[] = trending.slice(0, 10).map((movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.year,
    genres: movie.genreNames.slice(0, 2).join(", "),
    synopsis: movie.overview,
    backdrop: backdropUrl(movie.backdropPath),
  }));

  const rows = [
    {
      id: "lancamentos",
      title: "Lançamentos",
      note: "em breve nos cinemas",
      items: upcoming.map(toCard),
    },
    {
      id: "alta",
      title: "Em alta hoje",
      note: "mais assistidos nas últimas 24 horas",
      items: trending.map(toCard),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg pb-14 font-body text-brand-text">
      <HeroCarousel slides={heroSlides} />

      {rows.map((row) => (
        <MovieRow key={row.id} id={row.id} title={row.title} note={row.note} items={row.items} />
      ))}

      {/* <section id="generos" className="px-10 pt-14">
        <div className="mb-5 h-px bg-[linear-gradient(to_right,transparent,var(--color-brand-divider)_48px,var(--color-brand-divider)_calc(100%-48px),transparent)]" />
        <div className="flex flex-wrap items-baseline gap-4">
          <span className="text-xs uppercase tracking-[0.14em] text-brand-text/45">
            Navegue por gênero
          </span>
          <div className="flex flex-wrap gap-2">
            {GENRE_NAV.map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-md border border-brand-accent px-3 py-1 text-xs tracking-[0.02em] text-brand-accent"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}

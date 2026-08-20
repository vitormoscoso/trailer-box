import MovieRow, { type MovieCard } from "@/components/home/MovieRow";
import MovieInfoCard from "@/components/movie/MovieInfoCard";
import PersonRow from "@/components/movie/PersonRow";
import TrailerPlayer, {
  TRAILER_LANGUAGE_COOKIE,
} from "@/components/movie/TrailerPlayer";
import { btnClass } from "@/lib/button-styles";
import {
  backdropUrl,
  getDirectors,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
  getTrailerOptions,
  posterUrl,
  profileUrl,
  sortCrewByRelevance,
  type TrailerLanguage,
} from "@/lib/tmdb";
import { ExternalLink } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PosterImage from "@/components/PosterImage";

const TRAILER_LANGUAGE_KEYS: TrailerLanguage[] = [
  "dublado",
  "original",
  "ingles",
];

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours > 0
    ? `${hours}h${remaining > 0 ? ` ${remaining}min` : ""}`
    : `${remaining}min`;
}

export default async function MoviePage({ params }: PageProps<"/movie/[id]">) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isFinite(movieId)) notFound();

  // Details go first: getMovieVideos needs the original language to widen the search.
  const movie = await getMovieDetails(movieId);
  if (!movie) notFound();

  const [videos, credits, similar, cookieStore] = await Promise.all([
    getMovieVideos(movieId, movie.originalLanguage),
    getMovieCredits(movieId),
    getSimilarMovies(movieId),
    cookies(),
  ]);

  const trailerOptions = getTrailerOptions(videos, movie.originalLanguage);
  const preferredLanguage = cookieStore.get(TRAILER_LANGUAGE_COOKIE)?.value;
  const initialTrailerKey =
    trailerOptions.find((option) => option.key === preferredLanguage)?.key ??
    trailerOptions[0]?.key ??
    TRAILER_LANGUAGE_KEYS[0];

  const backdrop = backdropUrl(movie.backdropPath);
  const poster = posterUrl(movie.posterPath);
  const directors = getDirectors(credits.crew);
  const cast = credits.cast.slice(0, 18).map((member) => ({
    id: member.id,
    name: member.name,
    role: member.character,
    profile: profileUrl(member.profilePath),
  }));
  const crew = sortCrewByRelevance(credits.crew)
    .slice(0, 18)
    .map((member) => ({
      id: member.id,
      name: member.name,
      role: member.job,
      profile: profileUrl(member.profilePath),
    }));
  const similarCards: MovieCard[] = similar.map((result) => ({
    id: result.id,
    title: result.title,
    year: result.year,
    genres: result.genreNames.slice(0, 2).join(", "),
    poster: posterUrl(result.posterPath),
  }));

  return (
    <div className="min-h-screen bg-brand-bg font-body text-brand-text">
      <section className="relative -mt-6 h-[50vh] min-h-[360px]">
        <div className="absolute inset-0">
          {backdrop && (
            <Image
              src={backdrop}
              alt={movie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_10%]"
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#161826_0%,rgba(22,24,38,0.4)_60%,rgba(22,24,38,0.85)_100%)]" />
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-12">
        <div className="-mt-32 flex flex-col gap-8 sm:flex-row">
          <div className="relative aspect-2/3 w-40 flex-none overflow-hidden rounded-lg bg-brand-surface shadow-md sm:w-56">
            <PosterImage src={poster} alt={movie.title} sizes="224px" iconSize={40} />
          </div>

          <div className="relative flex-1 pt-4">
            <h1 className="font-heading text-3xl font-medium sm:text-4xl">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-1 italic text-brand-text/60">{movie.tagline}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-brand-text/70">
              <span>{movie.year}</span>
              {movie.runtime ? (
                <>
                  <span>·</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                </>
              ) : null}
              {movie.genreNames.length > 0 && (
                <>
                  <span>·</span>
                  <span>{movie.genreNames.join(", ")}</span>
                </>
              )}
            </div>

            {directors.length > 0 && (
              <p className="mt-3 text-sm text-brand-text/70">
                <span className="text-brand-text/50">Direção: </span>
                {directors.map((director) => director.name).join(", ")}
              </p>
            )}

            <p className="mt-6 max-w-2xl text-brand-text/80">
              {movie.overview}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {movie.homepage && (
                <Link
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className={btnClass("secondary")}
                >
                  <ExternalLink size={14} />
                  Site oficial
                </Link>
              )}
              {movie.imdbId && (
                <Link
                  href={`https://www.imdb.com/title/${movie.imdbId}`}
                  target="_blank"
                  rel="noreferrer"
                  className={btnClass("secondary")}
                >
                  <ExternalLink size={14} />
                  IMDb
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="my-12">
          <TrailerPlayer
            options={trailerOptions}
            initialKey={initialTrailerKey}
          />
        </div>
        <MovieInfoCard movie={movie} />
      </div>

      <PersonRow title="Elenco" members={cast} />
      <PersonRow title="Equipe técnica" members={crew} />
      <MovieRow
        id="similares"
        title="Títulos semelhantes"
        note="baseado em gênero e tema"
        size="compact"
        items={similarCards}
      />
    </div>
  );
}

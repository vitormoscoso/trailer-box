import Image from "next/image";
import { notFound } from "next/navigation";
import { backdropUrl, getMovieDetails, getMovieVideos, pickTrailer, posterUrl } from "@/lib/tmdb";

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours > 0 ? `${hours}h${remaining > 0 ? ` ${remaining}min` : ""}` : `${remaining}min`;
}

export default async function MoviePage({ params }: PageProps<"/movie/[id]">) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isFinite(movieId)) notFound();

  const [movie, videos] = await Promise.all([getMovieDetails(movieId), getMovieVideos(movieId)]);
  if (!movie) notFound();

  const trailer = pickTrailer(videos);
  const backdrop = backdropUrl(movie.backdropPath);
  const poster = posterUrl(movie.posterPath);

  return (
    <div className="min-h-screen bg-brand-bg font-body text-brand-text">
      <section className="relative -mt-6 h-[50vh] min-h-[360px]">
        <div className="absolute inset-0">
          {backdrop && (
            <Image src={backdrop} alt={movie.title} fill priority sizes="100vw" className="object-cover" />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#161826_0%,rgba(22,24,38,0.4)_60%,rgba(22,24,38,0.85)_100%)]" />
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-20">
        <div className="-mt-32 flex flex-col gap-8 sm:flex-row">
          <div className="relative aspect-2/3 w-40 flex-none overflow-hidden rounded-lg bg-brand-surface shadow-md sm:w-56">
            {poster && <Image src={poster} alt={movie.title} fill sizes="224px" className="object-cover" />}
          </div>

          <div className="relative flex-1 pt-4">
            <h1 className="font-heading text-3xl font-medium sm:text-4xl">{movie.title}</h1>
            {movie.tagline && <p className="mt-1 italic text-brand-text/60">{movie.tagline}</p>}

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

            <p className="mt-6 max-w-2xl text-brand-text/80">{movie.overview}</p>
          </div>
        </div>

        {trailer && (
          <div className="mt-12 aspect-video w-full overflow-hidden rounded-lg bg-brand-surface">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

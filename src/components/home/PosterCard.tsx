import Image from "next/image";
import Link from "next/link";

export type MovieCard = {
  id: number;
  title: string;
  year: string;
  genres: string;
  poster: string | null;
};

export default function PosterCard({ movie }: { movie: MovieCard }) {
  return (
    <Link href={`/movie/${movie.id}`} className="group flex flex-none flex-col gap-2 text-brand-text no-underline">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-brand-surface shadow-sm transition-shadow duration-150 ease-in-out group-hover:shadow-md">
        {movie.poster && (
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="(min-width: 1024px) 200px, 33vw"
            className="object-cover"
          />
        )}
      </div>
      <div>
        <div className="font-heading text-sm font-medium leading-tight">{movie.title}</div>
        <div className="mt-1 text-xs text-brand-text/50">
          {movie.year}
          {movie.genres ? ` · ${movie.genres}` : ""}
        </div>
      </div>
    </Link>
  );
}

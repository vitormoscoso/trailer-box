import type { TmdbMovieDetailsRaw, TmdbMovieSummary, TmdbVideoRaw } from "./types";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  backdropPath: string | null;
  posterPath: string | null;
  releaseDate: string;
  year: string;
  genreNames: string[];
};

export type MovieDetails = Movie & {
  runtime: number | null;
  tagline: string | null;
  status: string;
};

export type MovieVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export function toMovie(raw: TmdbMovieSummary, genreMap: Record<number, string>): Movie {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    backdropPath: raw.backdrop_path,
    posterPath: raw.poster_path,
    releaseDate: raw.release_date,
    year: raw.release_date ? raw.release_date.slice(0, 4) : "",
    genreNames: raw.genre_ids.map((id) => genreMap[id]).filter((name): name is string => Boolean(name)),
  };
}

export function toMovieDetails(raw: TmdbMovieDetailsRaw): MovieDetails {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    backdropPath: raw.backdrop_path,
    posterPath: raw.poster_path,
    releaseDate: raw.release_date,
    year: raw.release_date ? raw.release_date.slice(0, 4) : "",
    genreNames: raw.genres.map((genre) => genre.name),
    runtime: raw.runtime,
    tagline: raw.tagline || null,
    status: raw.status,
  };
}

export function toMovieVideo(raw: TmdbVideoRaw): MovieVideo {
  return {
    id: raw.id,
    key: raw.key,
    name: raw.name,
    site: raw.site,
    type: raw.type,
    official: raw.official,
  };
}

/** Picks the best YouTube trailer to feature: official trailer > any trailer > teaser > first video. */
export function pickTrailer(videos: MovieVideo[]): MovieVideo | null {
  const youtube = videos.filter((video) => video.site === "YouTube");
  return (
    youtube.find((video) => video.type === "Trailer" && video.official) ??
    youtube.find((video) => video.type === "Trailer") ??
    youtube.find((video) => video.type === "Teaser") ??
    youtube[0] ??
    null
  );
}

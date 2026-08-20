import "server-only";
import { cache } from "react";
import { tmdbFetch, TmdbApiError } from "./fetcher";
import { TMDB_LANGUAGE, TMDB_REGION, TMDB_REVALIDATE } from "./constants";
import {
  toCredits,
  toMovie,
  toMovieDetails,
  toMovieVideo,
  type Credits,
  type Movie,
  type MovieDetails,
  type MovieVideo,
} from "./dto";
import type {
  TmdbCreditsResponse,
  TmdbGenreListResponse,
  TmdbMovieDetailsRaw,
  TmdbMovieSummary,
  TmdbPaginatedResponse,
  TmdbVideosResponse,
} from "./types";

/** Genre id -> name. TMDB's genre list is effectively static, cached for a week. */
export const getGenreMap = cache(async (): Promise<Record<number, string>> => {
  const data = await tmdbFetch<TmdbGenreListResponse>("/genre/movie/list", {
    searchParams: { language: TMDB_LANGUAGE },
    revalidate: TMDB_REVALIDATE.genres,
    tags: ["tmdb", "tmdb:genres"],
  });
  return Object.fromEntries(data.genres.map((genre) => [genre.id, genre.name]));
});

export const getTrendingMovies = cache(async (window: "day" | "week" = "week"): Promise<Movie[]> => {
  const [data, genreMap] = await Promise.all([
    tmdbFetch<TmdbPaginatedResponse<TmdbMovieSummary>>(`/trending/movie/${window}`, {
      searchParams: { language: TMDB_LANGUAGE },
      revalidate: TMDB_REVALIDATE.trending,
      tags: ["tmdb", "tmdb:trending"],
    }),
    getGenreMap(),
  ]);
  return data.results.map((result) => toMovie(result, genreMap));
});

/**
 * TMDB's `/movie/upcoming` and `/discover/movie` (with a `region`) filter by the
 * regional release date, but the `release_date` field they return is the movie's
 * original/primary release date. Theatrical rereleases (anniversary screenings,
 * classics back in theaters) pass the regional filter but carry a decades-old
 * `release_date`, so they need to be filtered out client-side by year.
 */
function isCurrentYear(movie: Movie): boolean {
  return movie.year === String(new Date().getFullYear());
}

export const getUpcomingMovies = cache(async (): Promise<Movie[]> => {
  const [data, genreMap] = await Promise.all([
    tmdbFetch<TmdbPaginatedResponse<TmdbMovieSummary>>("/movie/upcoming", {
      searchParams: { language: TMDB_LANGUAGE, region: TMDB_REGION },
      revalidate: TMDB_REVALIDATE.upcoming,
      tags: ["tmdb", "tmdb:upcoming"],
    }),
    getGenreMap(),
  ]);
  return data.results.map((result) => toMovie(result, genreMap)).filter(isCurrentYear);
});

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Currently in theaters (Brazil release window), most popular first. */
export const getNowPlayingMovies = cache(async (): Promise<Movie[]> => {
  const today = new Date();
  const [data, genreMap] = await Promise.all([
    tmdbFetch<TmdbPaginatedResponse<TmdbMovieSummary>>("/discover/movie", {
      searchParams: {
        language: TMDB_LANGUAGE,
        region: TMDB_REGION,
        with_release_type: "2|3",
        "release_date.gte": isoDate(addDays(today, -45)),
        "release_date.lte": isoDate(today),
        "vote_count.gte": 10,
        sort_by: "popularity.desc",
      },
      revalidate: TMDB_REVALIDATE.nowPlaying,
      tags: ["tmdb", "tmdb:now-playing"],
    }),
    getGenreMap(),
  ]);
  return data.results.map((result) => toMovie(result, genreMap)).filter(isCurrentYear);
});

/** Returns `null` for an unknown/removed movie id instead of throwing, so pages can call `notFound()`. */
export const getMovieDetails = cache(async (id: number): Promise<MovieDetails | null> => {
  try {
    const data = await tmdbFetch<TmdbMovieDetailsRaw>(`/movie/${id}`, {
      searchParams: { language: TMDB_LANGUAGE },
      revalidate: TMDB_REVALIDATE.details,
      tags: ["tmdb", `tmdb:movie:${id}`],
    });
    return toMovieDetails(data);
  } catch (error) {
    if (error instanceof TmdbApiError && error.status === 404) return null;
    throw error;
  }
});

/**
 * Once `include_video_language` is set, TMDB stops implicitly including whatever
 * `language` was requested — every language we want back (Portuguese, English,
 * untagged, and the movie's own original language e.g. "ko"/"ru") has to be listed
 * explicitly, or most movies only ever surface a dubbed trailer, or none at all.
 *
 * "pt" and "pt-BR" are NOT interchangeable here: TMDB matches them against disjoint
 * sets of videos (bare "pt" only catches Portugal-tagged videos, "pt-BR" only
 * catches Brazil-tagged ones) — both are listed so either regional dub surfaces.
 */
export const getMovieVideos = cache(async (id: number, originalLanguage?: string): Promise<MovieVideo[]> => {
  const languages = Array.from(
    new Set(["pt-BR", "en-US", "null", ...(originalLanguage ? [originalLanguage] : [])])
  );
  const data = await tmdbFetch<TmdbVideosResponse>(`/movie/${id}/videos`, {
    searchParams: { language: TMDB_LANGUAGE, include_video_language: languages.join(",") },
    revalidate: TMDB_REVALIDATE.details,
    tags: ["tmdb", `tmdb:movie:${id}`],
  });
  return data.results.map(toMovieVideo);
});

export const getMovieCredits = cache(async (id: number): Promise<Credits> => {
  const data = await tmdbFetch<TmdbCreditsResponse>(`/movie/${id}/credits`, {
    searchParams: { language: TMDB_LANGUAGE },
    revalidate: TMDB_REVALIDATE.details,
    tags: ["tmdb", `tmdb:movie:${id}`],
  });
  return toCredits(data);
});

export const getSimilarMovies = cache(async (id: number): Promise<Movie[]> => {
  const [data, genreMap] = await Promise.all([
    tmdbFetch<TmdbPaginatedResponse<TmdbMovieSummary>>(`/movie/${id}/similar`, {
      searchParams: { language: TMDB_LANGUAGE },
      revalidate: TMDB_REVALIDATE.details,
      tags: ["tmdb", `tmdb:movie:${id}`],
    }),
    getGenreMap(),
  ]);
  return data.results.map((result) => toMovie(result, genreMap));
});

export const searchMovies = cache(async (query: string, page = 1): Promise<Movie[]> => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const [data, genreMap] = await Promise.all([
    tmdbFetch<TmdbPaginatedResponse<TmdbMovieSummary>>("/search/movie", {
      searchParams: { query: trimmed, language: TMDB_LANGUAGE, page, include_adult: "false" },
      revalidate: TMDB_REVALIDATE.search,
      tags: ["tmdb", "tmdb:search"],
    }),
    getGenreMap(),
  ]);
  return data.results.map((result) => toMovie(result, genreMap));
});

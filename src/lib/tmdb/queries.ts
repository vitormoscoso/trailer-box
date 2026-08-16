import "server-only";
import { cache } from "react";
import { tmdbFetch, TmdbApiError } from "./fetcher";
import { TMDB_LANGUAGE, TMDB_REGION, TMDB_REVALIDATE } from "./constants";
import { toMovie, toMovieDetails, toMovieVideo, type Movie, type MovieDetails, type MovieVideo } from "./dto";
import type {
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

export const getUpcomingMovies = cache(async (): Promise<Movie[]> => {
  const [data, genreMap] = await Promise.all([
    tmdbFetch<TmdbPaginatedResponse<TmdbMovieSummary>>("/movie/upcoming", {
      searchParams: { language: TMDB_LANGUAGE, region: TMDB_REGION },
      revalidate: TMDB_REVALIDATE.upcoming,
      tags: ["tmdb", "tmdb:upcoming"],
    }),
    getGenreMap(),
  ]);
  return data.results.map((result) => toMovie(result, genreMap));
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

export const getMovieVideos = cache(async (id: number): Promise<MovieVideo[]> => {
  const data = await tmdbFetch<TmdbVideosResponse>(`/movie/${id}/videos`, {
    searchParams: { language: TMDB_LANGUAGE },
    revalidate: TMDB_REVALIDATE.details,
    tags: ["tmdb", `tmdb:movie:${id}`],
  });
  return data.results.map(toMovieVideo);
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

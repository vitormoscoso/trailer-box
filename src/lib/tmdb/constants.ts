export const TMDB_API_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const TMDB_LANGUAGE = "pt-BR";
export const TMDB_REGION = "BR";

/** Cache lifetimes (seconds) per resource — how often each fetch revalidates. */
export const TMDB_REVALIDATE = {
  trending: 60 * 60, // 1 hour
  upcoming: 60 * 60 * 6, // 6 hours
  nowPlaying: 60 * 60 * 6, // 6 hours
  details: 60 * 60 * 24, // 24 hours
  genres: 60 * 60 * 24 * 7, // 7 days
  search: 60 * 5, // 5 minutes
} as const;

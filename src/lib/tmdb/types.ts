/** Raw shapes as returned by the TMDB API (snake_case, unmapped). */

export type TmdbPaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovieSummary = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
};

export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbGenreListResponse = {
  genres: TmdbGenre[];
};

export type TmdbMovieDetailsRaw = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  genres: TmdbGenre[];
  vote_average: number;
  runtime: number | null;
  tagline: string | null;
  status: string;
};

export type TmdbVideoRaw = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type TmdbVideosResponse = {
  id: number;
  results: TmdbVideoRaw[];
};

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

export type TmdbProductionCompany = {
  id: number;
  name: string;
  logo_path: string | null;
};

export type TmdbSpokenLanguage = {
  iso_639_1: string;
  english_name: string;
};

export type TmdbProductionCountry = {
  iso_3166_1: string;
  name: string;
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
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  production_companies: TmdbProductionCompany[];
  production_countries: TmdbProductionCountry[];
  spoken_languages: TmdbSpokenLanguage[];
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

export type TmdbCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type TmdbCrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type TmdbCreditsResponse = {
  id: number;
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
};

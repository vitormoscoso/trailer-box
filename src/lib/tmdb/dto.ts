import type {
  TmdbCastMember,
  TmdbCreditsResponse,
  TmdbCrewMember,
  TmdbMovieDetailsRaw,
  TmdbMovieSummary,
  TmdbVideoRaw,
} from "./types";

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

export type ProductionCompany = {
  id: number;
  name: string;
  logoPath: string | null;
};

export type MovieDetails = Movie & {
  runtime: number | null;
  tagline: string | null;
  status: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdbId: string | null;
  originCountry: string[];
  originalLanguage: string;
  productionCompanies: ProductionCompany[];
  productionCountries: string[];
  spokenLanguages: string[];
};

export type MovieVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  language: string;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null;
};

export type Credits = {
  cast: CastMember[];
  crew: CrewMember[];
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
    budget: raw.budget,
    revenue: raw.revenue,
    homepage: raw.homepage || null,
    imdbId: raw.imdb_id || null,
    originCountry: raw.origin_country,
    originalLanguage: raw.original_language,
    productionCompanies: raw.production_companies.map((company) => ({
      id: company.id,
      name: company.name,
      logoPath: company.logo_path,
    })),
    productionCountries: raw.production_countries.map((country) => country.iso_3166_1),
    spokenLanguages: raw.spoken_languages.map((language) => language.english_name),
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
    language: raw.iso_639_1,
  };
}

function toCastMember(raw: TmdbCastMember): CastMember {
  return {
    id: raw.id,
    name: raw.name,
    character: raw.character,
    profilePath: raw.profile_path,
  };
}

function toCrewMember(raw: TmdbCrewMember): CrewMember {
  return {
    id: raw.id,
    name: raw.name,
    job: raw.job,
    department: raw.department,
    profilePath: raw.profile_path,
  };
}

export function toCredits(raw: TmdbCreditsResponse): Credits {
  return {
    cast: [...raw.cast].sort((a, b) => a.order - b.order).map(toCastMember),
    crew: raw.crew.map(toCrewMember),
  };
}

/** Directors, deduplicated by id (a person can be credited as director more than once). */
export function getDirectors(crew: CrewMember[]): CrewMember[] {
  const directors = crew.filter((member) => member.job === "Director");
  return Array.from(new Map(directors.map((director) => [director.id, director])).values());
}

const WRITING_JOBS = new Set(["Writer", "Screenplay", "Story", "Author"]);

function crewPriority(member: CrewMember): number {
  if (member.job === "Director") return 0;
  if (WRITING_JOBS.has(member.job)) return 1;
  return 2;
}

/** Directors and writers first, preserving TMDB's relative order within each group otherwise. */
export function sortCrewByRelevance(crew: CrewMember[]): CrewMember[] {
  return [...crew].sort((a, b) => crewPriority(a) - crewPriority(b));
}

/** Picks the best YouTube video from a single-language pool: official trailer > any trailer > teaser > first video. */
function pickBest(videos: MovieVideo[]): MovieVideo | null {
  return (
    videos.find((video) => video.type === "Trailer" && video.official) ??
    videos.find((video) => video.type === "Trailer") ??
    videos.find((video) => video.type === "Teaser") ??
    videos[0] ??
    null
  );
}

export type TrailerLanguage = "dublado" | "original" | "ingles";

export type TrailerOption = {
  key: TrailerLanguage;
  label: string;
  video: MovieVideo;
};

/**
 * Groups YouTube videos into up to three language options — dubbed Portuguese,
 * the movie's original language, and English — each showing only if TMDB actually
 * has a trailer for it. "Original" and "Inglês" collapse into one tab when the
 * movie's original language already is English.
 */
export function getTrailerOptions(videos: MovieVideo[], originalLanguage: string): TrailerOption[] {
  const youtube = videos.filter((video) => video.site === "YouTube");
  const buckets: { key: TrailerLanguage; label: string; language: string }[] = [
    { key: "dublado", label: "Português", language: "pt" },
    { key: "original", label: "Original", language: originalLanguage },
    { key: "ingles", label: "Inglês", language: "en" },
  ];

  const seenLanguages = new Set<string>();
  const options: TrailerOption[] = [];
  for (const bucket of buckets) {
    if (seenLanguages.has(bucket.language)) continue;
    const best = pickBest(youtube.filter((video) => video.language === bucket.language));
    if (best) {
      options.push({ key: bucket.key, label: bucket.label, video: best });
      seenLanguages.add(bucket.language);
    }
  }
  return options;
}

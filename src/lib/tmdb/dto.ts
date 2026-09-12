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

// Compiled from real TMDB crew credits (Homem-Aranha: Um Novo Dia, Moana 2,
// Meu Malvado Favorito 4) to cover both live-action and animation departments.
const JOB_TO_PORTUGUESE: Record<string, string> = {
  // Direction
  Director: "Diretor",
  "Co-Director": "Codiretor",
  "Second Unit Director": "Diretor de segunda unidade",
  "First Assistant Director": "Primeiro assistente de direção",
  "Second Assistant Director": "Segundo assistente de direção",
  "Third Assistant Director": "Terceiro assistente de direção",
  "Second Unit First Assistant Director": "Primeiro assistente de direção da segunda unidade",
  "Script Supervisor": "Continuísta",

  // Writing
  Writer: "Roteirista",
  Screenplay: "Roteirista",
  Story: "Roteirista",
  "Additional Writing": "Roteiro adicional",
  "Writers' Production": "Produção de roteiro",
  Characters: "Personagens",
  "Comic Book": "Quadrinhos originais",

  // Production
  Producer: "Produtor",
  "Executive Producer": "Produtor executivo",
  "Co-Producer": "Coprodutor",
  "Associate Producer": "Produtor associado",
  "Digital Producer": "Produtor digital",
  "Production Supervisor": "Supervisor de produção",
  "Production Manager": "Gerente de produção",
  "Unit Production Manager": "Gerente de produção da unidade",
  "Production Accountant": "Contador de produção",
  "Payroll Accountant": "Contador de folha de pagamento",
  "Post Production Supervisor": "Supervisor de pós-produção",
  "Post Production Coordinator": "Coordenador de pós-produção",
  "Post Production Assistant": "Assistente de pós-produção",
  "Set Production Assistant": "Assistente de produção de set",
  "Additional Production Assistant": "Assistente de produção adicional",
  "Editorial Production Assistant": "Assistente de produção de edição",
  "Assistant Location Manager": "Assistente de gerência de locações",
  "Clearances Coordinator": "Coordenador de autorizações",
  Thanks: "Agradecimentos",
  Other: "Outro",

  // Casting
  Casting: "Diretor de elenco",
  "Location Casting": "Diretor de elenco de locação",
  "Casting Associate": "Associado de elenco",
  "Casting Assistant": "Assistente de elenco",
  "ADR Voice Casting": "Elenco de vozes para ADR",

  // Editing
  Editor: "Editor",
  "First Assistant Editor": "Primeiro assistente de edição",
  "Assistant Editor": "Assistente de edição",
  Colorist: "Colorista",
  "Additional Colorist": "Colorista adicional",

  // Cinematography / camera
  Cinematography: "Diretor de fotografia",
  "Director of Photography": "Diretor de fotografia",
  "Second Unit Director of Photography": "Diretor de fotografia da segunda unidade",
  '"A" Camera Operator': 'Operador de câmera "A"',
  '"B" Camera Operator': 'Operador de câmera "B"',
  "Steadicam Operator": "Operador de steadicam",
  'First Assistant "A" Camera': 'Primeiro assistente de câmera "A"',
  'First Assistant "B" Camera': 'Primeiro assistente de câmera "B"',
  'Second Assistant "A" Camera': 'Segundo assistente de câmera "A"',
  'Second Assistant "B" Camera': 'Segundo assistente de câmera "B"',
  "Camera Trainee": "Estagiário de câmera",
  "Digital Imaging Technician": "Técnico de imagem digital",
  Loader: "Carregador de câmera",

  // Lighting / grip
  Gaffer: "Chefe de elétrica",
  Electrician: "Eletricista",
  "Key Grip": "Chefe de maquinistas",
  "Best Boy Grip": "Assistente-chefe de maquinistas",
  "Standby Rigger": "Montador de equipamentos",

  // Art department
  "Art Direction": "Diretor de arte",
  "Supervising Art Director": "Diretor de arte supervisor",
  "Production Design": "Diretor de produção artística",
  "Set Decoration": "Diretor de cenografia",
  "Property Master": "Chefe de contrarregra",

  // Costume, hair & makeup
  "Costume Design": "Figurinista",
  "Assistant Costume Designer": "Assistente de figurino",
  "Costume Supervisor": "Supervisor de figurino",
  "Costume Coordinator": "Coordenador de figurino",
  Costumer: "Figurinista de set",
  "Makeup Designer": "Maquiador",
  "Makeup Supervisor": "Supervisor de maquiagem",
  "Hair Designer": "Cabeleireiro",
  "Hair Supervisor": "Supervisor de cabelo",

  // Stunts
  Stunts: "Dublê",
  "Stunt Double": "Dublê",
  "Stunt Coordinator": "Coordenador de dublês",
  "Fight Choreographer": "Coreógrafo de lutas",
  Choreography: "Coreógrafo",
  Choreographer: "Coreógrafo",

  // Visual effects
  "Visual Effects": "Efeitos visuais",
  "Visual Effects Producer": "Produtor de efeitos visuais",
  "Executive Visual Effects Producer": "Produtor executivo de efeitos visuais",
  "Visual Effects Supervisor": "Supervisor de efeitos visuais",
  "Visual Effects Coordinator": "Coordenador de efeitos visuais",
  "Visual Effects Editor": "Editor de efeitos visuais",
  "Visual Effects Production Manager": "Gerente de produção de efeitos visuais",
  "Visual Effects Production Assistant": "Assistente de produção de efeitos visuais",
  "VFX Artist": "Artista de VFX",
  "VFX Editor": "Editor de VFX",
  "Effects Supervisor": "Supervisor de efeitos",
  "Special Effects Supervisor": "Supervisor de efeitos especiais",
  "Compositing Supervisor": "Supervisor de composição",
  "Compositing Lead": "Líder de composição",
  "CG Supervisor": "Supervisor de CG",
  "Lighting Artist": "Artista de iluminação",
  "Lighting Supervisor": "Supervisor de iluminação",
  "Imaging Science": "Processamento de imagem",
  Modeling: "Modelagem",

  // Animation
  Animation: "Animação",
  "Animation Supervisor": "Supervisor de animação",
  "Supervising Animator": "Animador supervisor",
  "Lead Animator": "Animador líder",
  "Senior Animator": "Animador sênior",
  "Character Designer": "Designer de personagens",
  "Story Artist": "Artista de história",
  "Head of Story": "Chefe de história",
  "Storyboard Artist": "Artista de storyboard",
  "Additional Storyboarding": "Storyboard adicional",
  "Layout Supervisor": "Supervisor de layout",

  // Sound
  Sound: "Designer de som",
  "Sound Designer": "Desenhista de som",
  "Supervising Sound Editor": "Editor de som supervisor",
  "Sound Effects Editor": "Editor de efeitos sonoros",
  "Sound Re-Recording Mixer": "Mixador de regravação de som",
  "Production Sound Mixer": "Técnico de som direto",
  "Dialogue Editor": "Editor de diálogos",
  "Assistant Sound Editor": "Assistente de edição de som",
  "Foley Artist": "Artista de foley",
  "Foley Supervisor": "Supervisor de foley",
  "Foley Editor": "Editor de foley",
  "Foley Mixer": "Mixador de foley",
  "ADR Mixer": "Mixador de ADR",

  // Music
  "Original Music Composer": "Compositor",
  Songs: "Canções",
  "Music Supervisor": "Supervisor musical",
  "Music Editor": "Editor de música",
  "Music Coordinator": "Coordenador de música",
  "Executive Music Producer": "Produtor musical executivo",
  Orchestrator: "Orquestrador",
  Conductor: "Regente",
  "Vocal Coach": "Preparador vocal",
  Vocals: "Vocais",
}

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
    job: JOB_TO_PORTUGUESE[raw.job] || raw.job,
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

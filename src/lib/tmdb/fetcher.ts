import "server-only";
import { TMDB_API_BASE } from "./constants";
import { getTmdbAccessToken } from "./config";

export class TmdbApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "TmdbApiError";
    this.status = status;
  }
}

type TmdbFetchOptions = {
  searchParams?: Record<string, string | number | undefined>;
  /** Seconds to cache the response for, or `false` to cache indefinitely until tag-revalidated. */
  revalidate: number | false;
  tags: string[];
};

/** Low-level TMDB request. Prefer the cached query functions in `queries.ts` over calling this directly. */
export async function tmdbFetch<T>(path: string, { searchParams, revalidate, tags }: TmdbFetchOptions): Promise<T> {
  const url = new URL(`${TMDB_API_BASE}${path}`);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getTmdbAccessToken()}`,
      accept: "application/json",
    },
    next: { revalidate, tags },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new TmdbApiError(
      res.status,
      body?.status_message ?? `TMDB request to ${path} failed with ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}

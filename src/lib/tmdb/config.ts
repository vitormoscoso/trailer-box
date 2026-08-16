import "server-only";

export function getTmdbAccessToken(): string {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is not set.");
  }
  return token;
}

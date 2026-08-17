import { TMDB_IMAGE_BASE } from "./constants";

export function posterUrl(path: string | null, size: "w342" | "w500" = "w500") {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
}

export function backdropUrl(path: string | null, size: "w1280" | "original" = "original") {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
}

export function profileUrl(path: string | null, size: "w185" | "h632" = "w185") {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
}

export function logoUrl(path: string | null, size: "w92" | "w154" = "w92") {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
}

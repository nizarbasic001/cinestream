import { supabase } from '@/lib/supabase';
import type { Movie } from '@/types';
import type { TMDBSearchResult, TMDBMovieDetail } from '@/types';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function imageUrl(path: string | null, size: string = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export interface TMDBConfig {
  apiKey: string;
}

async function callTMDBEdge(endpoint: string, params: Record<string, string> = {}, language?: string): Promise<unknown> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;

  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb-proxy`);
  url.searchParams.set('endpoint', endpoint);
  if (language) {
    url.searchParams.set('language', language);
  }
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorBody.error || `TMDB request failed (${response.status})`);
  }

  return response.json();
}

export async function searchMoviesTMDB(query: string, language?: string): Promise<TMDBSearchResult[]> {
  if (!query.trim()) return [];
  const data = await callTMDBEdge('search/movie', { query }, language) as { results?: TMDBSearchResult[] };
  return data.results || [];
}

export async function fetchMovieDetailsTMDB(tmdbId: number, language?: string): Promise<TMDBMovieDetail> {
  const data = await callTMDBEdge(`movie/${tmdbId}`, {
    append_to_response: 'credits',
  }, language) as TMDBMovieDetail;
  return data;
}

export async function fetchMovieByImdbIdTMDB(imdbId: string, language?: string): Promise<TMDBMovieDetail | null> {
  try {
    const data = await callTMDBEdge(`find/${imdbId}`, {
      external_source: 'imdb_id',
    }, language) as { movie_results?: TMDBMovieDetail[] };
    const movie = data.movie_results?.[0];
    if (!movie) return null;
    return fetchMovieDetailsTMDB(movie.id, language);
  } catch {
    return null;
  }
}

export function tmdbPosterUrl(path: string | null): string | null {
  return imageUrl(path, 'w500');
}

export function tmdbBackdropUrl(path: string | null): string | null {
  return imageUrl(path, 'w1280');
}

/**
 * Fetch movie details in both English and Arabic from TMDB.
 * Returns combined data for a single movie record.
 */
export async function fetchBilingualMovieDetails(tmdbId: number): Promise<{
  english: TMDBMovieDetail;
  arabic: TMDBMovieDetail | null;
}> {
  const english = await fetchMovieDetailsTMDB(tmdbId, 'en-US');
  let arabic: TMDBMovieDetail | null = null;
  try {
    arabic = await fetchMovieDetailsTMDB(tmdbId, 'ar-SA');
  } catch {
    // Arabic may not be available — leave null
  }
  return { english, arabic };
}

/**
 * Fetch movie details by IMDb ID in both English and Arabic.
 */
export async function fetchBilingualMovieByImdbId(imdbId: string): Promise<{
  english: TMDBMovieDetail;
  arabic: TMDBMovieDetail | null;
} | null> {
  try {
    const data = await callTMDBEdge(`find/${imdbId}`, {
      external_source: 'imdb_id',
    }, 'en-US') as { movie_results?: TMDBMovieDetail[] };
    const movie = data.movie_results?.[0];
    if (!movie) return null;
    return fetchBilingualMovieDetails(movie.id);
  } catch {
    return null;
  }
}

export function mapTMDBToMovieFields(detail: TMDBMovieDetail): Partial<Movie> {
  const director = detail.credits?.crew?.find((c) => c.job === 'Director')?.name || null;
  const cast = detail.credits?.cast?.slice(0, 15).map((c) => c.name) || [];

  return {
    title: detail.title,
    original_title: detail.original_title,
    description: detail.overview,
    poster_url: tmdbPosterUrl(detail.poster_path),
    backdrop_url: tmdbBackdropUrl(detail.backdrop_path),
    release_date: detail.release_date || null,
    year: detail.release_date ? new Date(detail.release_date).getFullYear() : null,
    rating: Math.round(detail.vote_average * 10) / 10,
    runtime: detail.runtime,
    genres: detail.genres?.map((g) => g.name) || [],
    cast_members: cast,
    director,
    imdb_id: detail.imdb_id,
    tmdb_id: detail.id,
  };
}

/**
 * Map bilingual TMDB data into a single movie record with both English and Arabic fields.
 * Arabic fields are left null if TMDB doesn't provide Arabic content.
 */
export function mapBilingualTMDBToMovieFields(
  english: TMDBMovieDetail,
  arabic: TMDBMovieDetail | null
): Partial<Movie> {
  const enDirector = english.credits?.crew?.find((c) => c.job === 'Director')?.name || null;
  const enCast = english.credits?.cast?.slice(0, 15).map((c) => c.name) || [];

  const arDirector = arabic?.credits?.crew?.find((c) => c.job === 'Director')?.name || null;
  const arCast = arabic?.credits?.cast?.slice(0, 15).map((c) => c.name) || [];

  const arGenres = arabic?.genres?.map((g) => g.name) || null;
  const arTitle = arabic?.title || null;
  const arOverview = arabic?.overview || null;

  return {
    title: english.title,
    title_ar: arTitle,
    original_title: english.original_title,
    description: english.overview,
    description_ar: arOverview,
    poster_url: tmdbPosterUrl(english.poster_path),
    backdrop_url: tmdbBackdropUrl(english.backdrop_path),
    release_date: english.release_date || null,
    year: english.release_date ? new Date(english.release_date).getFullYear() : null,
    rating: Math.round(english.vote_average * 10) / 10,
    runtime: english.runtime,
    genres: english.genres?.map((g) => g.name) || [],
    genres_ar: arGenres && arGenres.length > 0 ? arGenres : null,
    cast_members: enCast,
    cast_ar: arCast && arCast.length > 0 ? arCast : null,
    director: enDirector,
    director_ar: arDirector,
    imdb_id: english.imdb_id,
    tmdb_id: english.id,
  };
}

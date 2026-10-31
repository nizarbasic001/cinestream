import type { Movie } from '@/types';

export const ALL_GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Animation',
  'Thriller',
  'Adventure',
  'Fantasy',
  'Family',
  'Romance',
  'Mystery',
  'Short',
];

export function filterByGenre(movies: Movie[], genre: string): Movie[] {
  return movies.filter((m) => m.genres.includes(genre));
}

export function sortByRating(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => b.rating - a.rating);
}

export function sortByYear(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => (b.year || 0) - (a.year || 0));
}

export function sortByRecent(movies: Movie[]): Movie[] {
  return [...movies].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getFeatured(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.featured);
}

export function formatRuntime(runtime: number | null): string {
  if (!runtime) return '';
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function validateMagnetLink(link: string): boolean {
  if (!link || typeof link !== 'string') return false;
  return /^magnet:\?xt=urn:btih:[a-zA-Z0-9]+/i.test(link.trim());
}

import type { Language } from '@/i18n';

export function getMovieTitle(movie: Movie, lang: Language): string {
  if (lang === 'ar' && movie.title_ar) return movie.title_ar;
  return movie.title;
}

export function getMovieDescription(movie: Movie, lang: Language): string | null {
  if (lang === 'ar' && movie.description_ar) return movie.description_ar;
  return movie.description;
}

export function getMovieGenres(movie: Movie, lang: Language): string[] {
  if (lang === 'ar' && movie.genres_ar && movie.genres_ar.length > 0) return movie.genres_ar;
  return movie.genres;
}

export function getMovieDirector(movie: Movie, lang: Language): string | null {
  if (lang === 'ar' && movie.director_ar) return movie.director_ar;
  return movie.director;
}

export function getMovieCast(movie: Movie, lang: Language): string[] {
  if (lang === 'ar' && movie.cast_ar && movie.cast_ar.length > 0) return movie.cast_ar;
  return movie.cast_members;
}

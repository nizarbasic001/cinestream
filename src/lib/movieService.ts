import { supabase } from '@/lib/supabase';
import type { Movie, Favorite, WatchHistoryEntry } from '@/types';

function handleError(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
}

export async function fetchPublishedMovies(): Promise<{ data: Movie[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) return { data: null, error: handleError(error, 'Failed to fetch movies') };
  return { data: data as Movie[], error: null };
}

export async function fetchMovieById(id: string): Promise<{ data: Movie | null; error: string | null }> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) return { data: null, error: handleError(error, 'Failed to fetch movie') };
  return { data: data as Movie | null, error: null };
}

export async function fetchAllMoviesForAdmin(): Promise<{ data: Movie[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { data: null, error: handleError(error, 'Failed to fetch movies') };
  return { data: data as Movie[], error: null };
}

export async function createMovie(movie: Partial<Movie>): Promise<{ data: Movie | null; error: string | null }> {
  const { data, error } = await supabase
    .from('movies')
    .insert(movie)
    .select()
    .single();
  if (error) return { data: null, error: handleError(error, 'Failed to create movie') };
  return { data: data as Movie, error: null };
}

export async function updateMovie(id: string, updates: Partial<Movie>): Promise<{ data: Movie | null; error: string | null }> {
  const { data, error } = await supabase
    .from('movies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) return { data: null, error: handleError(error, 'Failed to update movie') };
  return { data: data as Movie, error: null };
}

export async function deleteMovie(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('movies').delete().eq('id', id);
  if (error) return { error: handleError(error, 'Failed to delete movie') };
  return { error: null };
}

export async function fetchFavorites(): Promise<{ data: Favorite[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, movie:movies(*)')
    .order('created_at', { ascending: false });
  if (error) return { data: null, error: handleError(error, 'Failed to fetch favorites') };
  return { data: data as Favorite[], error: null };
}

export async function isFavorite(movieId: string): Promise<boolean> {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('movie_id', movieId)
    .maybeSingle();
  return !!data;
}

export async function addFavorite(movieId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('favorites').insert({ movie_id: movieId });
  if (error) {
    if (error.code === '23505') return { error: null };
    return { error: handleError(error, 'Failed to add favorite') };
  }
  return { error: null };
}

export async function removeFavorite(movieId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('favorites').delete().eq('movie_id', movieId);
  if (error) return { error: handleError(error, 'Failed to remove favorite') };
  return { error: null };
}

export async function fetchWatchHistory(): Promise<{ data: WatchHistoryEntry[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('watch_history')
    .select('*, movie:movies(*)')
    .order('last_watched_at', { ascending: false });
  if (error) return { data: null, error: handleError(error, 'Failed to fetch history') };
  return { data: data as WatchHistoryEntry[], error: null };
}

export async function updateWatchHistory(movieId: string, progress: number): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('watch_history')
    .upsert(
      {
        movie_id: movieId,
        progress,
        last_watched_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,movie_id' }
    );
  if (error) return { error: handleError(error, 'Failed to update history') };
  return { error: null };
}

export async function fetchAllProfiles(): Promise<{ data: { id: string; email: string; display_name: string | null; role: string; created_at: string }[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, display_name, role, created_at')
    .order('created_at', { ascending: false });
  if (error) return { data: null, error: handleError(error, 'Failed to fetch users') };
  return { data, error: null };
}

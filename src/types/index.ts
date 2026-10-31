export interface Movie {
  id: string;
  title: string;
  title_ar: string | null;
  original_title: string | null;
  description: string | null;
  description_ar: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  release_date: string | null;
  year: number | null;
  rating: number;
  runtime: number | null;
  genres: string[];
  genres_ar: string[] | null;
  cast_members: string[];
  cast_ar: string[] | null;
  director: string | null;
  director_ar: string | null;
  imdb_id: string | null;
  tmdb_id: number | null;
  magnet_link: string | null;
  stream_url: string | null;
  subtitle_url: string | null;
  language: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  movie_id: string;
  created_at: string;
  movie?: Movie;
}

export interface WatchHistoryEntry {
  id: string;
  user_id: string;
  movie_id: string;
  progress: number;
  last_watched_at: string;
  created_at: string;
  movie?: Movie;
}

export type PlayerStatus =
  | 'idle'
  | 'connecting'
  | 'finding_peers'
  | 'loading'
  | 'buffering'
  | 'playing'
  | 'paused'
  | 'error';

export interface TMDBSearchResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  imdb_id?: string;
}

export interface TMDBMovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: { id: number; name: string }[];
  imdb_id: string | null;
  credits?: {
    cast: { id: number; name: string; character: string }[];
    crew: { id: number; name: string; job: string }[];
  };
}

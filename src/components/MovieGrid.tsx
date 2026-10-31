import { Star } from 'lucide-react';
import type { Movie } from '@/types';
import { MovieCard } from './MovieCard';
import { useNavigate } from 'react-router-dom';

interface MovieGridProps {
  movies: Movie[];
  emptyMessage?: string;
  responsive?: boolean;
}

export function MovieGrid({
  movies,
  emptyMessage = 'No movies available',
  responsive = false,
}: MovieGridProps) {
  const navigate = useNavigate();

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Star className="w-12 h-12 text-cs-text-muted/30 mb-4" />
        <p className="text-cs-text-muted text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={
        responsive
          ? 'grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7 gap-3 md:gap-4'
          : 'flex flex-wrap gap-3 md:gap-4'
      }
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => navigate(`/movie/${movie.id}`)}
          fluid={responsive}
        />
      ))}
    </div>
  );
}
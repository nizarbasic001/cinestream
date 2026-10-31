import { Star, Play } from 'lucide-react';
import type { Movie } from '@/types';
import { useI18n } from '@/i18n';
import { getMovieTitle, getMovieGenres } from '@/lib/movieUtils';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const { t, lang } = useI18n();
  const title = getMovieTitle(movie, lang);
  const genres = getMovieGenres(movie, lang);

  return (
    <button
      onClick={onClick}
      className="group relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] text-start transition-smooth"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-cs-surface card-shadow card-shadow-hover transition-smooth">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cs-surface">
            <Play className="w-12 h-12 text-cs-text-muted/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-cs-primary/90 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-5 h-5 text-white" fill="white" />
          </div>
        </div>

        <div className="absolute top-2 end-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-1">
          <Star className="w-3 h-3 text-cs-accent" fill="currentColor" />
          <span className="text-xs font-semibold text-white">{movie.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-semibold text-cs-text truncate group-hover:text-cs-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          {movie.year && <span className="text-xs text-cs-text-muted">{movie.year}</span>}
          {genres.length > 0 && (
            <>
              <span className="text-cs-text-muted/40">•</span>
              <span className="text-xs text-cs-text-muted truncate">{genres[0]}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

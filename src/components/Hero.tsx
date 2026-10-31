import { Play, Info, Star, Calendar } from 'lucide-react';
import type { Movie } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { getMovieTitle, getMovieDescription, getMovieGenres } from '@/lib/movieUtils';

interface HeroProps {
  movie: Movie;
}

export function Hero({ movie }: HeroProps) {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const title = getMovieTitle(movie, lang);
  const description = getMovieDescription(movie, lang);
  const genres = getMovieGenres(movie, lang);

  return (
    <div className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full">
      {movie.backdrop_url && (
        <img
          src={movie.backdrop_url}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-gradient-side" />

      <div className="relative h-full flex items-end pb-12 md:pb-20">
        <div className="px-4 md:px-8 lg:px-12 max-w-3xl">
          <div className="flex gap-4 md:gap-6 mb-4 md:mb-6 animate-fade-in">
            {movie.poster_url && (
              <img
                src={movie.poster_url}
                alt={title}
                className="w-24 h-36 md:w-32 md:h-48 rounded-lg object-cover card-shadow hidden sm:block"
              />
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-3 leading-tight">
                {title}
              </h1>

              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-base md:text-lg text-cs-text-muted mb-2 md:mb-3">
                  {movie.original_title}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-cs-accent" fill="currentColor" />
                      <span className="text-sm font-semibold text-white">{movie.rating.toFixed(1)}</span>
                    </div>
                    {movie.year && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cs-text-muted" />
                        <span className="text-sm text-cs-text-muted">{movie.year}</span>
                      </div>
                    )}
                    {genres.length > 0 && (
                      <span className="text-sm text-cs-text-muted">
                        {genres.slice(0, 3).join(' • ')}
                      </span>
                    )}
              </div>

              <p className="text-sm md:text-base text-cs-text/80 line-clamp-3 mb-4 md:mb-6 max-w-xl">
                {description || ''}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/watch/${movie.id}`)}
                  className="flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-cs-primary hover:bg-cs-primary-dark rounded-lg font-semibold text-white transition-smooth"
                >
                  <Play className="w-5 h-5" fill="white" />
                  {t('hero.watchNow')}
                </button>
                <button
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold text-white transition-smooth"
                >
                  <Info className="w-5 h-5" />
                  {t('hero.moreInfo')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, Play, Heart, ArrowLeft, Film, User } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMovieById, isFavorite, addFavorite, removeFavorite, updateWatchHistory } from '@/lib/movieService';
import { getMovieTitle, getMovieDescription, getMovieGenres, getMovieDirector, getMovieCast, formatRuntime } from '@/lib/movieUtils';
import type { Movie } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { session } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await fetchMovieById(id);
      if (error) {
        setError(error);
      } else if (data) {
        setMovie(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    const checkFav = async () => {
      if (!session || !id) return;
      const fav = await isFavorite(id);
      setIsFav(fav);
    };
    checkFav();
  }, [session, id]);

  const handleFavorite = async () => {
    if (!session || !id) return;
    setFavLoading(true);
    if (isFav) {
      await removeFavorite(id);
      setIsFav(false);
    } else {
      await addFavorite(id);
      setIsFav(true);
    }
    setFavLoading(false);
  };

  const handleWatch = () => {
    if (!id) return;
    if (session) {
      updateWatchHistory(id, 0);
    }
    navigate(`/watch/${id}`);
  };

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;

  if (error || !movie) {
    return (
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <ErrorState message={error || t('common.movieNotFound')} onRetry={() => navigate('/')} />
      </div>
    );
  }

  const title = getMovieTitle(movie, lang);
  const description = getMovieDescription(movie, lang);
  const genres = getMovieGenres(movie, lang);
  const director = getMovieDirector(movie, lang);
  const cast = getMovieCast(movie, lang);

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[320px] w-full">
        {movie.backdrop_url && (
          <img
            src={movie.backdrop_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cs-bg via-cs-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cs-bg/80 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 start-4 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-black/70 transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('player.back')}
        </button>
      </div>

      {/* Content */}
      <div className="relative -mt-32 px-4 md:px-8 lg:px-12 pb-12">
        <div className="flex flex-col md:flex-row gap-6 max-w-5xl">
          {movie.poster_url && (
            <img
              src={movie.poster_url}
              alt={title}
              className="w-32 h-48 md:w-44 md:h-66 rounded-xl object-cover card-shadow flex-shrink-0"
            />
          )}

          <div className="flex-1 min-w-0 pt-4 md:pt-16">
            <h1 className="text-3xl md:text-4xl font-bold text-cs-text mb-2 leading-tight">
              {title}
            </h1>

            {movie.original_title && movie.original_title !== title && (
              <p className="text-cs-text-muted text-base mb-3">{movie.original_title}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-cs-accent" fill="currentColor" />
                <span className="text-lg font-semibold text-cs-text">{movie.rating.toFixed(1)}</span>
              </div>
              {movie.year && (
                <div className="flex items-center gap-1.5 text-cs-text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1.5 text-cs-text-muted">
                  <Clock className="w-4 h-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-cs-surface border border-cs-border rounded-full text-xs font-medium text-cs-text-muted"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {description && (
              <p className="text-cs-text/80 text-base leading-relaxed mb-6 max-w-2xl">
                {description}
              </p>
            )}

            <div className="space-y-3 mb-6">
              {director && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cs-text-muted" />
                  <span className="text-cs-text-muted text-sm">{t('details.director')}:</span>
                  <span className="text-cs-text text-sm">{director}</span>
                </div>
              )}
              {cast.length > 0 && (
                <div className="flex items-start gap-2">
                  <Film className="w-4 h-4 text-cs-text-muted flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-cs-text-muted text-sm">{t('details.cast')}: </span>
                    <span className="text-cs-text text-sm">{cast.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleWatch}
                disabled={!movie.imdb_id && !movie.stream_url}
                className="flex items-center gap-2 px-7 py-3 bg-cs-primary hover:bg-cs-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-smooth"
              >
                <Play className="w-5 h-5" fill="white" />
                {t('hero.watchNow')}
              </button>

              {session && (
                <button
                  onClick={handleFavorite}
                  disabled={favLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-smooth border ${
                    isFav
                      ? 'bg-cs-primary/20 text-cs-primary border-cs-primary/30'
                      : 'bg-cs-surface text-cs-text hover:bg-cs-surface-hover border-cs-border'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                  {isFav ? t('details.removeFavorites') : t('details.addFavorites')}
                </button>
              )}
            </div>

            {!movie.imdb_id && !movie.stream_url && (
              <p className="text-cs-text-muted text-sm mt-3">{t('player.noImdb')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

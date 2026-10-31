import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMovieById, updateWatchHistory } from '@/lib/movieService';
import { getMovieTitle } from '@/lib/movieUtils';
import type { Movie } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { session } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data } = await fetchMovieById(id);
      if (data) {
        setMovie(data);
        if (session) {
          updateWatchHistory(data.id, 0);
        }
      }
      setLoading(false);
    };
    load();
  }, [id, session]);

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <AlertCircle className="w-12 h-12 text-cs-text-muted/30 mb-4" />
        <p className="text-cs-text-muted text-lg">{t('common.movieNotFound')}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-5 py-2.5 bg-cs-primary hover:bg-cs-primary-dark rounded-lg text-sm font-semibold text-white transition-smooth"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const title = getMovieTitle(movie, lang);
  const embedUrl = movie.stream_url && movie.stream_url.trim()
    ? movie.stream_url.trim()
    : movie.imdb_id
      ? `https://vidsrc.sh/embed/movie/${movie.imdb_id}`
      : null;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
        {/* Back button */}
        <button
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-smooth mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('player.back')}
        </button>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h1>

        {/* VidSrc iframe player */}
        {embedUrl ? (
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative">
            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-cs-primary mx-auto mb-3" />
                  <p className="text-white/60 text-sm">{t('player.loadingPlayer')}</p>
                </div>
              </div>
            )}
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              title={title}
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        ) : (
          <div className="w-full aspect-video bg-cs-surface rounded-xl flex items-center justify-center">
            <div className="text-center px-4">
              <AlertCircle className="w-10 h-10 text-cs-text-muted/40 mx-auto mb-3" />
              <p className="text-cs-text-muted text-sm">{t('player.noImdb')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

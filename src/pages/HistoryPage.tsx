import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { fetchWatchHistory } from '@/lib/movieService';
import { getMovieTitle } from '@/lib/movieUtils';
import type { WatchHistoryEntry } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { History as HistoryIcon, Play } from 'lucide-react';

export function HistoryPage() {
  const { t, lang } = useI18n();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      const { data } = await fetchWatchHistory();
      if (data) setHistory(data);
      setLoading(false);
    };
    load();
  }, [session]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <HistoryIcon className="w-12 h-12 text-cs-text-muted/30 mb-4" />
        <p className="text-cs-text-muted text-lg">{t('common.loginRequired')}</p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HistoryIcon className="w-7 h-7 text-cs-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-cs-text">{t('history.title')}</h1>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <HistoryIcon className="w-12 h-12 text-cs-text-muted/30 mb-4" />
          <p className="text-cs-text text-lg font-semibold mb-1">{t('history.empty')}</p>
          <p className="text-cs-text-muted text-sm">{t('history.emptyDesc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => {
            const movie = entry.movie;
            if (!movie) return null;
            return (
              <button
                key={entry.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="w-full flex items-center gap-4 bg-cs-surface hover:bg-cs-surface-hover rounded-xl p-3 transition-smooth text-start"
              >
                {movie.poster_url && (
                  <img
                    src={movie.poster_url}
                    alt={getMovieTitle(movie, lang)}
                    className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-cs-text font-semibold truncate">{getMovieTitle(movie, lang)}</h3>
                  {movie.year && <p className="text-sm text-cs-text-muted">{movie.year}</p>}
                  {entry.progress > 0 && (
                    <div className="mt-2">
                      <div className="h-1 bg-cs-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cs-primary"
                          style={{ width: `${Math.min((entry.progress / ((movie.runtime ?? 0) * 60 || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-cs-text-muted mt-1">{t('history.continueWatching')}</p>
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-cs-primary/20 flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-cs-primary" fill="currentColor" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { fetchFavorites } from '@/lib/movieService';
import type { Favorite } from '@/types';
import { MovieGrid } from '@/components/MovieGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Heart } from 'lucide-react';

export function FavoritesPage() {
  const { t } = useI18n();
  const { session } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      const { data } = await fetchFavorites();
      if (data) setFavorites(data);
      setLoading(false);
    };
    load();
  }, [session]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Heart className="w-12 h-12 text-cs-text-muted/30 mb-4" />
        <p className="text-cs-text-muted text-lg">{t('common.loginRequired')}</p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;

  const movies = favorites.map((f) => f.movie).filter(Boolean);

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-7 h-7 text-cs-primary" fill="currentColor" />
        <h1 className="text-2xl md:text-3xl font-bold text-cs-text">{t('favorites.title')}</h1>
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-12 h-12 text-cs-text-muted/30 mb-4" />
          <p className="text-cs-text text-lg font-semibold mb-1">{t('favorites.empty')}</p>
          <p className="text-cs-text-muted text-sm">{t('favorites.emptyDesc')}</p>
        </div>
      ) : (
        <MovieGrid movies={movies as NonNullable<typeof movies[0]>[]} emptyMessage={t('favorites.empty')} />
      )}
    </div>
  );
}

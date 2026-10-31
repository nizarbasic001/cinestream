import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/i18n';
import { fetchPublishedMovies } from '@/lib/movieService';
import type { Movie } from '@/types';
import { MovieGrid } from '@/components/MovieGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { sortByRating, sortByYear, sortByRecent } from '@/lib/movieUtils';
import { ChevronDown } from 'lucide-react';

type SortOption = 'rating' | 'year' | 'recent';

export function MoviesPage() {
  const { t } = useI18n();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [sortOpen, setSortOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchPublishedMovies();
    if (error) {
      setError(error);
    } else if (data) {
      setMovies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const sortedMovies = useMemo(() => {
    if (sortBy === 'rating') return sortByRating(movies);
    if (sortBy === 'year') return sortByYear(movies);
    return sortByRecent(movies);
  }, [movies, sortBy]);

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-cs-text">{t('nav.movies')}</h1>
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-cs-surface hover:bg-cs-surface-hover rounded-lg text-sm font-medium text-cs-text transition-smooth"
          >
            {sortBy === 'rating' ? t('section.popular') : sortBy === 'year' ? t('section.latest') : t('section.trending')}
            <ChevronDown className="w-4 h-4" />
          </button>
          {sortOpen && (
            <div className="absolute end-0 mt-2 w-44 bg-cs-surface border border-cs-border rounded-lg shadow-xl z-20 py-1">
              <button
                onClick={() => { setSortBy('rating'); setSortOpen(false); }}
                className="w-full text-start px-4 py-2 text-sm text-cs-text hover:bg-cs-surface-hover transition-smooth"
              >
                {t('section.popular')}
              </button>
              <button
                onClick={() => { setSortBy('year'); setSortOpen(false); }}
                className="w-full text-start px-4 py-2 text-sm text-cs-text hover:bg-cs-surface-hover transition-smooth"
              >
                {t('section.latest')}
              </button>
              <button
                onClick={() => { setSortBy('recent'); setSortOpen(false); }}
                className="w-full text-start px-4 py-2 text-sm text-cs-text hover:bg-cs-surface-hover transition-smooth"
              >
                {t('section.trending')}
              </button>
            </div>
          )}
        </div>
      </div>

      <MovieGrid movies={sortedMovies} emptyMessage={t('common.noMovies')} />
    </div>
  );
}

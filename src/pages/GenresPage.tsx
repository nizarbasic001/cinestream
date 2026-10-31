import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/i18n';
import { fetchPublishedMovies } from '@/lib/movieService';
import { ALL_GENRES, filterByGenre } from '@/lib/movieUtils';
import type { Movie } from '@/types';
import { MovieGrid } from '@/components/MovieGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { Tags } from 'lucide-react';

export function GenresPage() {
  const { t } = useI18n();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

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

  const availableGenres = useMemo(() => {
    const found = new Set<string>();
    movies.forEach((m) => m.genres.forEach((g) => found.add(g)));
    return ALL_GENRES.filter((g) => found.has(g));
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (!selectedGenre) return movies;
    return filterByGenre(movies, selectedGenre);
  }, [movies, selectedGenre]);

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Tags className="w-7 h-7 text-cs-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-cs-text">{t('nav.genres')}</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedGenre(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
            !selectedGenre
              ? 'bg-cs-primary text-white'
              : 'bg-cs-surface text-cs-text-muted hover:text-cs-text hover:bg-cs-surface-hover'
          }`}
        >
          {t('common.allGenres')}
        </button>
        {availableGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
              selectedGenre === genre
                ? 'bg-cs-primary text-white'
                : 'bg-cs-surface text-cs-text-muted hover:text-cs-text hover:bg-cs-surface-hover'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <MovieGrid movies={filteredMovies} emptyMessage={t('common.noMovies')} />
    </div>
  );
}

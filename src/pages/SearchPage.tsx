import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { fetchPublishedMovies } from '@/lib/movieService';
import type { Movie } from '@/types';
import { MovieGrid } from '@/components/MovieGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Search as SearchIcon } from 'lucide-react';

export function SearchPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await fetchPublishedMovies();
      if (data) setMovies(data);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(localQuery);
      if (localQuery) {
        setSearchParams({ q: localQuery });
      } else {
        setSearchParams({});
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localQuery, setSearchParams]);

  const results = useMemo(() => {
    if (!query.trim()) return movies;
    const q = query.toLowerCase().trim();
    return movies.filter((m) => {
      return (
        m.title.toLowerCase().includes(q) ||
        (m.original_title?.toLowerCase().includes(q) ?? false) ||
        (m.year?.toString().includes(q) ?? false) ||
        m.genres.some((g) => g.toLowerCase().includes(q))
      );
    });
  }, [movies, query]);

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cs-text-muted" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            autoFocus
            className="w-full ps-12 pe-4 py-3.5 bg-cs-surface border border-cs-border rounded-xl text-cs-text placeholder:text-cs-text-muted focus:outline-none focus:border-cs-primary/50 focus:ring-2 focus:ring-cs-primary/20 transition-smooth"
          />
        </div>
      </div>

      {query.trim() && (
        <h2 className="text-lg font-semibold text-cs-text mb-4">
          {t('search.results')} ({results.length})
        </h2>
      )}

      {loading ? (
        <LoadingSpinner size="lg" label={t('common.loading')} />
      ) : results.length === 0 && query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <SearchIcon className="w-12 h-12 text-cs-text-muted/30 mb-4" />
          <p className="text-cs-text text-lg font-semibold mb-1">{t('search.noResults')}</p>
          <p className="text-cs-text-muted text-sm">{t('search.tryDifferent')}</p>
        </div>
      ) : (
        <MovieGrid movies={results} emptyMessage={t('common.noMovies')} />
      )}
    </div>
  );
}

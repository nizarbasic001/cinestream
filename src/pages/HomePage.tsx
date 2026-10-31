import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/i18n';
import { fetchPublishedMovies } from '@/lib/movieService';
import { getFeatured, sortByRating, sortByRecent, sortByYear, filterByGenre } from '@/lib/movieUtils';
import type { Movie } from '@/types';
import { Hero } from '@/components/Hero';
import { MovieRow } from '@/components/MovieRow';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';

export function HomePage() {
  const { t } = useI18n();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const heroMovie = useMemo(() => {
    const featured = getFeatured(movies);
    if (featured.length > 0) return featured[0];
    if (movies.length > 0) return sortByRating(movies)[0];
    return null;
  }, [movies]);

  const rows = useMemo(() => {
    if (movies.length === 0) return [];

    const featured = getFeatured(movies);
    const latest = sortByRecent(movies);
    const popular = sortByRating(movies);
    const trending = sortByYear(movies.filter((m) => m.rating >= 7));
    const recommended = sortByRating(movies.filter((m) => !m.featured));

    return [
      { title: t('section.featured'), movies: featured.length > 0 ? featured : latest.slice(0, 10) },
      { title: t('section.latest'), movies: latest },
      { title: t('section.popular'), movies: popular },
      { title: t('section.trending'), movies: trending },
      { title: t('section.recommended'), movies: recommended },
      { title: t('section.action'), movies: filterByGenre(movies, 'Action') },
      { title: t('section.comedy'), movies: filterByGenre(movies, 'Comedy') },
      { title: t('section.drama'), movies: filterByGenre(movies, 'Drama') },
      { title: t('section.horror'), movies: filterByGenre(movies, 'Horror') },
      { title: t('section.scifi'), movies: filterByGenre(movies, 'Sci-Fi') },
      { title: t('section.animation'), movies: filterByGenre(movies, 'Animation') },
      { title: t('section.thriller'), movies: filterByGenre(movies, 'Thriller') },
    ].filter((row) => row.movies.length > 0);
  }, [movies, t]);

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (movies.length === 0) return <ErrorState message={t('common.noMovies')} />;

  return (
    <div>
      {heroMovie && <Hero movie={heroMovie} />}
      <div className="py-8 md:py-10">
        {rows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))}
      </div>
    </div>
  );
}

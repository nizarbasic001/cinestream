import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllMoviesForAdmin, deleteMovie, updateMovie } from '@/lib/movieService';
import { fetchBilingualMovieDetails, mapBilingualTMDBToMovieFields } from '@/lib/tmdbService';
import type { Movie } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, AlertCircle, RotateCcw, RefreshCw, CheckCircle2 } from 'lucide-react';

export function AdminMovies() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { session, isAdmin, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [batchUpdating, setBatchUpdating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
  const [batchResult, setBatchResult] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchAllMoviesForAdmin();
    if (error) {
      setError(error);
    } else if (data) {
      setMovies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!session || !isAdmin) return;
    load();
  }, [session, isAdmin, authLoading]);

  const filtered = useMemo(() => {
    let result = movies;
    if (yearFilter !== 'all') {
      result = result.filter((m) => String(m.year) === yearFilter);
    }
    if (!search.trim()) return result;
    const q = search.toLowerCase();
    return result.filter((m) =>
      m.title.toLowerCase().includes(q) ||
      (m.original_title?.toLowerCase().includes(q) ?? false) ||
      m.genres.some((g) => g.toLowerCase().includes(q)) ||
      String(m.year || '').includes(q)
    );
  }, [movies, search, yearFilter]);

  const availableYears = useMemo(() => {
    const years = movies
      .map((m) => m.year)
      .filter((y): y is number => y !== null && y !== undefined)
      .sort((a, b) => b - a);
    return [...new Set(years)];
  }, [movies]);

  const handleDelete = async (id: string) => {
    await deleteMovie(id);
    setConfirmDelete(null);
    load();
  };

  const handleTogglePublish = async (movie: Movie) => {
    await updateMovie(movie.id, { published: !movie.published });
    load();
  };

  const handleUpdateAllTMDB = async () => {
    if (!window.confirm(t('admin.updateAllConfirm'))) return;
    const targets = filtered.filter((m) => m.tmdb_id);
    if (targets.length === 0) return;

    setBatchUpdating(true);
    setBatchResult(null);
    setBatchProgress({ done: 0, total: targets.length });

    let done = 0;
    let failed = 0;

    for (const movie of targets) {
      try {
        const bilingual = await fetchBilingualMovieDetails(movie.tmdb_id!);
        const mapped = mapBilingualTMDBToMovieFields(bilingual.english, bilingual.arabic);
        await updateMovie(movie.id, {
          ...mapped,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`Failed to update movie ${movie.id}:`, err);
        failed++;
      }
      done++;
      setBatchProgress({ done, total: targets.length });
    }

    if (failed > 0) {
      setBatchResult(t('admin.updateAllFailed').replace('{count}', String(failed)));
    } else {
      setBatchResult(t('admin.updateAllDone').replace('{done}', String(done)).replace('{total}', String(targets.length)));
    }
    setBatchUpdating(false);
    load();
  };

  if (authLoading || loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-14 h-14 rounded-full bg-cs-error/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-cs-error" />
        </div>
        <p className="text-cs-text font-semibold mb-2">{t('common.error')}</p>
        <p className="text-cs-text-muted text-sm mb-6 max-w-md text-center">{error}</p>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 px-5 py-2.5 bg-cs-primary hover:bg-cs-primary-dark rounded-lg text-sm font-semibold text-white transition-smooth"
        >
          <RotateCcw className="w-4 h-4" />
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-cs-text">{t('admin.movies')}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdateAllTMDB}
            disabled={batchUpdating || filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-cs-primary/10 hover:bg-cs-primary/20 border border-cs-primary/30 disabled:opacity-50 rounded-lg text-sm font-semibold text-cs-primary transition-smooth whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${batchUpdating ? 'animate-spin' : ''}`} />
            {batchUpdating
              ? t('admin.updateAllProgress').replace('{done}', String(batchProgress.done)).replace('{total}', String(batchProgress.total))
              : t('admin.updateAll')}
          </button>
          <button
            onClick={() => navigate('/admin/movies/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cs-primary hover:bg-cs-primary-dark rounded-lg text-sm font-semibold text-white transition-smooth"
          >
            <Plus className="w-4 h-4" />
            {t('admin.addMovie')}
          </button>
        </div>
      </div>

      {batchResult && !batchUpdating && (
        <div className="flex items-center gap-2 px-4 py-3 bg-cs-success/10 border border-cs-success/20 rounded-lg mb-4">
          <CheckCircle2 className="w-4 h-4 text-cs-success flex-shrink-0" />
          <p className="text-sm text-cs-success">{batchResult}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cs-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admin.searchMovies')}
            className="w-full ps-10 pe-4 py-2.5 bg-cs-surface border border-cs-border rounded-lg text-cs-text placeholder:text-cs-text-muted focus:outline-none focus:border-cs-primary/50 focus:ring-2 focus:ring-cs-primary/20 transition-smooth"
          />
        </div>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2.5 bg-cs-surface border border-cs-border rounded-lg text-cs-text focus:outline-none focus:border-cs-primary/50 focus:ring-2 focus:ring-cs-primary/20 transition-smooth cursor-pointer"
        >
          <option value="all">{t('common.allYears')}</option>
          {availableYears.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>

      <div className="bg-cs-surface border border-cs-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cs-border text-start">
                <th className="text-start px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider">{t('admin.movieTitle')}</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider hidden md:table-cell">{t('admin.genres')}</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider hidden sm:table-cell">Year</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider">Status</th>
                <th className="text-end px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((movie) => (
                <tr key={movie.id} className="border-b border-cs-border/50 hover:bg-cs-surface-hover transition-smooth">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {movie.poster_url && (
                        <img src={movie.poster_url} alt={movie.title} className="w-9 h-12 rounded object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-cs-text truncate">{movie.title}</p>
                        {(movie.magnet_link || movie.stream_url) && (
                          <p className="text-xs text-cs-success flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cs-success" />
                            Has stream
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-cs-text-muted">{movie.genres.join(', ')}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-cs-text-muted">{movie.year || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(movie)}
                      className={`text-xs px-2 py-1 rounded font-medium transition-smooth ${
                        movie.published
                          ? 'bg-cs-success/20 text-cs-success hover:bg-cs-success/30'
                          : 'bg-cs-warning/20 text-cs-warning hover:bg-cs-warning/30'
                      }`}
                    >
                      {movie.published ? t('admin.published') : t('admin.unpublished')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/movies/${movie.id}`)}
                        className="p-2 text-cs-text-muted hover:text-cs-text hover:bg-cs-bg rounded-lg transition-smooth"
                        title={t('admin.edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(movie.id)}
                        className="p-2 text-cs-text-muted hover:text-cs-error hover:bg-cs-error/10 rounded-lg transition-smooth"
                        title={t('admin.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-cs-text-muted text-sm">{t('common.noMovies')}</p>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-cs-surface border border-cs-border rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cs-error/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-cs-error" />
              </div>
              <p className="text-cs-text font-semibold">{t('admin.confirmDelete')}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 bg-cs-bg hover:bg-cs-surface-hover rounded-lg text-sm font-medium text-cs-text transition-smooth"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 bg-cs-error hover:bg-red-600 rounded-lg text-sm font-semibold text-white transition-smooth"
              >
                {t('admin.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

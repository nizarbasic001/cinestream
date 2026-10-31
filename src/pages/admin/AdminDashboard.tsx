import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllMoviesForAdmin, fetchAllProfiles } from '@/lib/movieService';
import type { Movie } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Film, Eye, EyeOff, Users, Plus, Clock, AlertCircle, RotateCcw } from 'lucide-react';

interface ProfileInfo {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
}

export function AdminDashboard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { session, isAdmin, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<ProfileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!session || !isAdmin) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      const [movieResult, userResult] = await Promise.all([
        fetchAllMoviesForAdmin(),
        fetchAllProfiles(),
      ]);
      if (movieResult.error) {
        setError(movieResult.error);
      } else if (movieResult.data) {
        setMovies(movieResult.data);
      }
      if (userResult.data) setUsers(userResult.data);
      setLoading(false);
    };
    load();
  }, [session, isAdmin, authLoading]);

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
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2.5 bg-cs-primary hover:bg-cs-primary-dark rounded-lg text-sm font-semibold text-white transition-smooth"
        >
          <RotateCcw className="w-4 h-4" />
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const published = movies.filter((m) => m.published).length;
  const unpublished = movies.length - published;
  const recent = [...movies].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const stats = [
    { label: t('admin.totalMovies'), value: movies.length, icon: Film, color: 'text-cs-primary' },
    { label: t('admin.published'), value: published, icon: Eye, color: 'text-cs-success' },
    { label: t('admin.unpublished'), value: unpublished, icon: EyeOff, color: 'text-cs-warning' },
    { label: t('admin.totalUsers'), value: users.length, icon: Users, color: 'text-cs-accent' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-cs-text mb-6">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-cs-surface border border-cs-border rounded-xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-cs-text">{stat.value}</p>
            <p className="text-xs md:text-sm text-cs-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-cs-surface border border-cs-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-cs-text flex items-center gap-2">
            <Clock className="w-5 h-5 text-cs-text-muted" />
            {t('admin.recentAdditions')}
          </h2>
          <button
            onClick={() => navigate('/admin/movies/new')}
            className="flex items-center gap-2 px-4 py-2 bg-cs-primary hover:bg-cs-primary-dark rounded-lg text-sm font-semibold text-white transition-smooth"
          >
            <Plus className="w-4 h-4" />
            {t('admin.addMovie')}
          </button>
        </div>

        <div className="space-y-2">
          {recent.map((movie) => (
            <button
              key={movie.id}
              onClick={() => navigate(`/admin/movies/${movie.id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-cs-surface-hover transition-smooth text-start"
            >
              {movie.poster_url && (
                <img src={movie.poster_url} alt={movie.title} className="w-10 h-14 rounded object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-cs-text font-medium truncate">{movie.title}</p>
                <p className="text-xs text-cs-text-muted">{movie.year} • {movie.genres.join(', ')}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded font-medium ${movie.published ? 'bg-cs-success/20 text-cs-success' : 'bg-cs-warning/20 text-cs-warning'}`}>
                {movie.published ? t('admin.published') : t('admin.unpublished')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

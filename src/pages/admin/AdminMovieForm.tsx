import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMovieById, createMovie, updateMovie } from '@/lib/movieService';
import {
  searchMoviesTMDB,
  fetchBilingualMovieDetails,
  fetchBilingualMovieByImdbId,
  mapBilingualTMDBToMovieFields,
} from '@/lib/tmdbService';
import { validateMagnetLink } from '@/lib/movieUtils';
import type { Movie, TMDBSearchResult } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Search, Download, Save, AlertCircle, CheckCircle, Film as FilmIcon, Link2, RotateCcw, RefreshCw, Globe } from 'lucide-react';

interface MovieFormData {
  title: string;
  title_ar: string;
  original_title: string;
  description: string;
  description_ar: string;
  poster_url: string;
  backdrop_url: string;
  release_date: string;
  rating: number;
  runtime: number | string;
  genres: string;
  genres_ar: string;
  cast_members: string;
  cast_ar: string;
  director: string;
  director_ar: string;
  imdb_id: string;
  tmdb_id: string;
  magnet_link: string;
  stream_url: string;
  subtitle_url: string;
  language: string;
  featured: boolean;
  published: boolean;
}

const emptyForm: MovieFormData = {
  title: '',
  title_ar: '',
  original_title: '',
  description: '',
  description_ar: '',
  poster_url: '',
  backdrop_url: '',
  release_date: '',
  rating: 0,
  runtime: '',
  genres: '',
  genres_ar: '',
  cast_members: '',
  cast_ar: '',
  director: '',
  director_ar: '',
  imdb_id: '',
  tmdb_id: '',
  magnet_link: '',
  stream_url: '',
  subtitle_url: '',
  language: 'en',
  featured: false,
  published: true,
};

export function AdminMovieForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { session, isAdmin, loading: authLoading } = useAuth();
  const isEdit = !!id;

  const [form, setForm] = useState<MovieFormData>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tmdbApplied, setTmdbApplied] = useState(false);
  const [arabicUnavailable, setArabicUnavailable] = useState(false);

  // TMDB search
  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TMDBSearchResult[]>([]);
  const [tmdbSearching, setTmdbSearching] = useState(false);
  const [tmdbError, setTmdbError] = useState<string | null>(null);
  const [updatingFromTMDB, setUpdatingFromTMDB] = useState(false);

  const loadMovie = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    const { data, error } = await fetchMovieById(id);
    if (error) {
      setLoadError(error);
    } else if (data) {
      const m = data as Movie;
      setForm({
        title: m.title,
        title_ar: m.title_ar || '',
        original_title: m.original_title || '',
        description: m.description || '',
        description_ar: m.description_ar || '',
        poster_url: m.poster_url || '',
        backdrop_url: m.backdrop_url || '',
        release_date: m.release_date || '',
        rating: m.rating,
        runtime: m.runtime || '',
        genres: m.genres.join(', '),
        genres_ar: m.genres_ar?.join(', ') || '',
        cast_members: m.cast_members.join(', '),
        cast_ar: m.cast_ar?.join(', ') || '',
        director: m.director || '',
        director_ar: m.director_ar || '',
        imdb_id: m.imdb_id || '',
        tmdb_id: m.tmdb_id?.toString() || '',
        magnet_link: m.magnet_link || '',
        stream_url: m.stream_url || '',
        subtitle_url: m.subtitle_url || '',
        language: m.language || 'en',
        featured: m.featured,
        published: m.published,
      });
    } else {
      setLoadError('Movie not found');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    if (!session || !isAdmin) return;
    if (!isEdit) {
      setLoading(false);
      return;
    }
    loadMovie();
  }, [loadMovie, authLoading, session, isAdmin, isEdit]);

  const applyBilingualData = (
    en: Parameters<typeof mapBilingualTMDBToMovieFields>[0],
    ar: Parameters<typeof mapBilingualTMDBToMovieFields>[1]
  ) => {
    const mapped = mapBilingualTMDBToMovieFields(en, ar);
    setForm((prev) => ({
      ...prev,
      title: mapped.title || prev.title,
      title_ar: mapped.title_ar || prev.title_ar,
      original_title: mapped.original_title || prev.original_title,
      description: mapped.description || prev.description,
      description_ar: mapped.description_ar || prev.description_ar,
      poster_url: mapped.poster_url || prev.poster_url,
      backdrop_url: mapped.backdrop_url || prev.backdrop_url,
      release_date: mapped.release_date || prev.release_date,
      rating: mapped.rating || prev.rating,
      runtime: mapped.runtime || prev.runtime,
      genres: (mapped.genres || []).join(', '),
      genres_ar: (mapped.genres_ar || []).join(', '),
      cast_members: (mapped.cast_members || []).join(', '),
      cast_ar: (mapped.cast_ar || []).join(', '),
      director: mapped.director || prev.director,
      director_ar: mapped.director_ar || prev.director_ar,
      imdb_id: mapped.imdb_id || prev.imdb_id,
      tmdb_id: mapped.tmdb_id?.toString() || prev.tmdb_id,
    }));
    setTmdbResults([]);
    setTmdbApplied(true);
    setArabicUnavailable(!ar);
    setTimeout(() => setTmdbApplied(false), 4000);
  };

  const handleFetchTMDB = async () => {
    if (!tmdbQuery.trim()) return;
    setTmdbSearching(true);
    setTmdbError(null);
    setTmdbResults([]);
    setArabicUnavailable(false);

    try {
      if (/^tt\d+$/i.test(tmdbQuery.trim())) {
        const bilingual = await fetchBilingualMovieByImdbId(tmdbQuery.trim());
        if (bilingual) {
          applyBilingualData(bilingual.english, bilingual.arabic);
          setTmdbSearching(false);
          return;
        }
        setTmdbError(t('admin.noResults'));
        setTmdbSearching(false);
        return;
      }

      const results = await searchMoviesTMDB(tmdbQuery, 'en-US');
      if (results.length === 0) {
        setTmdbError(t('admin.noResults'));
      } else if (results.length === 1) {
        const bilingual = await fetchBilingualMovieDetails(results[0].id);
        applyBilingualData(bilingual.english, bilingual.arabic);
      } else {
        setTmdbResults(results);
      }
    } catch (err) {
      console.error('TMDB fetch error:', err);
      setTmdbError(t('admin.fetchFailed'));
    }
    setTmdbSearching(false);
  };

  const handleSelectTMDBResult = async (result: TMDBSearchResult) => {
    setTmdbSearching(true);
    try {
      const bilingual = await fetchBilingualMovieDetails(result.id);
      applyBilingualData(bilingual.english, bilingual.arabic);
    } catch {
      setTmdbError(t('admin.fetchFailed'));
    }
    setTmdbSearching(false);
  };

  const handleUpdateFromTMDB = async () => {
    if (!form.tmdb_id) return;
    if (!window.confirm(t('admin.updateConfirm'))) return;
    setUpdatingFromTMDB(true);
    setTmdbError(null);
    try {
      const bilingual = await fetchBilingualMovieDetails(parseInt(form.tmdb_id, 10));
      applyBilingualData(bilingual.english, bilingual.arabic);
    } catch (err) {
      console.error('TMDB update error:', err);
      setTmdbError(t('admin.fetchFailed'));
    }
    setUpdatingFromTMDB(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.title.trim()) {
      setError(t('admin.validation.required'));
      return;
    }

    if (!form.imdb_id.trim()) {
      setError(t('admin.imdbIdRequired'));
      return;
    }

    if (!/^tt\d+$/i.test(form.imdb_id.trim())) {
      setError(t('admin.imdbIdInvalid'));
      return;
    }

    if (form.magnet_link && !validateMagnetLink(form.magnet_link)) {
      setError(t('admin.validation.magnet'));
      return;
    }

    setSaving(true);

    const movieData: Partial<Movie> = {
      title: form.title.trim(),
      title_ar: form.title_ar.trim() || null,
      original_title: form.original_title.trim() || null,
      description: form.description.trim() || null,
      description_ar: form.description_ar.trim() || null,
      poster_url: form.poster_url.trim() || null,
      backdrop_url: form.backdrop_url.trim() || null,
      release_date: form.release_date || null,
      year: form.release_date ? new Date(form.release_date).getFullYear() : null,
      rating: Number(form.rating) || 0,
      runtime: form.runtime ? parseInt(String(form.runtime), 10) : null,
      genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
      genres_ar: form.genres_ar.split(',').map((g) => g.trim()).filter(Boolean).length > 0
        ? form.genres_ar.split(',').map((g) => g.trim()).filter(Boolean)
        : null,
      cast_members: form.cast_members.split(',').map((c) => c.trim()).filter(Boolean),
      cast_ar: form.cast_ar.split(',').map((c) => c.trim()).filter(Boolean).length > 0
        ? form.cast_ar.split(',').map((c) => c.trim()).filter(Boolean)
        : null,
      director: form.director.trim() || null,
      director_ar: form.director_ar.trim() || null,
      imdb_id: form.imdb_id.trim() || null,
      tmdb_id: form.tmdb_id ? parseInt(form.tmdb_id, 10) : null,
      magnet_link: form.magnet_link.trim() || null,
      stream_url: form.stream_url.trim() || null,
      subtitle_url: form.subtitle_url.trim() || null,
      language: form.language || 'en',
      featured: form.featured,
      published: form.published,
    };

    let result;
    if (isEdit && id) {
      result = await updateMovie(id, { ...movieData, updated_at: new Date().toISOString() });
    } else {
      result = await createMovie(movieData);
    }

    if (result.error) {
      if (result.error.includes('duplicate') || result.error.includes('unique')) {
        setError(t('admin.validation.duplicate'));
      } else {
        setError(result.error);
      }
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/movies');
      }, 1500);
    }
    setSaving(false);
  };

  if (authLoading || loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-14 h-14 rounded-full bg-cs-error/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-cs-error" />
        </div>
        <p className="text-cs-text font-semibold mb-2">{t('common.error')}</p>
        <p className="text-cs-text-muted text-sm mb-6 max-w-md text-center">{loadError}</p>
        <button
          onClick={() => loadMovie()}
          className="flex items-center gap-2 px-5 py-2.5 bg-cs-primary hover:bg-cs-primary-dark rounded-lg text-sm font-semibold text-white transition-smooth"
        >
          <RotateCcw className="w-4 h-4" />
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-2.5 bg-cs-bg border border-cs-border rounded-lg text-cs-text placeholder:text-cs-text-muted focus:outline-none focus:border-cs-primary/50 focus:ring-2 focus:ring-cs-primary/20 transition-smooth text-sm';
  const labelClass = 'block text-sm font-medium text-cs-text-muted mb-1.5';
  const sectionTitle = 'text-base font-semibold text-cs-text mb-3 flex items-center gap-2';
  const sectionBox = 'bg-cs-surface border border-cs-border rounded-xl p-5';

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-cs-text">
          {isEdit ? t('admin.editMovie') : t('admin.addMovie')}
        </h1>
        {isEdit && form.tmdb_id && (
          <button
            onClick={handleUpdateFromTMDB}
            disabled={updatingFromTMDB}
            className="flex items-center gap-2 px-4 py-2 bg-cs-primary/10 hover:bg-cs-primary/20 border border-cs-primary/30 disabled:opacity-50 rounded-lg text-sm font-semibold text-cs-primary transition-smooth"
          >
            <RefreshCw className={`w-4 h-4 ${updatingFromTMDB ? 'animate-spin' : ''}`} />
            {updatingFromTMDB ? '...' : t('admin.updateFromTMDB')}
          </button>
        )}
      </div>

      {/* TMDB fetch section */}
      <div className={`${sectionBox} mb-6`}>
        <h2 className={sectionTitle}>
          <FilmIcon className="w-5 h-5 text-cs-primary" />
          TMDB
          <span className="text-xs font-normal text-cs-text-muted flex items-center gap-1 ms-2">
            <Globe className="w-3.5 h-3.5" />
            EN + AR
          </span>
        </h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cs-text-muted" />
            <input
              type="text"
              value={tmdbQuery}
              onChange={(e) => setTmdbQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleFetchTMDB())}
              placeholder={t('admin.movieName')}
              className={`${inputClass} ps-10`}
              dir="ltr"
            />
          </div>
          <button
            onClick={handleFetchTMDB}
            disabled={tmdbSearching || !tmdbQuery.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-cs-primary hover:bg-cs-primary-dark disabled:opacity-50 rounded-lg text-sm font-semibold text-white transition-smooth whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            {tmdbSearching ? t('admin.fetchingBilingual') : t('admin.fetchData')}
          </button>
        </div>

        {tmdbError && (
          <p className="text-sm text-cs-error mt-3 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {tmdbError}
          </p>
        )}

        {tmdbApplied && (
          <p className="text-sm text-cs-success mt-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            {arabicUnavailable ? t('admin.arabicUnavailable') : t('admin.bilingualSuccess')}
          </p>
        )}

        {tmdbResults.length > 0 && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            <p className="text-xs text-cs-text-muted mb-2">{t('admin.selectFromResults')}</p>
            {tmdbResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelectTMDBResult(result)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-cs-surface-hover transition-smooth text-start"
              >
                {result.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                    alt={result.title}
                    className="w-10 h-14 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cs-text truncate">{result.title}</p>
                  <p className="text-xs text-cs-text-muted">
                    {result.release_date ? new Date(result.release_date).getFullYear() : 'N/A'} • {result.vote_average.toFixed(1)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-cs-error/10 border border-cs-error/20 rounded-lg mb-4">
          <AlertCircle className="w-4 h-4 text-cs-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-cs-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-cs-success/10 border border-cs-success/20 rounded-lg mb-4">
          <CheckCircle className="w-4 h-4 text-cs-success flex-shrink-0" />
          <p className="text-sm text-cs-success">{t('admin.saved')}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* English content section */}
        <div className={sectionBox}>
          <h3 className={sectionTitle}>
            <Globe className="w-5 h-5 text-cs-primary" />
            {t('admin.englishSection')}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('admin.movieTitle')} *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Original Title</label>
              <input type="text" value={form.original_title} onChange={(e) => setForm({ ...form, original_title: e.target.value })} className={inputClass} dir="ltr" />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>{t('admin.description')}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={inputClass} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>{t('admin.genres')}</label>
              <input type="text" value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} className={inputClass} placeholder="Action, Drama, Sci-Fi" dir="ltr" />
            </div>
            <div>
              <label className={labelClass}>{t('admin.director')}</label>
              <input type="text" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} className={inputClass} dir="ltr" />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>{t('admin.cast')}</label>
            <input type="text" value={form.cast_members} onChange={(e) => setForm({ ...form, cast_members: e.target.value })} className={inputClass} dir="ltr" />
          </div>
        </div>

        {/* Arabic content section */}
        <div className={sectionBox}>
          <h3 className={sectionTitle}>
            <Globe className="w-5 h-5 text-cs-accent" />
            {t('admin.arabicSection')}
          </h3>

          <div>
            <label className={labelClass}>{t('admin.movieTitleAr')}</label>
            <input type="text" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className={inputClass} dir="rtl" />
          </div>

          <div className="mt-4">
            <label className={labelClass}>{t('admin.descriptionAr')}</label>
            <textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={4} className={inputClass} dir="rtl" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>{t('admin.genresAr')}</label>
              <input type="text" value={form.genres_ar} onChange={(e) => setForm({ ...form, genres_ar: e.target.value })} className={inputClass} placeholder="أكشن, دراما, خيال علمي" dir="rtl" />
            </div>
            <div>
              <label className={labelClass}>{t('admin.directorAr')}</label>
              <input type="text" value={form.director_ar} onChange={(e) => setForm({ ...form, director_ar: e.target.value })} className={inputClass} dir="rtl" />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>{t('admin.castAr')}</label>
            <input type="text" value={form.cast_ar} onChange={(e) => setForm({ ...form, cast_ar: e.target.value })} className={inputClass} dir="rtl" />
          </div>

          {arabicUnavailable && (
            <p className="text-xs text-cs-warning mt-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {t('admin.arabicUnavailable')}
            </p>
          )}
        </div>

        {/* Poster and Backdrop */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('admin.posterUrl')}</label>
            <div className="flex gap-3">
              <input type="url" value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} className={inputClass} dir="ltr" />
              {form.poster_url && (
                <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden border border-cs-border bg-cs-bg">
                  <img src={form.poster_url} alt="Poster preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className={labelClass}>{t('admin.backdropUrl')}</label>
            <div className="flex gap-3">
              <input type="url" value={form.backdrop_url} onChange={(e) => setForm({ ...form, backdrop_url: e.target.value })} className={inputClass} dir="ltr" />
              {form.backdrop_url && (
                <div className="flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden border border-cs-border bg-cs-bg">
                  <img src={form.backdrop_url} alt="Backdrop preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t('admin.releaseDate')}</label>
            <input type="date" value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Rating (0-10)</label>
            <input type="number" step="0.1" min="0" max="10" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('admin.runtime')}</label>
            <input type="number" value={form.runtime} onChange={(e) => setForm({ ...form, runtime: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('admin.imdbId')} *</label>
            <input type="text" value={form.imdb_id} onChange={(e) => setForm({ ...form, imdb_id: e.target.value })} className={inputClass} placeholder="tt1234567" dir="ltr" required pattern="tt\d+" title="tt followed by numbers" />
            {form.imdb_id && !/^tt\d+$/i.test(form.imdb_id.trim()) && (
              <p className="text-xs text-cs-error mt-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {t('admin.imdbIdInvalid')}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>{t('admin.tmdbId')}</label>
            <input type="text" value={form.tmdb_id} onChange={(e) => setForm({ ...form, tmdb_id: e.target.value })} className={inputClass} placeholder="12345" dir="ltr" />
          </div>
        </div>

        {/* Stream & Magnet Link */}
        <div className={sectionBox}>
          <h3 className={sectionTitle}>
            <Link2 className="w-5 h-5 text-cs-primary" />
            {t('admin.streamLinks')}
          </h3>

          <label className={labelClass}>{t('admin.streamUrl')}</label>
          <input
            type="url"
            value={form.stream_url}
            onChange={(e) => setForm({ ...form, stream_url: e.target.value })}
            className={inputClass}
            placeholder="https://example.com/movie.mp4"
            dir="ltr"
          />
          {form.stream_url && (
            <p className="text-xs text-cs-success mt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              {t('admin.streamUrlHint')}
            </p>
          )}

          <label className={`${labelClass} mt-4`}>{t('admin.magnetLink')}</label>
          <input
            type="text"
            value={form.magnet_link}
            onChange={(e) => setForm({ ...form, magnet_link: e.target.value })}
            className={inputClass}
            placeholder={t('admin.magnetPlaceholder')}
            dir="ltr"
          />
          {form.magnet_link && !validateMagnetLink(form.magnet_link) && (
            <p className="text-xs text-cs-error mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {t('admin.validation.magnet')}
            </p>
          )}
          {form.magnet_link && validateMagnetLink(form.magnet_link) && (
            <p className="text-xs text-cs-success mt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Valid magnet link format
            </p>
          )}

          <label className={`${labelClass} mt-4`}>Subtitle URL (VTT/SRT) — optional</label>
          <input
            type="url"
            value={form.subtitle_url}
            onChange={(e) => setForm({ ...form, subtitle_url: e.target.value })}
            className={inputClass}
            placeholder="https://example.com/subtitles.vtt"
            dir="ltr"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded accent-cs-primary" />
            <span className="text-sm text-cs-text">{t('admin.featured')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded accent-cs-primary" />
            <span className="text-sm text-cs-text">{t('admin.publishedLabel')}</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-cs-primary hover:bg-cs-primary-dark disabled:opacity-50 rounded-lg font-semibold text-white transition-smooth"
          >
            <Save className="w-4 h-4" />
            {saving ? '...' : t('admin.save')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/movies')}
            className="px-6 py-2.5 bg-cs-surface hover:bg-cs-surface-hover rounded-lg font-medium text-cs-text transition-smooth"
          >
            {t('admin.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}

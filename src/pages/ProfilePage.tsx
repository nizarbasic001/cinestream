import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { User, Mail, Shield, Save, AlertCircle, CheckCircle } from 'lucide-react';

export function ProfilePage() {
  const { t } = useI18n();
  const { session, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!session) {
    navigate('/login');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    const { error } = await updateProfile({ display_name: displayName });
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-cs-text mb-8">{t('profile.title')}</h1>

      <div className="bg-cs-surface border border-cs-border rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-cs-primary/20 flex items-center justify-center text-cs-primary font-bold text-2xl">
            {(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold text-cs-text">{profile?.display_name || 'User'}</p>
            <p className="text-sm text-cs-text-muted">{profile?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className={`w-3.5 h-3.5 ${profile?.role === 'admin' ? 'text-cs-primary' : 'text-cs-text-muted'}`} />
              <span className={`text-xs font-semibold ${profile?.role === 'admin' ? 'text-cs-primary' : 'text-cs-text-muted'}`}>
                {profile?.role === 'admin' ? t('profile.roleAdmin') : t('profile.roleUser')}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-cs-error/10 border border-cs-error/20 rounded-lg mb-4">
            <AlertCircle className="w-4 h-4 text-cs-error flex-shrink-0" />
            <p className="text-sm text-cs-error">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 px-4 py-3 bg-cs-success/10 border border-cs-success/20 rounded-lg mb-4">
            <CheckCircle className="w-4 h-4 text-cs-success flex-shrink-0" />
            <p className="text-sm text-cs-success">{t('profile.saved')}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cs-text-muted mb-1.5">{t('profile.displayName')}</label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cs-text-muted" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full ps-10 pe-4 py-3 bg-cs-bg border border-cs-border rounded-lg text-cs-text focus:outline-none focus:border-cs-primary/50 focus:ring-2 focus:ring-cs-primary/20 transition-smooth"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cs-text-muted mb-1.5">{t('profile.email')}</label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cs-text-muted" />
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full ps-10 pe-4 py-3 bg-cs-bg/50 border border-cs-border rounded-lg text-cs-text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-cs-primary hover:bg-cs-primary-dark disabled:opacity-50 rounded-lg font-semibold text-white transition-smooth"
          >
            <Save className="w-4 h-4" />
            {saving ? '...' : t('profile.save')}
          </button>
        </form>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full py-3 bg-cs-surface hover:bg-cs-surface-hover border border-cs-border rounded-lg text-cs-text font-medium transition-smooth"
      >
        {t('nav.logout')}
      </button>
    </div>
  );
}

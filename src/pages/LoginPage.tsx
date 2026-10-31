import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { t } = useI18n();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="bg-cs-surface border border-cs-border rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-cs-text mb-6">{t('nav.login')}</h1>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-cs-error/10 border border-cs-error/20 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-cs-error flex-shrink-0" />
              <p className="text-sm text-cs-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cs-text-muted mb-1.5">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cs-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ps-10 pe-4 py-3 bg-cs-bg border border-cs-border rounded-lg text-cs-text placeholder:text-cs-text-muted focus:outline-none focus:border-cs-primary/50 focus:ring-2 focus:ring-cs-primary/20 transition-smooth"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cs-text-muted mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cs-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ps-10 pe-4 py-3 bg-cs-bg border border-cs-border rounded-lg text-cs-text placeholder:text-cs-text-muted focus:outline-none focus:border-cs-primary/50 focus:ring-2 focus:ring-cs-primary/20 transition-smooth"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cs-primary hover:bg-cs-primary-dark disabled:opacity-50 rounded-lg font-semibold text-white transition-smooth"
            >
              {loading ? '...' : t('auth.login')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/reset-password" className="text-sm text-cs-text-muted hover:text-cs-primary transition-smooth">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-cs-text-muted">{t('auth.noAccount')} </span>
            <Link to="/signup" className="text-cs-primary font-medium hover:underline">
              {t('auth.signup')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Film,
  Tags,
  Search,
  Heart,
  History,
  User,
  Shield,
  Menu,
  X,
  LogOut,
  Globe,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Logo } from './Logo';

interface NavItem {
  to: string;
  icon: typeof Home;
  labelKey: string;
  adminOnly?: boolean;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, labelKey: 'nav.home' },
  { to: '/movies', icon: Film, labelKey: 'nav.movies' },
  { to: '/genres', icon: Tags, labelKey: 'nav.genres' },
  { to: '/search', icon: Search, labelKey: 'nav.search' },
  { to: '/favorites', icon: Heart, labelKey: 'nav.favorites', authRequired: true },
  { to: '/history', icon: History, labelKey: 'nav.history', authRequired: true },
  { to: '/profile', icon: User, labelKey: 'nav.profile', authRequired: true },
  { to: '/admin', icon: Shield, labelKey: 'nav.admin', adminOnly: true },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang, dir } = useI18n();
  const { session, profile, isAdmin, signOut } = useAuth();
  const { canInstall, installed, promptInstall } = usePWAInstall();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const visibleNavItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.authRequired && !session) return false;
    return true;
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isWatchPage = location.pathname.startsWith('/watch/');

  return (
    <div className="min-h-screen bg-cs-bg">
      {/* Desktop header */}
      {!isWatchPage && (
        <header className="fixed top-0 inset-x-0 z-50 glass border-b border-cs-border/50">
          <div className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
            <div className="flex items-center gap-8">
              <NavLink to="/">
                <Logo />
              </NavLink>

              <nav className="hidden lg:flex items-center gap-1">
                {visibleNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                        isActive
                          ? 'text-cs-primary bg-cs-primary/10'
                          : 'text-cs-text-muted hover:text-cs-text hover:bg-cs-surface'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    {t(item.labelKey)}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {(canInstall || installed) && (
                <button
                  onClick={canInstall ? promptInstall : undefined}
                  disabled={installed}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-cs-primary/15 hover:bg-cs-primary/25 text-cs-primary border border-cs-primary/20 transition-smooth"
                >
                  {installed ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {installed ? t('install.installed') : t('install.button')}
                </button>
              )}

              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-cs-text-muted hover:text-cs-text hover:bg-cs-surface transition-smooth"
                aria-label="Switch language"
              >
                <Globe className="w-4 h-4" />
                {lang === 'en' ? 'العربية' : 'English'}
              </button>

              {session ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cs-surface">
                    <div className="w-7 h-7 rounded-full bg-cs-primary/20 flex items-center justify-center text-cs-primary font-semibold text-xs">
                      {(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-cs-text font-medium max-w-[120px] truncate">
                      {profile?.display_name || profile?.email}
                    </span>
                    {isAdmin && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-cs-primary/20 text-cs-primary font-semibold">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg text-cs-text-muted hover:text-cs-text hover:bg-cs-surface transition-smooth"
                    title={t('nav.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-medium text-cs-text hover:text-cs-primary transition-smooth"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 text-sm font-semibold bg-cs-primary hover:bg-cs-primary-dark text-white rounded-lg transition-smooth"
                  >
                    {t('nav.signup')}
                  </button>
                </div>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-cs-text hover:bg-cs-surface transition-smooth"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile menu */}
      {!isWatchPage && mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute top-16 inset-x-0 bg-cs-surface border-b border-cs-border p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-smooth ${
                    isActive
                      ? 'text-cs-primary bg-cs-primary/10'
                      : 'text-cs-text-muted hover:text-cs-text hover:bg-cs-surface-hover'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {t(item.labelKey)}
              </NavLink>
            ))}

            <div className="pt-3 mt-3 border-t border-cs-border">
              {(canInstall || installed) && (
                <button
                  onClick={canInstall ? promptInstall : undefined}
                  disabled={installed}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-cs-primary/15 text-cs-primary border border-cs-primary/20 mb-3 transition-smooth"
                >
                  {installed ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                  {installed ? t('install.installed') : t('install.button')}
                </button>
              )}

              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4">
                    <div className="w-10 h-10 rounded-full bg-cs-primary/20 flex items-center justify-center text-cs-primary font-semibold">
                      {(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cs-text truncate">
                        {profile?.display_name || profile?.email}
                      </p>
                      {isAdmin && (
                        <span className="text-xs text-cs-primary font-semibold">Admin</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-cs-text-muted hover:text-cs-text hover:bg-cs-surface-hover transition-smooth"
                  >
                    <LogOut className="w-5 h-5" />
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 px-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="flex-1 py-2.5 text-sm font-medium text-cs-text border border-cs-border rounded-lg"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="flex-1 py-2.5 text-sm font-semibold bg-cs-primary text-white rounded-lg"
                  >
                    {t('nav.signup')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav for mobile */}
      {!isWatchPage && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-cs-border/50">
          <div className="flex items-center justify-around h-16 px-2">
            {visibleNavItems.slice(0, 5).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-smooth ${
                    isActive ? 'text-cs-primary' : 'text-cs-text-muted'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className={`${isWatchPage ? '' : 'pt-16 lg:pt-16 pb-20 lg:pb-0'} min-h-screen`}>
        {children}
      </main>
    </div>
  );
}

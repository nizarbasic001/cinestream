import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { LayoutDashboard, Film, Users, Plus } from 'lucide-react';

export function AdminLayout() {
  const { t } = useI18n();
  const { isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;

  if (!isAdmin) {
    return <ErrorState message={t('admin.accessDenied')} />;
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-cs-surface border border-cs-border rounded-xl p-3 lg:sticky lg:top-20">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap ${
                    isActive ? 'bg-cs-primary/10 text-cs-primary' : 'text-cs-text-muted hover:text-cs-text hover:bg-cs-surface-hover'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('admin.dashboard')}
              </NavLink>
              <NavLink
                to="/admin/movies"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap ${
                    isActive ? 'bg-cs-primary/10 text-cs-primary' : 'text-cs-text-muted hover:text-cs-text hover:bg-cs-surface-hover'
                  }`
                }
              >
                <Film className="w-4 h-4" />
                {t('admin.movies')}
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap ${
                    isActive ? 'bg-cs-primary/10 text-cs-primary' : 'text-cs-text-muted hover:text-cs-text hover:bg-cs-surface-hover'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                {t('admin.users')}
              </NavLink>
              <NavLink
                to="/admin/movies/new"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap ${
                    isActive ? 'bg-cs-primary/10 text-cs-primary' : 'text-cs-text-muted hover:text-cs-text hover:bg-cs-surface-hover'
                  }`
                }
              >
                <Plus className="w-4 h-4" />
                {t('admin.addMovie')}
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

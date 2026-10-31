import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { fetchAllProfiles } from '@/lib/movieService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Users as UsersIcon, Shield, User } from 'lucide-react';

interface ProfileInfo {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
}

export function AdminUsers() {
  const { t } = useI18n();
  const [users, setUsers] = useState<ProfileInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchAllProfiles();
      if (data) setUsers(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" label={t('common.loading')} />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <UsersIcon className="w-6 h-6 text-cs-primary" />
        <h1 className="text-2xl font-bold text-cs-text">{t('admin.users')}</h1>
      </div>

      <div className="bg-cs-surface border border-cs-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cs-border">
                <th className="text-start px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider">{t('profile.displayName')}</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider">{t('profile.email')}</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider">{t('profile.role')}</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-cs-text-muted uppercase tracking-wider hidden sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-cs-border/50 hover:bg-cs-surface-hover transition-smooth">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cs-primary/20 flex items-center justify-center text-cs-primary font-semibold text-xs flex-shrink-0">
                        {(user.display_name || user.email || 'U')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-cs-text">{user.display_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-cs-text-muted">{user.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded font-medium ${
                      user.role === 'admin'
                        ? 'bg-cs-primary/20 text-cs-primary'
                        : 'bg-cs-surface-hover text-cs-text-muted'
                    }`}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user.role === 'admin' ? t('profile.roleAdmin') : t('profile.roleUser')}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-cs-text-muted">{new Date(user.created_at).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-cs-text-muted text-sm">{t('admin.totalUsers')}: 0</p>
          </div>
        )}
      </div>
    </div>
  );
}

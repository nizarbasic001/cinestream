import { Film } from 'lucide-react';
import { useI18n } from '@/i18n';

export function Logo() {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-cs-primary flex items-center justify-center">
        <Film className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-cs-text tracking-tight">
        Cine<span className="text-cs-primary">Stream</span>
      </span>
    </div>
  );
}

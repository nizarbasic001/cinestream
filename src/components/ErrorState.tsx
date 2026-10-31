import { AlertCircle, RefreshCw } from 'lucide-react';
import { useI18n } from '@/i18n';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-cs-error/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-cs-error" />
      </div>
      <p className="text-cs-text text-lg font-semibold mb-1">
        {message || t('common.error')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-cs-surface hover:bg-cs-surface-hover rounded-lg text-cs-text font-medium transition-smooth"
        >
          <RefreshCw className="w-4 h-4" />
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}

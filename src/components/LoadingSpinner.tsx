import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className={`${sizeClass} animate-spin text-cs-primary`} />
      {label && <p className="mt-3 text-cs-text-muted text-sm">{label}</p>}
    </div>
  );
}

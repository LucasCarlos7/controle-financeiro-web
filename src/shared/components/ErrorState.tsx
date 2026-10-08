import { ApiError } from '../types/api';
import { Icon } from './icons';
import { Button } from './ui/Button';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error instanceof ApiError ? error.message : 'Ocorreu um erro inesperado. Tente novamente.';

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 px-6 py-14 text-center dark:border-red-900/40 dark:bg-red-950/20">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
        <Icon name="alert" className="h-5 w-5" />
      </div>
      <p className="max-w-xs text-sm font-medium text-red-700 dark:text-red-400">{message}</p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

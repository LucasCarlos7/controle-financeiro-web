import { cn } from '../../utils/cn';
import { ApiError } from '../../types/api';
import { Icon } from '../icons';
import { Button } from './Button';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  /** `compact` para uso dentro de um card. */
  variant?: 'default' | 'compact';
}

export function ErrorState({ error, onRetry, variant = 'default' }: ErrorStateProps) {
  const message = error instanceof ApiError ? error.message : 'Ocorreu um erro inesperado. Tente novamente.';

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'default' ? 'rounded-card border border-border bg-surface px-6 py-14' : 'px-4 py-10',
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-danger-soft text-danger">
        <Icon name="alert" className="h-5 w-5" />
      </div>
      <p className="text-lg font-semibold text-text">Não foi possível carregar</p>
      <p className="mt-1 max-w-sm text-base text-text-muted">{message}</p>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry} className="mt-5">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

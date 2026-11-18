import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface FieldProps {
  label?: ReactNode;
  htmlFor?: string;
  error?: string;
  hint?: ReactNode;
  /** Ids gerados pelo controle para ligar a mensagem de erro e a dica (aria-describedby). */
  errorId?: string;
  hintId?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, errorId, hintId, className, children }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={cn('mt-1.5 text-sm font-medium text-danger')}>
          {error}
        </p>
      )}
    </div>
  );
}

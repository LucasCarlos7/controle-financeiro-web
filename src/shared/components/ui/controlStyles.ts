import { cn } from '../../utils/cn';

/** Classes de campo de formulário (input, select). 16px no mobile evita o zoom automático do iOS. */
export function controlClasses(hasError: boolean, className?: string): string {
  return cn(
    'block h-11 w-full rounded-control border bg-surface px-3 text-lg text-text shadow-card transition-colors duration-(--duration-fast) placeholder:text-text-subtle sm:h-10 sm:text-base',
    'focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-subtle',
    hasError ? 'border-danger' : 'border-border-strong hover:border-text-subtle',
    className,
  );
}

/** Ids da mensagem de erro e da dica de um controle, e o aria-describedby correspondente. */
export function describedBy(id: string, error?: string, hasHint = false) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedById = error ? errorId : hasHint ? hintId : undefined;
  return { errorId, hintId, describedById };
}

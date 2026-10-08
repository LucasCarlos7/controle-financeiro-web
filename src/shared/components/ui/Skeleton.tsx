import { cn } from '../../utils/cn';

/** Bloco de carregamento. A pulsação some com prefers-reduced-motion (regra global). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-control bg-surface-hover', className)} />;
}

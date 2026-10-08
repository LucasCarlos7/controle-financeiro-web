import type { CSSProperties } from 'react';
import { cn } from '../../utils/cn';

/** Bloco de carregamento. A pulsação some com prefers-reduced-motion (regra global). */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div aria-hidden="true" style={style} className={cn('animate-pulse rounded-control bg-surface-hover', className)} />
  );
}

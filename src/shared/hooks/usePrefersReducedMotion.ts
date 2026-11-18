import { useMediaQuery } from './useMediaQuery';

/** Para animações em JS (Recharts) que a regra CSS global não alcança. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

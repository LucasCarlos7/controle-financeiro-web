import { cn } from '../../utils/cn';

interface LogoProps {
  /** Mostra o nome ao lado do símbolo. */
  withName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MARK_SIZES = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-11 w-11',
} as const;

/** Símbolo do app: linha de tendência ascendente sobre gradiente da cor de marca. */
export function Logo({ withName = false, size = 'md', className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('shrink-0', MARK_SIZES[size])}>
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-primary-hover)" />
          </linearGradient>
          <linearGradient id="logo-shine" x1="0" y1="0" x2="0" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.14" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#logo-bg)" />
        <rect width="32" height="16" rx="9" fill="url(#logo-shine)" />
        <path
          d="M8 22 13.5 16l4 3.5L25 11"
          fill="none"
          stroke="var(--color-primary-fg)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="25" cy="11" r="2.4" fill="var(--color-primary-fg)" />
      </svg>
      {withName && <span className="text-lg font-semibold tracking-tight text-text">Controle Financeiro</span>}
    </span>
  );
}

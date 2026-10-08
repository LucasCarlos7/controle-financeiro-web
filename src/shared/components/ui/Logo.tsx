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

/** Símbolo do app: uma linha de tendência subindo sobre a cor de marca. */
export function Logo({ withName = false, size = 'md', className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('shrink-0', MARK_SIZES[size])}>
        <rect width="32" height="32" rx="9" fill="var(--color-primary)" />
        <path
          d="M8 21.5 13.5 16l4 3.5L24 12"
          fill="none"
          stroke="var(--color-primary-fg)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="12" r="2.2" fill="var(--color-primary-fg)" />
      </svg>
      {withName && <span className="text-lg font-semibold tracking-tight text-text">Controle Financeiro</span>}
    </span>
  );
}

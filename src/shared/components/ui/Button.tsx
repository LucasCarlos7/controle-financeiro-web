import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Mostra um spinner, desabilita o botão e mantém a largura. */
  loading?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg shadow-card hover:bg-primary-hover',
  secondary: 'bg-surface-sunken text-text hover:bg-surface-hover',
  outline: 'border border-border-strong bg-surface text-text shadow-card hover:bg-surface-hover',
  ghost: 'text-text-muted hover:bg-surface-hover hover:text-text',
  danger: 'border border-border-strong bg-surface text-danger shadow-card hover:border-danger hover:bg-danger-soft',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'hit-area h-8 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-4 text-base sm:h-10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-control font-medium transition-colors duration-(--duration-fast) disabled:cursor-not-allowed disabled:opacity-55',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

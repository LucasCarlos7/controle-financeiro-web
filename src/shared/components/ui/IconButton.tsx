import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from '../icons';

type Variant = 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Nome acessível; também vira o tooltip nativo. */
  label: string;
  variant?: Variant;
  size?: Size;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  ghost: 'text-text-muted hover:bg-surface-hover hover:text-text',
  danger: 'text-text-muted hover:bg-danger-soft hover:text-danger',
  outline: 'border border-border-strong bg-surface text-text-muted shadow-card hover:bg-surface-hover hover:text-text',
};

const SIZE_CLASSES: Record<Size, { button: string; icon: string }> = {
  sm: { button: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { button: 'h-10 w-10', icon: 'h-[18px] w-[18px]' },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = 'ghost', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          'hit-area inline-flex shrink-0 items-center justify-center rounded-control transition-colors duration-(--duration-fast) disabled:cursor-not-allowed disabled:opacity-55',
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size].button,
          className,
        )}
        {...props}
      >
        <Icon name={icon} className={SIZE_CLASSES[size].icon} />
      </button>
    );
  },
);
IconButton.displayName = 'IconButton';

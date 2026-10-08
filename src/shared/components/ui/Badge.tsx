import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-surface-sunken text-text-muted ring-1 ring-inset ring-border',
  primary: 'bg-primary-soft text-primary-text',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}

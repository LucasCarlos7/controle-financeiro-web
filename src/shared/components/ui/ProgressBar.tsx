import { cn } from '../../utils/cn';

type Tone = 'primary' | 'success' | 'warning' | 'danger';

const TONE_CLASSES: Record<Tone, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

interface ProgressBarProps {
  /** Percentual; acima de 100 a barra fica cheia. */
  value: number;
  label: string;
  tone?: Tone;
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({ value, label, tone = 'primary', size = 'md', className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, 100));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={`${Math.round(value)}%`}
      className={cn('w-full overflow-hidden rounded-full bg-surface-hover', size === 'sm' ? 'h-1.5' : 'h-2', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-(--duration-base) ease-out', TONE_CLASSES[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

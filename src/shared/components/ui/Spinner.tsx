import { cn } from '../../utils/cn';

interface SpinnerProps {
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
} as const;

/** Indicador circular. Com `label`, ocupa um bloco centralizado e anuncia o carregamento. */
export function Spinner({ label, size = 'md', className }: SpinnerProps) {
  const circle = (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block shrink-0 animate-spin rounded-full border-current border-t-transparent opacity-80',
        SIZE_CLASSES[size],
        className,
      )}
    />
  );

  if (!label) return circle;

  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-14 text-text-muted">
      {circle}
      <p className="text-sm">{label}</p>
    </div>
  );
}

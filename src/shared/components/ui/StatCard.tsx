import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from '../icons';

type Tone = 'neutral' | 'income' | 'expense' | 'primary';

const ICON_TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-text-muted',
  income: 'bg-success-soft text-income',
  expense: 'bg-danger-soft text-expense',
  primary: 'bg-primary-soft text-primary-text',
};

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: IconName;
  tone?: Tone;
  hint?: ReactNode;
  className?: string;
}

/** Métrica com rótulo, valor e dica. Não desenha borda: é usado dentro de Card ou de uma grade. */
export function StatCard({ label, value, icon, tone = 'neutral', hint, className }: StatCardProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex items-center gap-2">
        {icon && (
          <span className={cn('flex h-6 w-6 items-center justify-center rounded-full', ICON_TONE_CLASSES[tone])}>
            <Icon name={icon} className="h-3.5 w-3.5" />
          </span>
        )}
        <p className="text-sm font-medium text-text-muted">{label}</p>
      </div>
      <p className="mt-1.5 truncate text-xl font-semibold tracking-tight text-text sm:text-2xl">{value}</p>
      {hint && <p className="mt-0.5 text-sm text-text-muted">{hint}</p>}
    </div>
  );
}

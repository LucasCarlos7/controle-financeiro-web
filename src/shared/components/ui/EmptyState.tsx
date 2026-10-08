import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from '../icons';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: IconName;
  /** `compact` para uso dentro de um card (ex.: gráfico sem dados). */
  variant?: 'default' | 'compact';
}

export function EmptyState({ title, description, action, icon = 'document', variant = 'default' }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'default' ? 'rounded-card border border-dashed border-border-strong px-6 py-14' : 'px-4 py-10',
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken text-text-muted ring-1 ring-border">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <p className="text-lg font-semibold text-text">{title}</p>
      {description && <p className="mt-1 max-w-sm text-base text-text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

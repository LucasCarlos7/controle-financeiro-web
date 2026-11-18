import type { ReactNode } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { ErrorState } from '../../../shared/components/ui/ErrorState';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { cn } from '../../../shared/utils/cn';

interface DashboardCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Card do painel: título à esquerda, link de ação à direita. Fica inteiro numa coluna da grade. */
export function DashboardCard({ title, action, children, className }: DashboardCardProps) {
  return (
    <Card as="section" aria-label={title} className={cn('mb-4 break-inside-avoid', className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-text">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

/** Carregando / erro padronizados dentro de um card. */
export function CardStatus({ isLoading, error, onRetry, rows = 3 }: {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  rows?: number;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }
  if (error) return <ErrorState variant="compact" error={error} onRetry={onRetry} />;
  return null;
}

export function CardEmpty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-base text-text-muted">{children}</p>;
}

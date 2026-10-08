import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Padding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLElement> {
  padding?: Padding;
  as?: 'div' | 'section' | 'li' | 'article';
}

const PADDING_CLASSES: Record<Padding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

export function Card({ padding = 'md', as: Component = 'div', className, ...props }: CardProps) {
  return (
    <Component
      className={cn('rounded-card border border-border bg-surface shadow-card', PADDING_CLASSES[padding], className)}
      {...props}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-text">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

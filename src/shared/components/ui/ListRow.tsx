import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { EntityIcon } from '../icons';

interface ListRowProps {
  /** Nome do ícone (catálogo ou interface). */
  icon: string;
  iconClassName?: string;
  title: ReactNode;
  /** Abre o item (ex.: edição). A linha inteira vira área clicável. */
  onOpen?: () => void;
  openLabel?: string;
  meta?: ReactNode;
  /** Conteúdo à direita (valor). */
  value?: ReactNode;
  /** Ações (menu) — ficam acima da área clicável. */
  actions?: ReactNode;
  /** Conteúdo extra abaixo do título (barra de progresso, chips). */
  children?: ReactNode;
  className?: string;
}

/** Linha de lista dentro de um Card com divisórias: ícone, título, meta, valor e menu de ações. */
export function ListRow({
  icon,
  iconClassName = 'bg-surface-sunken text-text-muted',
  title,
  onOpen,
  openLabel,
  meta,
  value,
  actions,
  children,
  className,
}: ListRowProps) {
  return (
    <li
      className={cn(
        'relative flex items-center gap-3 px-4 py-3.5 transition-colors first:rounded-t-card last:rounded-b-card sm:px-5',
        onOpen && 'hover:bg-surface-hover',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', iconClassName)}
      >
        <EntityIcon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          {onOpen ? (
            <button
              type="button"
              onClick={onOpen}
              aria-label={openLabel}
              className="flex min-w-0 items-center gap-2 text-left text-base font-medium text-text after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-focus"
            >
              {title}
            </button>
          ) : (
            <div className="flex min-w-0 items-center gap-2 text-base font-medium text-text">{title}</div>
          )}
          {value && <div className="shrink-0 text-right">{value}</div>}
        </div>
        {meta && <div className="mt-0.5 truncate text-sm text-text-muted">{meta}</div>}
        {children}
      </div>
      {actions && <div className="relative z-10 flex w-10 shrink-0 justify-center">{actions}</div>}
    </li>
  );
}

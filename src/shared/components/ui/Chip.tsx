import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../icons';

const BASE = 'inline-flex h-8 items-center gap-1.5 rounded-full text-sm font-medium transition-colors duration-(--duration-fast)';

interface SelectableChipProps {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/** Chip que liga e desliga (ex.: tags de um lançamento). */
export function SelectableChip({ selected, onToggle, children }: SelectableChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        BASE,
        'hit-area gap-1.5 border px-3',
        selected
          ? 'border-primary bg-primary-soft text-primary-text'
          : 'border-border-strong bg-surface text-text-muted hover:bg-surface-hover hover:text-text',
      )}
    >
      {selected && <Icon name="check" className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

interface RemovableChipProps {
  children: ReactNode;
  removeLabel: string;
  onRemove: () => void;
  /** Torna o texto clicável (ex.: renomear). */
  onClick?: () => void;
  clickLabel?: string;
}

/** Chip com botão de remover (ex.: tags e subcategorias cadastradas). */
export function RemovableChip({ children, removeLabel, onRemove, onClick, clickLabel }: RemovableChipProps) {
  return (
    <span className={cn(BASE, 'border border-border bg-surface-sunken pl-3 text-text')}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={clickLabel}
          title={clickLabel}
          className="rounded-sm hover:underline hover:decoration-text-subtle hover:underline-offset-2"
        >
          {children}
        </button>
      ) : (
        children
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        title={removeLabel}
        className="hit-area mx-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-text-subtle transition-colors hover:bg-danger-soft hover:text-danger"
      >
        <Icon name="x" className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

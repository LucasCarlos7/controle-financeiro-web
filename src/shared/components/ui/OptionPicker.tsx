import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from '../icons';
import { Modal } from './Modal';

export interface PickerOption {
  value: string;
  label: string;
  description?: string;
  /** Ícone à esquerda, num quadrado. */
  icon?: IconName;
  /** Cor (ex.: da categoria): tinge o quadrado do ícone, ou vira uma bolinha quando não há ícone. */
  color?: string | null;
  /** Informação à direita, ex.: "Saldo atual" / R$ 1.234,56 / "Fecha dia 5". */
  meta?: { label?: string; value: ReactNode; hint?: ReactNode };
}

interface OptionPickerProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  options: PickerOption[];
  value: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

function OptionMedia({ icon, color }: Pick<PickerOption, 'icon' | 'color'>) {
  if (!icon) {
    return color ? (
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
    ) : null;
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-surface-sunken text-text-muted ring-1 ring-border"
      style={color ? { backgroundColor: `color-mix(in oklch, ${color} 22%, transparent)`, color } : undefined}
    >
      <Icon name={icon} className="h-[18px] w-[18px]" />
    </span>
  );
}

/** Diálogo "Qual é o ...?": lista de opções; escolher uma já aplica e fecha. */
export function OptionPicker({ open, title, description, options, value, onClose, onSelect }: OptionPickerProps) {
  return (
    <Modal open={open} title={title} description={description} onClose={onClose}>
      <div role="radiogroup" aria-label={title} className="space-y-2">
        {options.length === 0 && <p className="text-base text-text-muted">Nenhuma opção cadastrada.</p>}
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(option.value)}
              className={cn(
                'flex min-h-14 w-full items-center gap-3 rounded-control border px-3 py-2.5 text-left transition-colors',
                selected
                  ? 'border-primary-text bg-primary-soft text-text'
                  : 'border-border-strong bg-surface text-text hover:bg-surface-hover',
              )}
            >
              <OptionMedia icon={option.icon} color={option.color} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-medium">{option.label}</span>
                {option.description && <span className="block text-sm text-text-muted">{option.description}</span>}
              </span>
              {option.meta && (
                <span className="shrink-0 text-right">
                  {option.meta.label && <span className="block text-xs text-text-muted">{option.meta.label}</span>}
                  <span className="block text-base font-semibold tabular-nums">{option.meta.value}</span>
                  {option.meta.hint && <span className="block text-xs text-text-muted">{option.meta.hint}</span>}
                </span>
              )}
              {selected && <Icon name="check" className="h-4 w-4 shrink-0 text-primary-text" />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

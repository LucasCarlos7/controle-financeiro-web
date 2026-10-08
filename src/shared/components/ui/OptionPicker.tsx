import { cn } from '../../utils/cn';
import { Icon } from '../icons';
import { Modal } from './Modal';

export interface PickerOption {
  value: string;
  label: string;
  description?: string;
  /** Cor (ex.: da categoria) mostrada como bolinha antes do rótulo. */
  color?: string | null;
}

interface OptionPickerProps {
  open: boolean;
  title: string;
  options: PickerOption[];
  value: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

/** Diálogo "Qual é o ...?": lista de opções; escolher uma já aplica e fecha. */
export function OptionPicker({ open, title, options, value, onClose, onSelect }: OptionPickerProps) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
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
                'flex min-h-11 w-full items-center gap-2.5 rounded-control border px-3 py-2 text-left text-base font-medium transition-colors',
                selected
                  ? 'border-primary-text bg-primary-soft text-text'
                  : 'border-border-strong bg-surface text-text hover:bg-surface-hover',
              )}
            >
              {option.color && (
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate">{option.label}</span>
                {option.description && (
                  <span className="block text-sm font-normal text-text-muted">{option.description}</span>
                )}
              </span>
              {selected && <Icon name="check" className="h-4 w-4 shrink-0 text-primary-text" />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

import { useRef, type KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  /** Mostra o rótulo visível acima do controle. */
  showLabel?: boolean;
  className?: string;
}

/** Escolha única entre poucas opções (radiogroup). Setas trocam a opção. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  showLabel = false,
  className,
}: SegmentedControlProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = options.findIndex((option) => option.value === value);
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role=radio]')[next]?.focus();
  }

  return (
    <div className={className}>
      {showLabel && <p className="mb-1.5 text-sm font-medium text-text">{label}</p>}
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="grid auto-cols-fr grid-flow-col gap-1 rounded-control border border-border bg-surface-sunken p-1"
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(option.value)}
              className={cn(
                'h-9 truncate rounded-[calc(var(--radius-control)-2px)] px-2 text-sm font-medium sm:px-3 sm:text-base transition-colors duration-(--duration-fast)',
                selected
                  ? 'bg-primary-soft font-semibold text-primary-text shadow-card ring-1 ring-primary-text'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

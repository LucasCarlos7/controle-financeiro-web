import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from '../icons';
import { OptionPicker, type PickerOption } from './OptionPicker';

/** Bloco de formulário: rótulo em maiúsculas e um card com linhas separadas por divisórias. */
export function FormSection({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</h3>
      <div className="divide-y divide-border rounded-card border border-border bg-surface">{children}</div>
      {hint && <p className="mt-2 px-1 text-sm text-text-muted">{hint}</p>}
    </section>
  );
}

function RowIcon({ icon }: { icon: IconName }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-surface-sunken text-text-muted ring-1 ring-border"
    >
      <Icon name={icon} className="h-4 w-4" />
    </span>
  );
}

function RowLabel({ label, required }: { label: ReactNode; required?: boolean }) {
  return (
    <span className="shrink-0 text-base font-medium text-text">
      {label}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      )}
    </span>
  );
}

function RowError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="px-3 pb-2.5 pl-14 text-sm font-medium text-danger">
      {error}
    </p>
  );
}

const ROW = 'flex min-h-14 items-center gap-3 px-3 py-2';

interface TextRowProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: IconName;
  label: ReactNode;
  error?: string;
  /** Texto fixo antes do valor (ex.: "R$"). */
  prefix?: string;
}

/** Linha com rótulo à esquerda e campo de texto alinhado à direita. */
export const TextRow = forwardRef<HTMLInputElement, TextRowProps>(
  ({ icon, label, error, prefix, required, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="first:rounded-t-card last:rounded-b-card focus-within:bg-surface-hover">
        <label htmlFor={inputId} className={cn(ROW, 'cursor-text')}>
          <RowIcon icon={icon} />
          <RowLabel label={label} required={required} />
          <span className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1">
            {prefix && <span className="text-base text-text-muted">{prefix}</span>}
            <input
              id={inputId}
              ref={ref}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              aria-required={required || undefined}
              className={cn(
                'h-10 min-w-0 bg-transparent text-right text-lg text-text placeholder:text-text-subtle focus-visible:outline-none sm:text-base',
                props.type === 'date' ? 'w-auto' : 'w-full',
                error && 'text-danger',
                className,
              )}
              {...props}
            />
          </span>
        </label>
        <RowError id={errorId} error={error} />
      </div>
    );
  },
);
TextRow.displayName = 'TextRow';

interface SelectRowProps {
  icon: IconName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: PickerOption[];
  /** Pergunta do seletor: "Qual é o tipo de conta?". */
  pickerTitle: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

/** Linha que mostra o valor escolhido e abre um seletor de opções. */
export function SelectRow({
  icon,
  label,
  value,
  onChange,
  options,
  pickerTitle,
  placeholder = 'Selecione',
  required,
  error,
  disabled,
}: SelectRowProps) {
  const [open, setOpen] = useState(false);
  const errorId = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <div className="first:rounded-t-card last:rounded-b-card">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          ROW,
          'w-full text-left transition-colors hover:bg-surface-hover focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        <RowIcon icon={icon} />
        <RowLabel label={label} required={required} />
        <span className={cn('ml-auto truncate text-base', selected ? 'text-text' : error ? 'text-danger' : 'text-text-subtle')}>
          {selected?.label ?? placeholder}
        </span>
        <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-text-muted" />
      </button>
      <RowError id={errorId} error={error} />
      <OptionPicker
        open={open}
        title={pickerTitle}
        options={options}
        value={value}
        onClose={() => setOpen(false)}
        onApply={(next) => {
          onChange(next);
          setOpen(false);
        }}
      />
    </div>
  );
}

interface ToggleRowProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  icon: IconName;
  label: ReactNode;
  description?: ReactNode;
}

/** Linha com interruptor (checkbox com papel de switch). */
export const ToggleRow = forwardRef<HTMLInputElement, ToggleRowProps>(
  ({ icon, label, description, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(ROW, 'cursor-pointer first:rounded-t-card last:rounded-b-card hover:bg-surface-hover')}
      >
        <RowIcon icon={icon} />
        <span className="min-w-0 flex-1">
          <span className="block text-base font-medium text-text">{label}</span>
          {description && <span className="block text-sm text-text-muted">{description}</span>}
        </span>
        <input id={inputId} ref={ref} type="checkbox" role="switch" className="peer sr-only" {...props} />
        <span
          aria-hidden="true"
          className="relative h-6 w-10 shrink-0 rounded-full bg-border-strong transition-colors peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-card after:transition-transform peer-checked:after:translate-x-4"
        />
      </label>
    );
  },
);
ToggleRow.displayName = 'ToggleRow';

interface AmountInputProps extends InputHTMLAttributes<HTMLInputElement> {
  tone?: 'expense' | 'income' | 'neutral';
  error?: string;
}

const AMOUNT_TONES = {
  expense: { color: 'text-expense', sign: '−' },
  income: { color: 'text-income', sign: '+' },
  neutral: { color: 'text-text', sign: '' },
} as const;

/** Valor em destaque no topo do formulário: "− R$ 0,00" grande, colorido pelo tipo. */
export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  ({ tone = 'neutral', error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const { color, sign } = AMOUNT_TONES[tone];

    return (
      <div className="mb-5 px-1">
        <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
          Valor
        </label>
        <div className={cn('mt-1 flex items-baseline gap-1.5 font-semibold', color)}>
          <span className="shrink-0 whitespace-nowrap text-xl">
            {sign}
            {sign && ' '}R$
          </span>
          <input
            id={inputId}
            ref={ref}
            type="number"
            step="0.01"
            inputMode="decimal"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'w-full min-w-0 bg-transparent text-4xl font-bold tabular-nums tracking-tight placeholder:text-text-subtle focus-visible:outline-none',
              className,
            )}
            onFocus={(event) => event.target.select()}
            {...props}
          />
          <Icon name="pencil" aria-hidden="true" className="h-5 w-5 shrink-0 self-center text-primary-text" />
        </div>
        <div className={cn('mt-1 h-0.5 rounded-full', error ? 'bg-danger' : 'bg-border')} />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
AmountInput.displayName = 'AmountInput';

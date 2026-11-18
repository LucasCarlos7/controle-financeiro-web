import { forwardRef, type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent, type SyntheticEvent } from 'react';

const MAX_DIGITS = 12;

interface MoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'defaultValue'> {
  /** Valor em reais (número). Aceita string numérica vinda do formulário. */
  value: unknown;
  onChange: (value: number) => void;
  /** Permite valor negativo: a tecla "-" alterna o sinal (ex.: saldo inicial). */
  allowNegative?: boolean;
}

function toCents(value: unknown): number {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) : 0;
}

function formatCents(cents: number): string {
  const text = (Math.abs(cents) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return cents < 0 ? `-${text}` : text;
}

function moveCaretToEnd(event: SyntheticEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  const end = input.value.length;
  if (input.selectionStart !== end || input.selectionEnd !== end) input.setSelectionRange(end, end);
}

/**
 * Campo monetário preenchido da direita para a esquerda, como em apps de banco:
 * digitar 1, 0, 0 mostra 0,01 → 0,10 → 1,00. Backspace remove o último dígito.
 */
export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, allowNegative = false, onKeyDown, ...props }, ref) => {
    const cents = toCents(value);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const digits = event.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(-MAX_DIGITS);
      const next = Number(digits || '0');
      onChange((cents < 0 ? -next : next) / 100);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === '-' || event.key === '+') {
        event.preventDefault();
        if (allowNegative && (event.key === '-' ? cents > 0 : cents < 0)) onChange(-cents / 100);
      }
      onKeyDown?.(event);
    }

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={formatCents(cents)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={moveCaretToEnd}
        onClick={moveCaretToEnd}
        onSelect={moveCaretToEnd}
        {...props}
      />
    );
  },
);
MoneyInput.displayName = 'MoneyInput';

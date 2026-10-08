import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';

/**
 * `income` e `expense` recebem sinal (+ / −). `balance` só ganha cor quando é negativo.
 * Em listas a despesa fica na cor do texto; o vermelho é reservado para saldo negativo e alertas.
 */
type AmountKind = 'income' | 'expense' | 'transfer' | 'balance' | 'plain';

interface AmountProps {
  value: number;
  kind?: AmountKind;
  /** Pinta a despesa com a cor de despesa (cards de resumo). */
  colorExpense?: boolean;
  className?: string;
}

const MINUS = '−';

export function Amount({ value, kind = 'plain', colorExpense = false, className }: AmountProps) {
  const absolute = formatCurrency(Math.abs(value));
  let sign = '';
  let color = '';

  switch (kind) {
    case 'income':
      sign = '+';
      color = 'text-income';
      break;
    case 'expense':
      sign = MINUS;
      color = colorExpense ? 'text-expense' : '';
      break;
    case 'transfer':
      color = 'text-text-muted';
      break;
    case 'balance':
      sign = value < 0 ? MINUS : '';
      color = value < 0 ? 'text-danger' : '';
      break;
    case 'plain':
      sign = value < 0 ? MINUS : '';
      break;
  }

  return <span className={cn('whitespace-nowrap tabular-nums', color, className)}>{`${sign}${absolute}`}</span>;
}

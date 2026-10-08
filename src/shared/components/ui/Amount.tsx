import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';
import { usePrivacy } from '../../hooks/useFeedback';

/**
 * `income` (verde, +) e `expense` (vermelho, −) recebem sinal e cor. `balance` só ganha cor quando é negativo.
 * Com `split`, "R$" e centavos ficam menores que a parte inteira (valores de destaque).
 */
type AmountKind = 'income' | 'expense' | 'transfer' | 'balance' | 'plain';

interface AmountProps {
  value: number;
  kind?: AmountKind;
  /** Sem cor própria (ex.: total dentro de um texto). */
  neutral?: boolean;
  /** Mostra o sinal (+ / −) de receitas e despesas. */
  showSign?: boolean;
  split?: boolean;
  className?: string;
}

const MINUS = '−';

const COLORS: Record<AmountKind, (value: number) => string> = {
  income: () => 'text-income',
  expense: () => 'text-expense',
  transfer: () => 'text-text-muted',
  balance: (value) => (value < 0 ? 'text-danger' : ''),
  plain: () => '',
};

function signOf(kind: AmountKind, value: number, showSign: boolean) {
  if (kind === 'income') return showSign ? '+' : '';
  if (kind === 'expense') return showSign ? MINUS : '';
  return value < 0 ? MINUS : '';
}

export function Amount({ value, kind = 'plain', neutral = false, showSign = true, split = false, className }: AmountProps) {
  const { hidden } = usePrivacy();
  const color = neutral ? '' : COLORS[kind](value);
  const sign = signOf(kind, value, showSign);
  const [, inteiro = '', centavos = '00'] = formatCurrency(Math.abs(value)).match(/R\$\s?([\d.]+),(\d{2})/) ?? [];

  if (hidden) {
    return (
      <span className={cn('whitespace-nowrap tabular-nums', color, className)} aria-label="Valor oculto">
        {split ? <span className="mr-0.5 text-[0.55em] font-medium opacity-80">R$</span> : 'R$ '}
        ••••
      </span>
    );
  }

  if (!split) {
    return (
      <span className={cn('whitespace-nowrap tabular-nums', color, className)}>{`${sign}R$ ${inteiro},${centavos}`}</span>
    );
  }

  return (
    <span
      className={cn('whitespace-nowrap tabular-nums', color, className)}
      aria-label={`${sign}${formatCurrency(Math.abs(value))}`}
    >
      <span aria-hidden="true" className="mr-1 text-[0.55em] font-medium opacity-80">
        {sign}R$
      </span>
      <span aria-hidden="true">{inteiro}</span>
      <span aria-hidden="true" className="text-[0.6em] font-medium">
        ,{centavos}
      </span>
    </span>
  );
}

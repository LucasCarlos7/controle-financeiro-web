import { Icon, type IconName } from '../../../shared/components/icons';
import { cn } from '../../../shared/utils/cn';
import type { Transacao } from '../types';

const TIPO_ICON: Record<Transacao['tipo'], IconName> = {
  Receita: 'arrow-down-left',
  Despesa: 'arrow-up-right',
  Transferencia: 'swap',
};

const TIPO_FALLBACK: Record<Transacao['tipo'], string> = {
  Receita: 'bg-success-soft text-income',
  Despesa: 'bg-danger-soft text-expense',
  Transferencia: 'bg-surface-hover text-text-muted',
};

interface TransactionIconProps {
  transacao: Transacao;
  /** Cor da categoria; pinta o círculo com um fundo translúcido. */
  cor?: string | null;
  size?: 'sm' | 'md';
}

/** Círculo do lançamento com um selo de origem (cartão ou conta) no canto. */
export function TransactionIcon({ transacao, cor, size = 'md' }: TransactionIconProps) {
  const usaCartao = Boolean(transacao.cartaoCreditoId);
  const dimension = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';

  return (
    <span aria-hidden="true" className={cn('relative shrink-0', dimension)}>
      <span
        className={cn('flex h-full w-full items-center justify-center rounded-full', !cor && TIPO_FALLBACK[transacao.tipo])}
        style={cor ? { backgroundColor: `color-mix(in oklch, ${cor} 22%, transparent)`, color: cor } : undefined}
      >
        <Icon name={TIPO_ICON[transacao.tipo]} className="h-4 w-4" />
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface text-text-muted ring-2 ring-surface">
        <Icon name={usaCartao ? 'card' : 'bank'} className="h-3 w-3" />
      </span>
    </span>
  );
}

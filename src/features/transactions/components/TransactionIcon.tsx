import { EntityIcon, Icon, type IconName } from '../../../shared/components/icons';
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
  /** Ícone da categoria; sem ele, a seta do tipo de lançamento. */
  icone?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

/** Círculo do lançamento com um selo de origem (cartão ou conta) no canto. */
export function TransactionIcon({ transacao, cor, icone, size = 'md' }: TransactionIconProps) {
  const usaCartao = Boolean(transacao.cartaoCreditoId);
  const dimension = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const iconSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  const badgeSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const badgeIconSize = size === 'lg' ? 'h-3.5 w-3.5' : 'h-3 w-3';

  return (
    <span aria-hidden="true" className={cn('relative shrink-0', dimension)}>
      <span
        className={cn('flex h-full w-full items-center justify-center rounded-full', !cor && TIPO_FALLBACK[transacao.tipo])}
        style={cor ? { backgroundColor: `color-mix(in oklch, ${cor} 22%, transparent)`, color: `color-mix(in oklch, ${cor} 75%, var(--color-text))` } : undefined}
      >
        <EntityIcon name={icone} fallback={TIPO_ICON[transacao.tipo]} className={iconSize} />
      </span>
      <span className={cn('absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-surface text-text-muted ring-2 ring-surface', badgeSize)}>
        <Icon name={usaCartao ? 'card' : 'bank'} className={badgeIconSize} />
      </span>
    </span>
  );
}

import { useState } from 'react';
import type { Transacao } from '../types';
import type { TransactionDisplay } from '../hooks/useTransactionLookups';
import { cn } from '../../../shared/utils/cn';
import { Icon } from '../../../shared/components/icons';
import { TransactionIcon } from './TransactionIcon';
import { Amount } from '../../../shared/components/ui/Amount';
import { Badge } from '../../../shared/components/ui/Badge';
import { TransactionDetailDrawer } from './TransactionDetailDrawer';

const TIPO_VISUAL: Record<Transacao['tipo'], { kind: 'income' | 'expense' | 'transfer' }> = {
  Receita: { kind: 'income' },
  Despesa: { kind: 'expense' },
  Transferencia: { kind: 'transfer' },
};

interface TransactionListItemProps {
  transacao: Transacao;
  display: TransactionDisplay;
  onEdit: () => void;
}

export function TransactionListItem({ transacao, display, onEdit }: TransactionListItemProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const visual = TIPO_VISUAL[transacao.tipo];
  const usaCartao = Boolean(transacao.cartaoCreditoId);
  const categoriaTexto = display.categoria
    ? [display.categoria.nome, display.subcategoriaNome].filter(Boolean).join(' / ')
    : transacao.tipo === 'Transferencia'
      ? 'Transferência'
      : 'Sem categoria';

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [y, m, d] = transacao.data.split('-').map(Number);
  const dataTransacao = new Date(y, m - 1, d);
  const isVencido = transacao.status === 'Pendente' && dataTransacao < startOfToday;
  const isPendente = transacao.status === 'Pendente' && !isVencido;

  const hasBadges = transacao.status === 'Pendente' || Boolean(transacao.recorrenciaId) || display.tags.length > 0;

  return (
    <>
      <li className={cn(
        'relative flex items-center gap-3 px-4 py-3 transition-colors first:rounded-t-card last:rounded-b-card hover:bg-surface-hover',
        isVencido && 'border-l-2 border-danger bg-danger-soft/30',
        isPendente && 'border-l-2 border-warning bg-warning-soft/20',
      )}>
        <TransactionIcon transacao={transacao} cor={display.categoria?.cor} icone={display.categoria?.icone} />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="block min-w-0 truncate text-left text-base font-medium text-text after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-focus"
            >
              {transacao.descricao}
            </button>
            <Amount value={transacao.valor} kind={visual.kind} className="shrink-0 text-base font-semibold" />
          </div>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-text-muted">
            {display.origem && (
              <span className="inline-flex min-w-0 items-center gap-1 rounded-sm bg-surface-hover px-1.5 py-0.5 text-text">
                <Icon name={usaCartao ? 'card' : 'bank'} className="h-3 w-3 shrink-0" />
                <span className="truncate">{usaCartao ? 'Crédito' : 'Débito'} · {display.origem}</span>
              </span>
            )}
            <span className="truncate">{categoriaTexto}</span>
          </p>
          {hasBadges && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {isVencido && <Badge tone="danger">Vencido</Badge>}
              {isPendente && <Badge tone="warning">Pendente</Badge>}
              {transacao.recorrenciaId && (
                <Badge tone="neutral">
                  <Icon name="repeat" className="h-3 w-3" />
                  Recorrente
                </Badge>
              )}
              {display.tags.map((tag) => (
                <Badge key={tag} tone="primary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Icon name="chevron-right" className="relative z-10 h-4 w-4 shrink-0 text-text-muted" />
      </li>

      <TransactionDetailDrawer
        transacao={transacao}
        display={display}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={onEdit}
      />
    </>
  );
}

import type { Transacao } from '../types';
import type { TransactionDisplay } from '../hooks/useTransactionLookups';
import {
  useDeleteRecurrenceMutation,
  useDeleteTransactionMutation,
  useMarkPaidMutation,
  useMarkPendingMutation,
} from '../hooks/useTransactionMutations';
import { ApiError } from '../../../shared/types/api';
import { useConfirm, useToast } from '../../../shared/hooks/useFeedback';
import { cn } from '../../../shared/utils/cn';
import { Icon, type IconName } from '../../../shared/components/icons';
import { ActionMenu, type ActionMenuItem } from '../../../shared/components/ui/ActionMenu';
import { Amount } from '../../../shared/components/ui/Amount';
import { Badge } from '../../../shared/components/ui/Badge';
import { Spinner } from '../../../shared/components/ui/Spinner';

const TIPO_VISUAL: Record<Transacao['tipo'], { icon: IconName; className: string; kind: 'income' | 'expense' | 'transfer' }> = {
  Receita: { icon: 'arrow-down-left', className: 'bg-success-soft text-income', kind: 'income' },
  Despesa: { icon: 'arrow-up-right', className: 'bg-surface-sunken text-text-muted', kind: 'expense' },
  Transferencia: { icon: 'swap', className: 'bg-primary-soft text-primary-text', kind: 'transfer' },
};

interface TransactionListItemProps {
  transacao: Transacao;
  display: TransactionDisplay;
  onEdit: () => void;
}

export function TransactionListItem({ transacao, display, onEdit }: TransactionListItemProps) {
  const markPaidMutation = useMarkPaidMutation();
  const markPendingMutation = useMarkPendingMutation();
  const deleteMutation = useDeleteTransactionMutation();
  const deleteRecurrenceMutation = useDeleteRecurrenceMutation();
  const confirm = useConfirm();
  const toast = useToast();

  const busy =
    markPaidMutation.isPending ||
    markPendingMutation.isPending ||
    deleteMutation.isPending ||
    deleteRecurrenceMutation.isPending;

  const callbacks = (message: string) => ({
    onSuccess: () => toast(message),
    onError: (error: Error) =>
      toast({ tone: 'danger', message: error instanceof ApiError ? error.message : 'Não foi possível concluir a ação.' }),
  });

  const visual = TIPO_VISUAL[transacao.tipo];
  const usaCartao = Boolean(transacao.cartaoCreditoId);
  const categoriaTexto = display.categoria
    ? [display.categoria.nome, display.subcategoriaNome].filter(Boolean).join(' / ')
    : transacao.tipo === 'Transferencia'
      ? 'Transferência'
      : 'Sem categoria';

  const hasBadges = transacao.status === 'Pendente' || Boolean(transacao.recorrenciaId) || display.tags.length > 0;

  const items: ActionMenuItem[] = [
    { label: 'Editar', icon: 'pencil', onSelect: onEdit },
    transacao.status === 'Pendente'
      ? {
          label: 'Marcar como pago',
          icon: 'check',
          onSelect: () => markPaidMutation.mutate(transacao.id, callbacks('Lançamento marcado como pago')),
        }
      : {
          label: 'Marcar como pendente',
          icon: 'clock',
          onSelect: () => markPendingMutation.mutate(transacao.id, callbacks('Lançamento marcado como pendente')),
        },
  ];

  if (transacao.recorrenciaId) {
    const recorrenciaId = transacao.recorrenciaId;
    items.push({
      label: 'Cancelar recorrência',
      icon: 'repeat',
      tone: 'danger',
      onSelect: async () => {
        const ok = await confirm({
          title: 'Cancelar recorrência?',
          description: 'As próximas ocorrências pendentes serão removidas. Lançamentos já pagos são mantidos.',
          confirmLabel: 'Cancelar recorrência',
          destructive: true,
        });
        if (ok) deleteRecurrenceMutation.mutate(recorrenciaId, callbacks('Recorrência cancelada'));
      },
    });
  }

  items.push({
    label: 'Excluir',
    icon: 'trash',
    tone: 'danger',
    onSelect: async () => {
      const ok = await confirm({
        title: 'Excluir lançamento?',
        description: `"${transacao.descricao}" será removido do extrato.`,
        confirmLabel: 'Excluir',
        destructive: true,
      });
      if (ok) deleteMutation.mutate(transacao.id, callbacks('Lançamento excluído'));
    },
  });

  return (
    <li className={cn('relative flex items-center gap-3 px-4 py-3 transition-colors first:rounded-t-card last:rounded-b-card hover:bg-surface-hover', busy && 'opacity-60')}>
      <span
        aria-hidden="true"
        className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', visual.className)}
      >
        <Icon name={usaCartao ? 'card' : visual.icon} className="h-[18px] w-[18px]" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="block min-w-0 truncate text-left text-base font-medium text-text after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-focus"
          >
            {transacao.descricao}
          </button>
          <Amount value={transacao.valor} kind={visual.kind} className="shrink-0 text-base font-semibold" />
        </div>
        <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm text-text-muted">
          {display.categoria?.cor && (
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: display.categoria.cor }}
            />
          )}
          <span className="truncate">{[categoriaTexto, display.origem].filter(Boolean).join(' · ')}</span>
        </p>
        {hasBadges && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {transacao.status === 'Pendente' && <Badge tone="warning">Pendente</Badge>}
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

      <div className="relative z-10 flex w-10 shrink-0 justify-center">
        {busy ? (
          <Spinner size="sm" className="text-text-muted" />
        ) : (
          <ActionMenu label={`Ações de ${transacao.descricao}`} items={items} />
        )}
      </div>
    </li>
  );
}

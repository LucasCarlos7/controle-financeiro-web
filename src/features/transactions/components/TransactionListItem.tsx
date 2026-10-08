import type { Transacao } from '../types';
import { formatCurrency, formatDate } from '../../../shared/utils/format';
import {
  useDeleteRecurrenceMutation,
  useDeleteTransactionMutation,
  useMarkPaidMutation,
  useMarkPendingMutation,
} from '../hooks/useTransactionMutations';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { Icon } from '../../../shared/components/icons';

const TIPO_COLORS: Record<Transacao['tipo'], string> = {
  Receita: 'text-emerald-600 dark:text-emerald-400',
  Despesa: 'text-red-600 dark:text-red-400',
  Transferencia: 'text-slate-600 dark:text-slate-400',
};

const TIPO_SIGN: Record<Transacao['tipo'], string> = {
  Receita: '+',
  Despesa: '-',
  Transferencia: '',
};

interface TransactionListItemProps {
  transacao: Transacao;
  onEdit: () => void;
}

export function TransactionListItem({ transacao, onEdit }: TransactionListItemProps) {
  const markPaidMutation = useMarkPaidMutation();
  const markPendingMutation = useMarkPendingMutation();
  const deleteMutation = useDeleteTransactionMutation();
  const deleteRecurrenceMutation = useDeleteRecurrenceMutation();

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] transition-shadow hover:shadow-md hover:shadow-slate-900/[0.05] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900 dark:text-slate-100">{transacao.descricao}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(transacao.data)}</p>
        </div>
        <p className={`shrink-0 text-right font-semibold ${TIPO_COLORS[transacao.tipo]}`}>
          {TIPO_SIGN[transacao.tipo]}
          {formatCurrency(transacao.valor)}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={transacao.status === 'Pago' ? 'success' : 'warning'}>{transacao.status}</Badge>
        {transacao.recorrenciaId && <Badge tone="neutral">Recorrente</Badge>}
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          <Icon name="pencil" className="h-3.5 w-3.5" />
          Editar
        </Button>
        {transacao.status === 'Pendente' ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markPaidMutation.mutate(transacao.id)}
            disabled={markPaidMutation.isPending}
          >
            <Icon name="check" className="h-3.5 w-3.5" />
            Marcar como pago
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markPendingMutation.mutate(transacao.id)}
            disabled={markPendingMutation.isPending}
          >
            Marcar como pendente
          </Button>
        )}
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => {
            if (window.confirm('Excluir esta transação?')) {
              deleteMutation.mutate(transacao.id);
            }
          }}
        >
          <Icon name="trash" className="h-3.5 w-3.5" />
          Excluir
        </Button>
        {transacao.recorrenciaId && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={deleteRecurrenceMutation.isPending}
            onClick={() => {
              if (window.confirm('Cancelar as próximas ocorrências desta recorrência? Lançamentos já pagos serão mantidos.')) {
                deleteRecurrenceMutation.mutate(transacao.recorrenciaId as string);
              }
            }}
          >
            Cancelar recorrência
          </Button>
        )}
      </div>
    </li>
  );
}

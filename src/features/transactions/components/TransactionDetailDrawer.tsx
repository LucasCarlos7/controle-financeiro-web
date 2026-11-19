import { useConfirm, useToast } from '../../../shared/hooks/useFeedback';
import { ApiError } from '../../../shared/types/api';
import { Amount } from '../../../shared/components/ui/Amount';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { Icon } from '../../../shared/components/icons';
import { Modal } from '../../../shared/components/ui/Modal';
import { TransactionIcon } from './TransactionIcon';
import { cn } from '../../../shared/utils/cn';
import { formatDate } from '../../../shared/utils/format';
import {
  useDeleteRecurrenceMutation,
  useDeleteTransactionMutation,
  useMarkPaidMutation,
  useMarkPendingMutation,
  useMarkReceivedMutation,
} from '../hooks/useTransactionMutations';
import { isRealizado } from '../types';
import type { Transacao } from '../types';
import type { TransactionDisplay } from '../hooks/useTransactionLookups';

const TIPO_VISUAL: Record<Transacao['tipo'], { kind: 'income' | 'expense' | 'transfer' }> = {
  Receita: { kind: 'income' },
  Despesa: { kind: 'expense' },
  Transferencia: { kind: 'transfer' },
};

interface TransactionDetailDrawerProps {
  transacao: Transacao;
  display: TransactionDisplay;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function TransactionDetailDrawer({ transacao, display, open, onClose, onEdit }: TransactionDetailDrawerProps) {
  const markPaidMutation = useMarkPaidMutation();
  const markReceivedMutation = useMarkReceivedMutation();
  const markPendingMutation = useMarkPendingMutation();
  const deleteMutation = useDeleteTransactionMutation();
  const deleteRecurrenceMutation = useDeleteRecurrenceMutation();
  const confirm = useConfirm();
  const toast = useToast();

  const visual = TIPO_VISUAL[transacao.tipo];
  const isEfetivada = isRealizado(transacao.status);
  const isReceita = transacao.tipo === 'Receita';
  const usaCartao = Boolean(transacao.cartaoCreditoId);

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [y, m, d] = transacao.data.split('-').map(Number);
  const dataTransacao = new Date(y, m - 1, d);
  const isVencido = transacao.status === 'Pendente' && dataTransacao < startOfToday;
  const isPendente = transacao.status === 'Pendente' && !isVencido;

  const categoriaTexto = display.categoria
    ? [display.categoria.nome, display.subcategoriaNome].filter(Boolean).join(' / ')
    : transacao.tipo === 'Transferencia'
      ? 'Transferência'
      : 'Sem categoria';

  const busy =
    markPaidMutation.isPending ||
    markReceivedMutation.isPending ||
    markPendingMutation.isPending ||
    deleteMutation.isPending ||
    deleteRecurrenceMutation.isPending;

  function errorCallback(error: Error) {
    toast({ tone: 'danger', message: error instanceof ApiError ? error.message : 'Não foi possível concluir a ação.' });
  }

  function handleToggleEfetivada() {
    if (isEfetivada) {
      markPendingMutation.mutate(transacao.id, {
        onSuccess: () => { toast('Lançamento marcado como pendente'); onClose(); },
        onError: errorCallback,
      });
    } else if (isReceita) {
      markReceivedMutation.mutate(transacao.id, {
        onSuccess: () => { toast('Receita marcada como recebida'); onClose(); },
        onError: errorCallback,
      });
    } else {
      markPaidMutation.mutate(transacao.id, {
        onSuccess: () => { toast('Lançamento marcado como pago'); onClose(); },
        onError: errorCallback,
      });
    }
  }

  async function handleDelete() {
    const ok = await confirm({
      title: 'Apagar transação?',
      description: `"${transacao.descricao}" será removido do extrato.`,
      confirmLabel: 'Apagar',
      destructive: true,
    });
    if (!ok) return;
    deleteMutation.mutate(transacao.id, {
      onSuccess: () => { toast('Lançamento apagado'); onClose(); },
      onError: errorCallback,
    });
  }

  async function handleDeleteRecurrence() {
    const recorrenciaId = transacao.recorrenciaId;
    if (!recorrenciaId) return;
    const ok = await confirm({
      title: 'Cancelar recorrência?',
      description: 'As próximas ocorrências pendentes serão removidas. Lançamentos já pagos são mantidos.',
      confirmLabel: 'Cancelar recorrência',
      destructive: true,
    });
    if (!ok) return;
    deleteRecurrenceMutation.mutate(recorrenciaId, {
      onSuccess: () => { toast('Recorrência cancelada'); onClose(); },
      onError: errorCallback,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={transacao.descricao} variant="sheet">
      <div className="flex flex-col gap-5">
        {/* amount + icon */}
        <div className="flex flex-col items-center gap-3 py-2">
          <TransactionIcon transacao={transacao} cor={display.categoria?.cor} icone={display.categoria?.icone} />
          <Amount value={transacao.valor} kind={visual.kind} className="text-3xl font-bold" />
        </div>

        {/* details */}
        <div className="rounded-xl bg-surface-sunken">
          <DetailRow icon="calendar" label="Data" value={formatDate(transacao.data)} />
          <DetailRow icon="tag" label="Categoria" value={categoriaTexto} />
          {display.origem && (
            <DetailRow
              icon={usaCartao ? 'card' : 'bank'}
              label={usaCartao ? 'Cartão' : 'Conta'}
              value={display.origem}
              last
            />
          )}
        </div>

        {/* badges */}
        {(isVencido || isPendente || isEfetivada || transacao.recorrenciaId || display.tags.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {isVencido && <Badge tone="danger">Vencido</Badge>}
            {isPendente && <Badge tone="warning">Pendente</Badge>}
            {isEfetivada && <Badge tone="success">{isReceita ? 'Recebido' : 'Pago'}</Badge>}
            {transacao.recorrenciaId && (
              <Badge tone="neutral">
                <Icon name="repeat" className="h-3 w-3" />
                Recorrente
              </Badge>
            )}
            {display.tags.map((tag) => (
              <Badge key={tag} tone="primary">#{tag}</Badge>
            ))}
          </div>
        )}

        {/* edit */}
        <Button variant="outline" className="w-full" onClick={() => { onClose(); onEdit(); }}>
          <Icon name="pencil" className="h-4 w-4" />
          Editar
        </Button>

        {/* ajustes */}
        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-text-muted">Ajustes</p>
          <div className="rounded-xl bg-surface-sunken">
            <label className="flex cursor-pointer items-center justify-between px-4 py-3.5">
              <span className="text-base font-medium text-text">{isReceita ? 'Já recebi' : 'Já paguei'}</span>
              <input
                type="checkbox"
                role="switch"
                checked={isEfetivada}
                disabled={busy}
                onChange={handleToggleEfetivada}
                className="h-6 w-11 cursor-pointer appearance-none rounded-full bg-border transition-colors duration-200 checked:bg-primary
                  disabled:opacity-50
                  relative after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 after:content-[''] checked:after:translate-x-5"
              />
            </label>
          </div>
        </div>

        {/* delete actions */}
        <div className="flex flex-col gap-2 pb-2">
          {transacao.recorrenciaId && (
            <button
              type="button"
              disabled={busy}
              onClick={handleDeleteRecurrence}
              className="text-center text-base font-medium text-warning disabled:opacity-50"
            >
              Cancelar recorrência
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={handleDelete}
            className="text-center text-base font-medium text-danger disabled:opacity-50"
          >
            Apagar transação
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}

function DetailRow({ icon, label, value, last }: DetailRowProps) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3', !last && 'border-b border-border')}>
      <Icon name={icon as Parameters<typeof Icon>[0]['name']} className="h-4 w-4 shrink-0 text-text-muted" />
      <span className="min-w-0 flex-1 text-sm text-text-muted">{label}</span>
      <span className="text-sm font-medium text-text">{value}</span>
    </div>
  );
}

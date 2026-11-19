import { useTransactionLookups } from '../hooks/useTransactionLookups';
import { isRealizado } from '../types';
import type { Transacao, TransactionSortOrder } from '../types';
import { Amount } from '../../../shared/components/ui/Amount';
import { Card } from '../../../shared/components/ui/Card';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { formatDayHeading } from '../../../shared/utils/format';
import { TransactionListItem } from './TransactionListItem';

interface DayGroup {
  data: string;
  saldo: number;
  items: Transacao[];
}

function groupByDay(transacoes: Transacao[], ordenacao: TransactionSortOrder): DayGroup[] {
  const dateAsc = ordenacao === 'data_asc';
  const sorted = [...transacoes].sort((a, b) =>
    dateAsc ? a.data.localeCompare(b.data) : b.data.localeCompare(a.data),
  );
  const groups = new Map<string, DayGroup>();
  for (const transacao of sorted) {
    const group = groups.get(transacao.data) ?? { data: transacao.data, saldo: 0, items: [] };
    group.items.push(transacao);
    // Saldo diário considera apenas realizados (Pago/Recebido)
    if (isRealizado(transacao.status)) {
      if (transacao.tipo === 'Receita') group.saldo += transacao.valor;
      if (transacao.tipo === 'Despesa') group.saldo -= transacao.valor;
    }
    groups.set(transacao.data, group);
  }
  const result = [...groups.values()];
  if (ordenacao === 'valor_desc' || ordenacao === 'valor_asc') {
    const valorAsc = ordenacao === 'valor_asc';
    for (const group of result) {
      group.items.sort((a, b) => (valorAsc ? a.valor - b.valor : b.valor - a.valor));
    }
  }
  return result;
}

interface TransactionListProps {
  transacoes: Transacao[];
  onEdit: (transacao: Transacao) => void;
  ordenacao: TransactionSortOrder;
}

export function TransactionList({ transacoes, onEdit, ordenacao }: TransactionListProps) {
  const describe = useTransactionLookups();

  return (
    <div className="space-y-3">
      {groupByDay(transacoes, ordenacao).map((group) => (
        <Card as="section" key={group.data} padding="none" aria-label={formatDayHeading(group.data)}>
          <div className="flex items-baseline justify-between gap-3 px-4 pb-1 pt-3.5">
            <h2 className="text-base font-semibold text-text">{formatDayHeading(group.data)}</h2>
            {group.saldo !== 0 && (
              <span className="text-sm text-text-muted">
                Dia: <Amount value={group.saldo} kind="balance" className="font-semibold text-text" />
              </span>
            )}
          </div>
          <ul>
            {group.items.map((transacao) => (
              <TransactionListItem
                key={transacao.id}
                transacao={transacao}
                display={describe(transacao)}
                onEdit={() => onEdit(transacao)}
              />
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export function TransactionListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando lançamentos" className="space-y-6">
      {[3, 2].map((rows, group) => (
        <div key={group}>
          <Skeleton className="mb-3 ml-1 h-4 w-32" />
          <Card padding="none">
            <ul className="divide-y divide-border">
              {Array.from({ length: rows }, (_, index) => (
                <li key={index} className="flex items-center gap-3 px-4 py-3.5">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="mt-2 h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ))}
    </div>
  );
}

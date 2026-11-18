import { useTransactionLookups } from '../hooks/useTransactionLookups';
import type { Transacao } from '../types';
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

/** Agrupa por data mantendo a ordem da API; transferências não entram no saldo do dia. */
function groupByDay(transacoes: Transacao[]): DayGroup[] {
  const groups = new Map<string, DayGroup>();
  for (const transacao of transacoes) {
    const group = groups.get(transacao.data) ?? { data: transacao.data, saldo: 0, items: [] };
    group.items.push(transacao);
    if (transacao.tipo === 'Receita') group.saldo += transacao.valor;
    if (transacao.tipo === 'Despesa') group.saldo -= transacao.valor;
    groups.set(transacao.data, group);
  }
  return [...groups.values()];
}

interface TransactionListProps {
  transacoes: Transacao[];
  onEdit: (transacao: Transacao) => void;
}

export function TransactionList({ transacoes, onEdit }: TransactionListProps) {
  const describe = useTransactionLookups();

  return (
    <div className="space-y-3">
      {groupByDay(transacoes).map((group) => (
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

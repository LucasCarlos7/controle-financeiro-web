import { useState } from 'react';
import { useTransactionsQuery } from './hooks/useTransactionsQuery';
import { useNewTransaction } from './hooks/useNewTransaction';
import { TransactionFiltersBar } from './components/TransactionFiltersBar';
import { TransactionFormModal } from './components/TransactionFormModal';
import { TransactionList, TransactionListSkeleton } from './components/TransactionList';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Amount } from '../../shared/components/ui/Amount';
import { Button } from '../../shared/components/ui/Button';
import { Icon } from '../../shared/components/icons';
import type { Transacao, TransactionFilters } from './types';

function totais(transacoes: Transacao[]) {
  return transacoes.reduce(
    (acc, transacao) => {
      if (transacao.tipo === 'Receita') acc.entradas += transacao.valor;
      if (transacao.tipo === 'Despesa') acc.saidas += transacao.valor;
      return acc;
    },
    { entradas: 0, saidas: 0 },
  );
}

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { data, isLoading, isError, error, refetch } = useTransactionsQuery(filters);
  const [modalState, setModalState] = useState<{ open: boolean; transaction?: Transacao }>({ open: false });
  const hasFilters = Object.values(filters).some(Boolean);
  const openNew = useNewTransaction();

  return (
    <div>
      <PageHeader
        title="Extrato"
        description="Receitas, despesas e transferências"
        action={
          <Button type="button" onClick={openNew}>
            <Icon name="plus" className="h-4 w-4" />
            Novo lançamento
          </Button>
        }
      />

      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      {isLoading && <TransactionListSkeleton />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="document"
          title={hasFilters ? 'Nenhum lançamento encontrado' : 'Nenhum lançamento ainda'}
          description={
            hasFilters
              ? 'Nenhum lançamento corresponde à busca e aos filtros.'
              : 'Registre receitas, despesas e transferências para acompanhar seu dinheiro.'
          }
          action={
            hasFilters ? (
              <Button type="button" variant="outline" onClick={() => setFilters({})}>
                Limpar busca e filtros
              </Button>
            ) : (
              <Button type="button" onClick={openNew}>
                <Icon name="plus" className="h-4 w-4" />
                Novo lançamento
              </Button>
            )
          }
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <>
          <p className="mb-4 flex flex-wrap gap-x-4 gap-y-1 px-1 text-sm text-text-muted">
            <span>
              {data.length} {data.length === 1 ? 'lançamento' : 'lançamentos'}
            </span>
            <span>
              Entradas <Amount value={totais(data).entradas} kind="income" className="font-medium" />
            </span>
            <span>
              Saídas <Amount value={totais(data).saidas} kind="expense" className="font-medium text-text" />
            </span>
          </p>
          <TransactionList transacoes={data} onEdit={(transaction) => setModalState({ open: true, transaction })} />
        </>
      )}

      <TransactionFormModal
        open={modalState.open}
        transaction={modalState.transaction}
        onClose={() => setModalState({ open: false })}
      />
    </div>
  );
}

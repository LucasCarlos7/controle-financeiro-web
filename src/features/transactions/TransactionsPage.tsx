import { useState } from 'react';
import { useTransactionsQuery } from './hooks/useTransactionsQuery';
import { TransactionFiltersBar } from './components/TransactionFiltersBar';
import { TransactionFormModal } from './components/TransactionFormModal';
import { TransactionListItem } from './components/TransactionListItem';
import { Spinner } from '../../shared/components/Spinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { EmptyState } from '../../shared/components/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Button } from '../../shared/components/ui/Button';
import { Icon } from '../../shared/components/icons';
import type { Transacao, TransactionFilters } from './types';

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { data, isLoading, isError, error, refetch } = useTransactionsQuery(filters);
  const [modalState, setModalState] = useState<{ open: boolean; transaction?: Transacao }>({ open: false });

  return (
    <div>
      <PageHeader
        title="Extrato"
        action={
          <Button type="button" onClick={() => setModalState({ open: true })}>
            <Icon name="plus" className="h-4 w-4" />
            Novo lançamento
          </Button>
        }
      />

      <TransactionFiltersBar filters={filters} onChange={setFilters} />

      {isLoading && <Spinner label="Carregando transações..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="document"
          title="Nenhuma transação encontrada"
          description="Ajuste os filtros ou registre um novo lançamento."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-2.5">
          {data.map((transacao) => (
            <TransactionListItem
              key={transacao.id}
              transacao={transacao}
              onEdit={() => setModalState({ open: true, transaction: transacao })}
            />
          ))}
        </ul>
      )}

      <TransactionFormModal
        open={modalState.open}
        transaction={modalState.transaction}
        onClose={() => setModalState({ open: false })}
      />
    </div>
  );
}

import { useState } from 'react';
import { useTransactionsQuery } from './hooks/useTransactionsQuery';
import { useNewTransaction } from './hooks/useNewTransaction';
import { TransactionFiltersBar } from './components/TransactionFiltersBar';
import { TransactionFormModal } from './components/TransactionFormModal';
import { TransactionList, TransactionListSkeleton } from './components/TransactionList';
import { StatementSummary } from './components/StatementSummary';
import { useSpendingByCategoryQuery } from '../dashboard/hooks/useDashboardQueries';
import { CategoryBreakdownChart } from '../dashboard/components/CategoryBreakdownChart';
import { DashboardCard } from '../dashboard/components/DashboardCard';
import { BudgetsCard } from '../dashboard/components/OverviewCards';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Button } from '../../shared/components/ui/Button';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { TextLink } from '../../shared/components/ui/TextLink';
import { Icon } from '../../shared/components/icons';
import { formatMonthYear } from '../../shared/utils/format';
import type { Transacao, TransactionFilters } from './types';

/** Painel lateral: gastos do mês corrente por categoria e os limites de orçamento. */
function MonthPanel() {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = now.getMonth() + 1;
  const { data, isLoading, isError, error, refetch } = useSpendingByCategoryQuery(ano, mes);

  return (
    <aside aria-label="Resumo do mês" className="xl:sticky xl:top-20">
      <h2 className="mb-3 text-xl font-semibold tracking-tight text-text">{formatMonthYear(ano, mes)}</h2>
      <DashboardCard title="Gastos do mês" action={<TextLink to="/dashboard">Ver painel</TextLink>}>
        {isLoading && <Skeleton className="mx-auto h-44 w-44 rounded-full" />}
        {isError && <ErrorState variant="compact" error={error} onRetry={() => refetch()} />}
        {data && data.length === 0 && <p className="py-6 text-center text-base text-text-muted">Sem despesas neste mês.</p>}
        {data && data.length > 0 && <CategoryBreakdownChart data={data} />}
      </DashboardCard>
      <BudgetsCard ano={ano} mes={mes} />
    </aside>
  );
}

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { data, isLoading, isError, error, refetch } = useTransactionsQuery(filters);
  const [editing, setEditing] = useState<Transacao | undefined>();
  const hasFilters = Object.values(filters).some(Boolean);
  const openNew = useNewTransaction();

  return (
    <div>
      <PageHeader
        title="Extrato"
        action={
          <Button type="button" onClick={openNew}>
            <Icon name="plus" className="h-4 w-4" />
            Novo lançamento
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
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
              <StatementSummary transacoes={data} />
              <TransactionList transacoes={data} onEdit={setEditing} />
            </>
          )}
        </div>

        <MonthPanel />
      </div>

      <TransactionFormModal open={Boolean(editing)} transaction={editing} onClose={() => setEditing(undefined)} />
    </div>
  );
}

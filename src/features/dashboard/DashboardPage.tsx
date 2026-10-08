import { useMemo, useState } from 'react';
import { MonthYearPicker } from '../../shared/components/ui/MonthYearPicker';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { TextLink } from '../../shared/components/ui/TextLink';
import { toApiDate } from '../../shared/utils/format';
import { BalanceCard } from './components/BalanceCard';
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart';
import { DashboardCard } from './components/DashboardCard';
import { EvolutionLegend, MonthlyEvolutionChart } from './components/MonthlyEvolutionChart';
import {
  AccountsCard,
  BudgetsCard,
  CreditCardsCard,
  GoalsCard,
  LatestTransactionsCard,
} from './components/OverviewCards';
import {
  useMonthlyEvolutionQuery,
  useMonthlySummaryQuery,
  useSpendingByCategoryQuery,
} from './hooks/useDashboardQueries';

function getEvolutionRange(ano: number, mes: number) {
  const end = new Date(ano, mes - 1, 1);
  const start = new Date(ano, mes - 1 - 5, 1);
  return { dataInicio: toApiDate(start), dataFim: toApiDate(end) };
}

export function DashboardPage() {
  const now = new Date();
  const [periodo, setPeriodo] = useState({ ano: now.getFullYear(), mes: now.getMonth() + 1 });

  const summaryQuery = useMonthlySummaryQuery(periodo.ano, periodo.mes);
  const categoryQuery = useSpendingByCategoryQuery(periodo.ano, periodo.mes);
  const { dataInicio, dataFim } = useMemo(() => getEvolutionRange(periodo.ano, periodo.mes), [periodo]);
  const evolutionQuery = useMonthlyEvolutionQuery(dataInicio, dataFim);

  return (
    <div>
      <PageHeader
        title="Início"
        action={<MonthYearPicker ano={periodo.ano} mes={periodo.mes} onChange={(ano, mes) => setPeriodo({ ano, mes })} />}
      />

      <div className="gap-4 md:columns-2 2xl:columns-3">
        <BalanceCard
          ano={periodo.ano}
          mes={periodo.mes}
          resumo={summaryQuery.data}
          evolucao={evolutionQuery.data}
          isLoading={summaryQuery.isLoading}
          error={summaryQuery.error}
          onRetry={() => summaryQuery.refetch()}
        />

        <DashboardCard title="Gastos por categoria" action={<TextLink to="/orcamentos">Definir limites</TextLink>}>
          {categoryQuery.isLoading && <Skeleton className="mx-auto h-44 w-44 rounded-full" />}
          {categoryQuery.isError && (
            <ErrorState variant="compact" error={categoryQuery.error} onRetry={() => categoryQuery.refetch()} />
          )}
          {categoryQuery.data && categoryQuery.data.length === 0 && (
            <EmptyState
              variant="compact"
              icon="pie"
              title="Sem despesas neste mês"
              description="Registre seus gastos e comece a ter visibilidade das suas finanças."
            />
          )}
          {categoryQuery.data && categoryQuery.data.length > 0 && <CategoryBreakdownChart data={categoryQuery.data} />}
        </DashboardCard>

        <LatestTransactionsCard />
        <AccountsCard />
        <CreditCardsCard />
        <BudgetsCard ano={periodo.ano} mes={periodo.mes} />

        <DashboardCard title="Receitas e despesas" action={<TextLink to="/extrato">Ver extrato</TextLink>}>
          {evolutionQuery.isLoading && <Skeleton className="h-[280px]" />}
          {evolutionQuery.isError && (
            <ErrorState variant="compact" error={evolutionQuery.error} onRetry={() => evolutionQuery.refetch()} />
          )}
          {evolutionQuery.data && evolutionQuery.data.length > 0 && (
            <>
              <EvolutionLegend />
              <div className="mt-3">
                <MonthlyEvolutionChart data={evolutionQuery.data} />
              </div>
            </>
          )}
        </DashboardCard>

        <GoalsCard />
      </div>
    </div>
  );
}

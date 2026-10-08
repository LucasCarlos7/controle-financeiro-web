import { useMemo, useState } from 'react';
import { MonthYearPicker } from '../../shared/components/ui/MonthYearPicker';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { Card, CardHeader } from '../../shared/components/ui/Card';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { formatMonthYear, toApiDate } from '../../shared/utils/format';
import { SummaryCards, SummaryCardsSkeleton } from './components/SummaryCards';
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart';
import { EvolutionLegend, MonthlyEvolutionChart } from './components/MonthlyEvolutionChart';
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

function CategorySkeleton() {
  return (
    <div className="space-y-5">
      {[72, 56, 40, 32, 20].map((width) => (
        <div key={width}>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="mt-2 h-1.5" style={{ width: `${width}%` }} />
        </div>
      ))}
    </div>
  );
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
        description={`Resumo de ${formatMonthYear(periodo.ano, periodo.mes).toLowerCase()}`}
        action={<MonthYearPicker ano={periodo.ano} mes={periodo.mes} onChange={(ano, mes) => setPeriodo({ ano, mes })} />}
      />

      {summaryQuery.isLoading && <SummaryCardsSkeleton />}
      {summaryQuery.isError && (
        <div className="mb-4 sm:mb-6">
          <ErrorState error={summaryQuery.error} onRetry={() => summaryQuery.refetch()} />
        </div>
      )}
      {summaryQuery.data && <SummaryCards resumo={summaryQuery.data} />}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
        <Card as="section" aria-labelledby="evolucao-titulo" className="lg:col-span-3">
          <CardHeader
            title={<span id="evolucao-titulo">Evolução mensal</span>}
            description="Últimos 6 meses"
            className="flex-wrap"
            action={evolutionQuery.data && evolutionQuery.data.length > 0 ? <EvolutionLegend /> : undefined}
          />
          {evolutionQuery.isLoading && <Skeleton className="h-[280px]" />}
          {evolutionQuery.isError && (
            <ErrorState variant="compact" error={evolutionQuery.error} onRetry={() => evolutionQuery.refetch()} />
          )}
          {evolutionQuery.data && evolutionQuery.data.length === 0 && (
            <EmptyState
              variant="compact"
              icon="pie"
              title="Sem histórico ainda"
              description="A evolução aparece quando houver lançamentos nos últimos meses."
            />
          )}
          {evolutionQuery.data && evolutionQuery.data.length > 0 && <MonthlyEvolutionChart data={evolutionQuery.data} />}
        </Card>

        <Card as="section" aria-labelledby="categorias-titulo" className="lg:col-span-2">
          <CardHeader
            title={<span id="categorias-titulo">Gastos por categoria</span>}
            description="Despesas pagas no mês"
          />
          {categoryQuery.isLoading && <CategorySkeleton />}
          {categoryQuery.isError && (
            <ErrorState variant="compact" error={categoryQuery.error} onRetry={() => categoryQuery.refetch()} />
          )}
          {categoryQuery.data && categoryQuery.data.length === 0 && (
            <EmptyState
              variant="compact"
              icon="tag"
              title="Sem despesas neste mês"
              description="Registre lançamentos para ver o detalhamento por categoria."
            />
          )}
          {categoryQuery.data && categoryQuery.data.length > 0 && <CategoryBreakdownChart data={categoryQuery.data} />}
        </Card>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { MonthYearPicker } from '../../shared/components/MonthYearPicker';
import { Spinner } from '../../shared/components/Spinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { EmptyState } from '../../shared/components/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { toApiDate } from '../../shared/utils/format';
import { SummaryCards } from './components/SummaryCards';
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart';
import { MonthlyEvolutionChart } from './components/MonthlyEvolutionChart';
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
      <PageHeader title="Início" description="Resumo financeiro do período selecionado" />
      <MonthYearPicker ano={periodo.ano} mes={periodo.mes} onChange={(ano, mes) => setPeriodo({ ano, mes })} />

      {summaryQuery.isLoading && <Spinner label="Carregando resumo..." />}
      {summaryQuery.isError && <ErrorState error={summaryQuery.error} onRetry={() => summaryQuery.refetch()} />}
      {summaryQuery.data && <SummaryCards resumo={summaryQuery.data} />}

      <div className="space-y-4">
        {categoryQuery.isLoading && <Spinner label="Carregando gastos por categoria..." />}
        {categoryQuery.isError && (
          <ErrorState error={categoryQuery.error} onRetry={() => categoryQuery.refetch()} />
        )}
        {categoryQuery.data && categoryQuery.data.length === 0 && (
          <EmptyState
            title="Sem despesas neste mês"
            description="Registre lançamentos para ver o detalhamento por categoria."
          />
        )}
        {categoryQuery.data && categoryQuery.data.length > 0 && <CategoryBreakdownChart data={categoryQuery.data} />}

        {evolutionQuery.isLoading && <Spinner label="Carregando evolução mensal..." />}
        {evolutionQuery.isError && (
          <ErrorState error={evolutionQuery.error} onRetry={() => evolutionQuery.refetch()} />
        )}
        {evolutionQuery.data && evolutionQuery.data.length > 0 && <MonthlyEvolutionChart data={evolutionQuery.data} />}
      </div>
    </div>
  );
}

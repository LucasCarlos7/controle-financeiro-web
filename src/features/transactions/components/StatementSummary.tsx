import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useMonthlyEvolutionQuery } from '../../dashboard/hooks/useDashboardQueries';
import type { EvolucaoMensal } from '../../dashboard/types';
import { Amount } from '../../../shared/components/ui/Amount';
import { Card } from '../../../shared/components/ui/Card';
import { useChartTheme } from '../../../shared/hooks/useChartTheme';
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion';
import { formatMonthYear, MESES, toApiDate } from '../../../shared/utils/format';
import type { Transacao } from '../types';

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

function lastTwelveMonths() {
  const now = new Date();
  return {
    dataInicio: toApiDate(new Date(now.getFullYear(), now.getMonth() - 11, 1)),
    dataFim: toApiDate(new Date(now.getFullYear(), now.getMonth(), 1)),
  };
}

function MonthTooltip({ active, payload }: { active?: boolean; payload?: { payload: EvolucaoMensal }[] }) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="min-w-44 rounded-control border border-border bg-surface-raised px-3 py-2 shadow-raised">
      <p className="mb-1 text-xs font-semibold text-text">{formatMonthYear(point.ano, point.mes)}</p>
      <p className="flex justify-between gap-4 text-xs text-text-muted">
        Receitas <Amount value={point.receitas} kind="income" showSign={false} />
      </p>
      <p className="flex justify-between gap-4 text-xs text-text-muted">
        Despesas <Amount value={point.despesas} kind="expense" showSign={false} />
      </p>
    </div>
  );
}

/** Receitas, despesas e resultado da lista filtrada, com as barras dos últimos 12 meses. */
export function StatementSummary({ transacoes }: { transacoes: Transacao[] }) {
  const { entradas, saidas } = totais(transacoes);
  const resultado = entradas - saidas;
  const range = useMemo(lastTwelveMonths, []);
  const { data } = useMonthlyEvolutionQuery(range.dataInicio, range.dataFim);
  const colors = useChartTheme();
  const animate = !usePrefersReducedMotion();
  const chartData = (data ?? []).map((item) => ({ ...item, label: MESES[item.mes - 1].slice(0, 3) }));

  return (
    <Card className="mb-4">
      <h2 className="sr-only">Resumo do extrato</h2>
      <dl className="grid grid-cols-3 gap-2 text-center">
        <div>
          <dt className="text-sm font-medium text-text-muted">Receitas</dt>
          <dd className="mt-0.5 text-lg font-semibold sm:text-xl">
            <Amount value={entradas} kind="income" showSign={false} split />
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-text-muted">Despesas</dt>
          <dd className="mt-0.5 text-lg font-semibold sm:text-xl">
            <Amount value={saidas} kind="expense" showSign={false} split />
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-text-muted">Resultado</dt>
          <dd className="mt-0.5 text-lg font-semibold text-text sm:text-xl">
            <Amount value={resultado} kind="balance" split />
          </dd>
        </div>
      </dl>
      {chartData.length > 0 && (
        <div className="mt-4" role="img" aria-label="Receitas e despesas dos últimos 12 meses">
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={chartData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }} barGap={1}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: colors.axis }} axisLine={{ stroke: colors.grid }} tickLine={false} interval={0} />
              <Tooltip content={<MonthTooltip />} cursor={{ fill: colors.cursor }} />
              <Bar dataKey="receitas" fill={colors.income} radius={[2, 2, 0, 0]} maxBarSize={10} isAnimationActive={animate} />
              <Bar dataKey="despesas" fill={colors.expense} radius={[2, 2, 0, 0]} maxBarSize={10} isAnimationActive={animate} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

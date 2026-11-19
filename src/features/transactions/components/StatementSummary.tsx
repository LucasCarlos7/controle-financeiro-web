import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useMonthlyEvolutionQuery } from '../../dashboard/hooks/useDashboardQueries';
import type { EvolucaoMensal } from '../../dashboard/types';
import { Amount } from '../../../shared/components/ui/Amount';
import { Card } from '../../../shared/components/ui/Card';
import { Icon } from '../../../shared/components/icons';
import { useChartTheme } from '../../../shared/hooks/useChartTheme';
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion';
import { formatMonthYear, MESES, toApiDate } from '../../../shared/utils/format';
import { isRealizado, isPendenteParaPrevisao } from '../types';
import type { Transacao } from '../types';

function totais(transacoes: Transacao[]) {
  return transacoes.reduce(
    (acc, t) => {
      if (t.status === 'Cancelado') return acc;
      if (t.tipo === 'Receita') {
        if (isRealizado(t.status)) acc.receitasRecebidas += t.valor;
        else if (isPendenteParaPrevisao(t.status)) acc.receitasPendentes += t.valor;
      }
      if (t.tipo === 'Despesa') {
        if (isRealizado(t.status)) acc.despesasPagas += t.valor;
        else if (isPendenteParaPrevisao(t.status)) acc.despesasPendentes += t.valor;
      }
      return acc;
    },
    { receitasRecebidas: 0, despesasPagas: 0, receitasPendentes: 0, despesasPendentes: 0 },
  );
}

function lastTwelveMonths() {
  const now = new Date();
  return {
    dataInicio: toApiDate(new Date(now.getFullYear(), now.getMonth() - 11, 1)),
    dataFim: toApiDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

function MonthTooltip({ active, payload }: { active?: boolean; payload?: { payload: EvolucaoMensal }[] }) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="min-w-44 rounded-control border border-border bg-surface-raised px-3 py-2 shadow-raised">
      <p className="mb-1 text-xs font-semibold text-text">{formatMonthYear(point.ano, point.mes)}</p>
      <p className="flex justify-between gap-4 text-xs text-text-muted">
        Receitas <Amount value={point.receitasRealizadas} kind="income" showSign={false} />
      </p>
      <p className="flex justify-between gap-4 text-xs text-text-muted">
        Despesas <Amount value={point.despesasRealizadas} kind="expense" showSign={false} />
      </p>
    </div>
  );
}

/** Receitas, despesas e resultado (SR e SP) da lista filtrada, com as barras dos últimos 12 meses. */
export function StatementSummary({ transacoes }: { transacoes: Transacao[] }) {
  const { receitasRecebidas, despesasPagas, receitasPendentes, despesasPendentes } = totais(transacoes);
  const saldoRealizado = receitasRecebidas - despesasPagas;
  const saldoPrevisto = receitasRecebidas + receitasPendentes - despesasPagas - despesasPendentes;
  const temPendentes = receitasPendentes > 0 || despesasPendentes > 0;

  const range = useMemo(lastTwelveMonths, []);
  const { data } = useMonthlyEvolutionQuery(range.dataInicio, range.dataFim);
  const colors = useChartTheme();
  const animate = !usePrefersReducedMotion();
  const chartData = (data ?? []).map((item) => ({ ...item, label: MESES[item.mes - 1].slice(0, 3) }));

  return (
    <Card className="mb-4">
      <h2 className="sr-only">Resumo do extrato</h2>

      {/* Totais realizados */}
      <dl className="grid grid-cols-3 divide-x divide-border text-center">
        <div className="px-2 pb-1">
          <dt className="text-xs font-semibold text-income">Recebido</dt>
          <dd className="mt-1 text-lg font-semibold sm:text-xl">
            <Amount value={receitasRecebidas} kind="income" showSign={false} split />
          </dd>
        </div>
        <div className="px-2 pb-1">
          <dt className="text-xs font-semibold text-expense">Pago</dt>
          <dd className="mt-1 text-lg font-semibold sm:text-xl">
            <Amount value={despesasPagas} kind="expense" showSign={false} split />
          </dd>
        </div>
        <div className="px-2 pb-1">
          <dt className="text-xs font-semibold text-text-muted">Realizado</dt>
          <dd className="mt-1 text-lg font-semibold text-text sm:text-xl">
            <Amount value={saldoRealizado} kind="balance" split />
          </dd>
        </div>
      </dl>

      {/* Previsão com pendentes */}
      {temPendentes && (
        <div className="mt-3 rounded-control border border-border bg-surface-sunken px-3 py-2.5">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <Icon name="clock" className="h-3.5 w-3.5 shrink-0 text-text-muted" />
              <span className="text-xs font-medium text-text-muted">Previsão do mês</span>
            </div>
            <Amount value={saldoPrevisto} kind="balance" className="text-sm font-bold" />
          </div>
          <div className={`grid gap-2 ${receitasPendentes > 0 && despesasPendentes > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {receitasPendentes > 0 && (
              <div className="rounded border border-income/20 bg-success-soft/20 px-2.5 py-2">
                <p className="mb-1 flex items-center gap-1 text-[11px] font-medium text-text-muted">
                  <Icon name="arrow-down-left" className="h-3 w-3 shrink-0 text-income" />
                  A receber
                </p>
                <Amount value={receitasPendentes} kind="income" showSign={false} className="text-sm font-semibold" />
              </div>
            )}
            {despesasPendentes > 0 && (
              <div className="rounded border border-expense/20 bg-danger-soft/20 px-2.5 py-2">
                <p className="mb-1 flex items-center gap-1 text-[11px] font-medium text-text-muted">
                  <Icon name="arrow-up-right" className="h-3 w-3 shrink-0 text-expense" />
                  A pagar
                </p>
                <Amount value={despesasPendentes} kind="expense" showSign={false} className="text-sm font-semibold" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gráfico histórico (realizados) */}
      {chartData.length > 0 && (
        <div className="mt-4" role="img" aria-label="Receitas e despesas realizadas dos últimos 12 meses">
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={chartData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }} barGap={1}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: colors.axis }} axisLine={{ stroke: colors.grid }} tickLine={false} interval={0} />
              <Tooltip content={<MonthTooltip />} cursor={{ fill: colors.cursor }} />
              <Bar dataKey="receitasRealizadas" fill={colors.income} radius={[2, 2, 0, 0]} maxBarSize={10} isAnimationActive={animate} />
              <Bar dataKey="despesasRealizadas" fill={colors.expense} radius={[2, 2, 0, 0]} maxBarSize={10} isAnimationActive={animate} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

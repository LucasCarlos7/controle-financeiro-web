import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Amount } from '../../../shared/components/ui/Amount';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ErrorState } from '../../../shared/components/ui/ErrorState';
import { TextLink } from '../../../shared/components/ui/TextLink';
import { useChartTheme } from '../../../shared/hooks/useChartTheme';
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion';
import { formatMonthYear, MESES } from '../../../shared/utils/format';
import type { EvolucaoMensal, ResumoMensal } from '../types';
import { DashboardCard } from './DashboardCard';

interface BalanceCardProps {
  ano: number;
  mes: number;
  resumo?: ResumoMensal;
  evolucao?: EvolucaoMensal[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}

function BalanceTooltip({ active, payload }: { active?: boolean; payload?: { payload: EvolucaoMensal }[] }) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="rounded-control border border-border bg-surface-raised px-3 py-2 shadow-raised">
      <p className="text-xs text-text-muted">{formatMonthYear(point.ano, point.mes)}</p>
      <div className="mt-1 space-y-0.5">
        <p className="text-sm font-semibold text-text">
          <Amount value={point.saldoAcumuladoRealizado} kind="balance" /> <span className="text-xs font-normal text-text-muted">realizado</span>
        </p>
        {point.saldoAcumuladoPrevisto !== point.saldoAcumuladoRealizado && (
          <p className="text-sm font-medium text-text-muted">
            <Amount value={point.saldoAcumuladoPrevisto} kind="balance" /> <span className="text-xs">previsto</span>
          </p>
        )}
      </div>
    </div>
  );
}

/** Card principal do Dashboard: saldo realizado, previsto e curva acumulada. */
export function BalanceCard({ ano, mes, resumo, evolucao, isLoading, error, onRetry }: BalanceCardProps) {
  const colors = useChartTheme();
  const animate = !usePrefersReducedMotion();
  const chartData = (evolucao ?? []).map((item) => ({ ...item, label: MESES[item.mes - 1].slice(0, 3) }));
  const temPendentes = resumo && (resumo.receitasPendentes > 0 || resumo.despesasPendentes > 0);

  return (
    <DashboardCard title="Saldo do mês" action={<TextLink to="/extrato">Ver extrato</TextLink>}>
      {isLoading && (
        <>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-10 w-52" />
          <Skeleton className="mt-4 h-28" />
        </>
      )}
      {!isLoading && error ? <ErrorState variant="compact" error={error} onRetry={onRetry} /> : null}
      {resumo && (
        <>
          <p className="text-sm text-text-muted">Resultado de {formatMonthYear(ano, mes).toLowerCase()}</p>

          {/* Saldo realizado + previsto lado a lado */}
          <div className="mt-0.5 flex flex-wrap items-end gap-x-5 gap-y-0.5">
            <div>
              <p className="text-4xl font-bold tracking-tight text-text">
                <Amount value={resumo.saldoRealizado} kind="balance" split />
              </p>
              <p className="text-xs text-text-muted">realizado</p>
            </div>
            {temPendentes && (
              <div className="mb-0.5">
                <p className="text-xl font-semibold text-text-muted">
                  <Amount value={resumo.saldoPrevisto} kind="balance" split />
                </p>
                <p className="text-xs text-text-muted">previsto</p>
              </div>
            )}
          </div>

          {/* Tabela lançado / realizado / pendente */}
          <div className="mt-3">
            <div className="grid grid-cols-4 items-center gap-x-2 gap-y-1.5">
              <div />
              <p className="text-center text-xs font-medium text-text-muted">Lançado</p>
              <p className="text-center text-xs font-medium text-text-muted">Realizado</p>
              <p className="text-center text-xs font-medium text-warning">Pendente</p>

              <p className="text-xs text-text-muted">Receitas</p>
              <p className="text-center text-sm font-semibold">
                <Amount value={resumo.receitasPrevistas} kind="income" showSign={false} />
              </p>
              <p className="text-center text-sm font-semibold">
                <Amount value={resumo.receitasRecebidas} kind="income" showSign={false} />
              </p>
              <p className="text-center text-sm font-semibold">
                <Amount value={resumo.receitasPendentes} kind="income" showSign={false} />
              </p>

              <div className="col-span-4 h-px bg-border" />

              <p className="text-xs text-text-muted">Despesas</p>
              <p className="text-center text-sm font-semibold">
                <Amount value={resumo.despesasPrevistas} kind="expense" showSign={false} />
              </p>
              <p className="text-center text-sm font-semibold">
                <Amount value={resumo.despesasPagas} kind="expense" showSign={false} />
              </p>
              <p className="text-center text-sm font-semibold">
                <Amount value={resumo.despesasPendentes} kind="expense" showSign={false} />
              </p>
            </div>
          </div>

          {/* Indicadores de pendências */}
          {temPendentes && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {resumo.qtdReceitasPendentes > 0 && (
                <div className="rounded-control border border-income/20 bg-income/5 px-2.5 py-2">
                  <p className="text-xs text-text-muted">{resumo.qtdReceitasPendentes}× a receber</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    <Amount value={resumo.receitasPendentes} kind="income" showSign={false} />
                  </p>
                </div>
              )}
              {resumo.qtdDespesasPendentes > 0 && (
                <div className="rounded-control border border-warning/20 bg-warning/5 px-2.5 py-2">
                  <p className="text-xs text-text-muted">{resumo.qtdDespesasPendentes}× a pagar</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    <Amount value={resumo.despesasPendentes} kind="expense" showSign={false} />
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Gráfico de saldo acumulado */}
      {chartData.length > 0 && (
        <div className="-mx-1 mt-4" role="img" aria-label="Saldo acumulado nos últimos meses">
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={{ left: 4, right: 4, top: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="saldoRealizadoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.income} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.income} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="saldoPrevistogradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.income} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={colors.income} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: colors.axis }}
                axisLine={false}
                tickLine={false}
                interval={0}
                padding={{ left: 14, right: 14 }}
              />
              <Tooltip content={<BalanceTooltip />} cursor={{ stroke: colors.grid }} />
              {/* Previsto (tracejado, suave) */}
              <Area
                type="monotone"
                dataKey="saldoAcumuladoPrevisto"
                stroke={colors.income}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                strokeOpacity={0.5}
                fill="url(#saldoPrevistogradient)"
                dot={false}
                isAnimationActive={animate}
              />
              {/* Realizado (sólido, destaque) */}
              <Area
                type="monotone"
                dataKey="saldoAcumuladoRealizado"
                stroke={colors.income}
                strokeWidth={2}
                fill="url(#saldoRealizadoGradient)"
                dot={{ r: 2.5, fill: colors.income, strokeWidth: 0 }}
                isAnimationActive={animate}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  );
}

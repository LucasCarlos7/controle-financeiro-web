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
      <p className="text-base font-semibold text-text">
        <Amount value={point.saldoAcumulado} kind="balance" />
      </p>
    </div>
  );
}

/** Resultado do mês em destaque, receitas e despesas, e a curva do saldo acumulado. */
export function BalanceCard({ ano, mes, resumo, evolucao, isLoading, error, onRetry }: BalanceCardProps) {
  const colors = useChartTheme();
  const animate = !usePrefersReducedMotion();
  const chartData = (evolucao ?? []).map((item) => ({ ...item, label: MESES[item.mes - 1].slice(0, 3) }));

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
          <p className="mt-0.5 text-4xl font-bold tracking-tight text-text">
            <Amount value={resumo.saldo} kind="balance" split />
          </p>
          <div className="mt-3 flex gap-6 text-sm">
            <div>
              <p className="text-text-muted">Receitas</p>
              <p className="text-lg font-semibold">
                <Amount value={resumo.receitas} kind="income" showSign={false} split />
              </p>
            </div>
            <div>
              <p className="text-text-muted">Despesas</p>
              <p className="text-lg font-semibold">
                <Amount value={resumo.despesas} kind="expense" showSign={false} split />
              </p>
            </div>
          </div>
        </>
      )}
      {chartData.length > 0 && (
        <div className="-mx-1 mt-4" role="img" aria-label="Saldo acumulado nos últimos 6 meses">
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={{ left: 4, right: 4, top: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.income} stopOpacity={0.35} />
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
              <Area
                type="monotone"
                dataKey="saldoAcumulado"
                stroke={colors.income}
                strokeWidth={2}
                fill="url(#saldoGradient)"
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

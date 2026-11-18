import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Amount } from '../../../shared/components/ui/Amount';
import { useChartTheme } from '../../../shared/hooks/useChartTheme';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion';
import { formatCurrencyCompact, formatMonthYear } from '../../../shared/utils/format';
import type { EvolucaoMensal } from '../types';

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const SERIES = [
  { key: 'receitas', label: 'Receitas', color: 'income', shape: 'bar' },
  { key: 'despesas', label: 'Despesas', color: 'expense', shape: 'bar' },
  { key: 'saldoAcumulado', label: 'Saldo acumulado', color: 'balance', shape: 'line' },
] as const;

type ChartPoint = EvolucaoMensal & { label: string };

interface TooltipContentProps {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}

function EvolutionTooltip({ active, payload }: TooltipContentProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="min-w-52 rounded-card border border-border bg-surface-raised p-3 shadow-raised">
      <p className="mb-2 text-sm font-semibold text-text">{formatMonthYear(point.ano, point.mes)}</p>
      <dl className="space-y-1.5">
        {SERIES.map((serie) => (
          <div key={serie.key} className="flex items-center justify-between gap-4 text-sm">
            <dt className="flex items-center gap-2 text-text-muted">
              <span
                aria-hidden="true"
                className={serie.shape === 'bar' ? 'h-2.5 w-2.5 rounded-sm' : 'h-0.5 w-3 rounded-full'}
                style={{ backgroundColor: `var(--color-${serie.color})` }}
              />
              {serie.label}
            </dt>
            <dd className="font-medium text-text">
              <Amount value={point[serie.key]} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EvolutionLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {SERIES.map((serie) => (
        <li key={serie.key} className="flex items-center gap-1.5 text-sm text-text-muted">
          <span
            aria-hidden="true"
            className={serie.shape === 'bar' ? 'h-2.5 w-2.5 rounded-sm' : 'h-0.5 w-3 rounded-full'}
            style={{ backgroundColor: `var(--color-${serie.color})` }}
          />
          {serie.label}
        </li>
      ))}
    </ul>
  );
}

export function MonthlyEvolutionChart({ data }: { data: EvolucaoMensal[] }) {
  const colors = useChartTheme();
  const animate = !usePrefersReducedMotion();
  const wide = useMediaQuery('(min-width: 640px)');
  const chartData: ChartPoint[] = data.map((item) => ({
    ...item,
    label: wide ? `${MESES_ABREV[item.mes - 1]}/${String(item.ano).slice(2)}` : MESES_ABREV[item.mes - 1],
  }));
  const tick = { fontSize: 12, fill: colors.axis };

  return (
    <div
      role="img"
      aria-label={`Receitas, despesas e saldo acumulado de ${chartData[0]?.label} a ${chartData.at(-1)?.label}`}
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke={colors.grid} vertical={false} />
          <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} interval={0} dy={6} />
          <YAxis
            yAxisId="valores"
            tickFormatter={(value: number) => formatCurrencyCompact(value)}
            tick={tick}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <YAxis
            yAxisId="saldo"
            orientation="right"
            hide={!wide}
            tickFormatter={(value: number) => formatCurrencyCompact(value)}
            tick={tick}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip content={<EvolutionTooltip />} cursor={{ fill: colors.cursor }} />
          <Bar
            yAxisId="valores"
            dataKey="receitas"
            name="Receitas"
            fill={colors.income}
            radius={[3, 3, 0, 0]}
            maxBarSize={22}
            isAnimationActive={animate}
          />
          <Bar
            yAxisId="valores"
            dataKey="despesas"
            name="Despesas"
            fill={colors.expense}
            radius={[3, 3, 0, 0]}
            maxBarSize={22}
            isAnimationActive={animate}
          />
          <Line
            yAxisId="saldo"
            type="monotone"
            dataKey="saldoAcumulado"
            name="Saldo acumulado"
            stroke={colors.balance}
            strokeWidth={2.25}
            dot={{ r: 3, fill: colors.surface, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
            isAnimationActive={animate}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

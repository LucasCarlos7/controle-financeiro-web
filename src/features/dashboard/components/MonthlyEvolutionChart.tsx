import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../../shared/utils/format';
import { useTheme } from '../../../shared/hooks/useTheme';
import type { EvolucaoMensal } from '../types';

const RECEITAS_COLOR = '#10b981';
const DESPESAS_COLOR = '#f43f5e';
const SALDO_COLOR = '#4f46e5';

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function MonthlyEvolutionChart({ data }: { data: EvolucaoMensal[] }) {
  const chartData = data.map((item) => ({
    ...item,
    label: `${MESES_ABREV[item.mes - 1]}/${String(item.ano).slice(2)}`,
  }));
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const axisLineColor = theme === 'dark' ? '#334155' : '#cbd5e1';
  const tickColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const cursorFill = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const legendColor = theme === 'dark' ? '#cbd5e1' : undefined;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Evolução mensal</p>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={chartData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: tickColor }}
            axisLine={{ stroke: axisLineColor }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => formatCurrency(value)}
            tick={{ fontSize: 11, fill: tickColor }}
            axisLine={{ stroke: axisLineColor }}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            cursor={{ fill: cursorFill }}
            contentStyle={{
              borderRadius: 8,
              borderColor: axisLineColor,
              fontSize: 13,
              backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
              color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: legendColor }} />
          <Bar dataKey="receitas" name="Receitas" fill={RECEITAS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="despesas" name="Despesas" fill={DESPESAS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Line
            type="monotone"
            dataKey="saldoAcumulado"
            name="Saldo acumulado"
            stroke={SALDO_COLOR}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

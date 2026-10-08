import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../../shared/utils/format';
import { useTheme } from '../../../shared/hooks/useTheme';
import type { GastoPorCategoria } from '../types';

const BAR_COLOR = '#4f46e5';

export function CategoryBreakdownChart({ data }: { data: GastoPorCategoria[] }) {
  const sorted = [...data].sort((a, b) => b.valor - a.valor);
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const axisLineColor = theme === 'dark' ? '#334155' : '#cbd5e1';
  const tickColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const yTickColor = theme === 'dark' ? '#94a3b8' : '#475569';
  const cursorFill = theme === 'dark' ? '#1e293b' : '#f1f5f9';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Gastos por categoria</p>
      <ResponsiveContainer width="100%" height={Math.max(sorted.length * 40, 120)}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(value: number) => formatCurrency(value)}
            tick={{ fontSize: 11, fill: tickColor }}
            axisLine={{ stroke: axisLineColor }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="categoriaNome"
            width={110}
            tick={{ fontSize: 12, fill: yTickColor }}
            axisLine={{ stroke: axisLineColor }}
            tickLine={false}
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
          <Bar dataKey="valor" fill={BAR_COLOR} radius={[0, 4, 4, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

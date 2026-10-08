import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { Amount } from '../../../shared/components/ui/Amount';
import { useChartTheme } from '../../../shared/hooks/useChartTheme';
import { usePrefersReducedMotion } from '../../../shared/hooks/usePrefersReducedMotion';
import { formatPercent } from '../../../shared/utils/format';
import type { GastoPorCategoria } from '../types';

/** Rosca com o total no centro e a lista de categorias com valor e participação. */
export function CategoryBreakdownChart({ data }: { data: GastoPorCategoria[] }) {
  const { data: categories } = useCategoriesQuery();
  const colors = useChartTheme();
  const animate = !usePrefersReducedMotion();
  const sorted = [...data].sort((a, b) => b.valor - a.valor);
  const total = sorted.reduce((sum, item) => sum + item.valor, 0);

  function corDa(categoriaId?: string | null) {
    return categories?.find((categoria) => categoria.id === categoriaId)?.cor ?? colors.axis;
  }

  return (
    <div>
      <div className="relative mx-auto h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sorted.map((item) => ({ ...item, fill: corDa(item.categoriaId) }))}
              dataKey="valor"
              nameKey="categoriaNome"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={sorted.length > 1 ? 2 : 0}
              stroke="none"
              isAnimationActive={animate}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-text-muted">Total</span>
          <span className="text-lg font-semibold text-text">
            <Amount value={total} split />
          </span>
        </div>
      </div>

      <ol className="mt-4 space-y-2.5">
        {sorted.map((item) => (
          <li key={item.categoriaId ?? item.categoriaNome} className="flex items-center gap-2.5 text-base">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: corDa(item.categoriaId) }}
            />
            <span className="min-w-0 flex-1 truncate text-text">{item.categoriaNome}</span>
            <span className="w-10 text-right text-sm tabular-nums text-text-muted">
              {formatPercent(total ? (item.valor / total) * 100 : 0)}
            </span>
            <Amount value={item.valor} className="w-28 text-right font-medium text-text" />
          </li>
        ))}
      </ol>
    </div>
  );
}

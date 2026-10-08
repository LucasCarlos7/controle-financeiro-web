import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { Amount } from '../../../shared/components/ui/Amount';
import { formatPercent } from '../../../shared/utils/format';
import type { GastoPorCategoria } from '../types';

/**
 * Ranking de gastos por categoria: nome, valor, participação e barra proporcional ao maior gasto.
 * A barra usa a cor que o usuário escolheu para a categoria.
 */
export function CategoryBreakdownChart({ data }: { data: GastoPorCategoria[] }) {
  const { data: categories } = useCategoriesQuery();
  const sorted = [...data].sort((a, b) => b.valor - a.valor);
  const total = sorted.reduce((sum, item) => sum + item.valor, 0);
  const maior = sorted[0]?.valor || 1;

  function corDa(categoriaId?: string | null) {
    return categories?.find((categoria) => categoria.id === categoriaId)?.cor ?? 'var(--color-text-subtle)';
  }

  return (
    <ol className="space-y-4">
      {sorted.map((item) => (
        <li key={item.categoriaId ?? item.categoriaNome}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: corDa(item.categoriaId) }}
              />
              <span className="truncate text-base font-medium text-text">{item.categoriaNome}</span>
            </span>
            <span className="shrink-0 text-base font-medium text-text">
              <Amount value={item.valor} />
              <span className="ml-2 inline-block w-10 text-right text-sm font-normal tabular-nums text-text-muted">
                {formatPercent(total ? (item.valor / total) * 100 : 0)}
              </span>
            </span>
          </div>
          <div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.valor / maior) * 100}%`, backgroundColor: corDa(item.categoriaId) }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

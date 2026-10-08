import { useState } from 'react';
import { useBudgetsQuery } from './hooks/useBudgetsQuery';
import { useDeleteBudgetMutation } from './hooks/useBudgetMutations';
import { BudgetFormModal } from './components/BudgetFormModal';
import { MonthYearPicker } from '../../shared/components/MonthYearPicker';
import { Spinner } from '../../shared/components/Spinner';
import { ErrorState } from '../../shared/components/ErrorState';
import { EmptyState } from '../../shared/components/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Button } from '../../shared/components/ui/Button';
import { Icon } from '../../shared/components/icons';
import { formatCurrency } from '../../shared/utils/format';
import { useCategoriesQuery } from '../categories/hooks/useCategoriesQuery';
import type { Orcamento } from './types';

export function BudgetsPage() {
  const now = new Date();
  const [periodo, setPeriodo] = useState({ ano: now.getFullYear(), mes: now.getMonth() + 1 });
  const { data, isLoading, isError, error, refetch } = useBudgetsQuery(periodo.ano, periodo.mes);
  const { data: categories } = useCategoriesQuery();
  const deleteMutation = useDeleteBudgetMutation();
  const [modalState, setModalState] = useState<{ open: boolean; budget?: Orcamento }>({ open: false });

  function categoriaNome(categoriaId: string): string {
    return categories?.find((categoria) => categoria.id === categoriaId)?.nome ?? 'Categoria';
  }

  return (
    <div>
      <PageHeader
        title="Orçamentos"
        action={
          <Button type="button" onClick={() => setModalState({ open: true })}>
            <Icon name="plus" className="h-4 w-4" />
            Novo orçamento
          </Button>
        }
      />

      <MonthYearPicker ano={periodo.ano} mes={periodo.mes} onChange={(ano, mes) => setPeriodo({ ano, mes })} />

      {isLoading && <Spinner label="Carregando orçamentos..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="pie"
          title="Nenhum orçamento neste mês"
          description="Defina limites de gasto por categoria para acompanhar seu orçamento."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-2.5">
          {data.map((orcamento) => (
            <li
              key={orcamento.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="flex items-start justify-between">
                <p className="font-medium text-slate-900 dark:text-slate-100">{categoriaNome(orcamento.categoriaId)}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalState({ open: true, budget: orcamento })}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    aria-label="Editar orçamento"
                  >
                    <Icon name="pencil" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Excluir este orçamento?')) deleteMutation.mutate(orcamento.id);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    aria-label="Excluir orçamento"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${orcamento.estourado ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(orcamento.percentualConsumido, 100)}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>
                  {formatCurrency(orcamento.valorConsumido)} de {formatCurrency(orcamento.limiteValor)}
                </span>
                <span className={orcamento.estourado ? 'font-semibold text-red-600 dark:text-red-400' : 'font-medium'}>
                  {orcamento.percentualConsumido.toFixed(0)}%
                </span>
              </div>
              {orcamento.valorPendente > 0 && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Inclui {formatCurrency(orcamento.valorPendente)} pendente, que ainda não aparece no painel.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <BudgetFormModal
        open={modalState.open}
        onClose={() => setModalState({ open: false })}
        ano={periodo.ano}
        mes={periodo.mes}
        budget={modalState.budget}
      />
    </div>
  );
}

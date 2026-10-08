import { useState } from 'react';
import { useGoalsQuery } from './hooks/useGoalsQuery';
import { useDeleteContributionMutation, useDeleteGoalMutation } from './hooks/useGoalMutations';
import { GoalFormModal } from './components/GoalFormModal';
import { ContributionModal } from './components/ContributionModal';
import { Spinner } from '../../shared/components/ui/Spinner';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Button } from '../../shared/components/ui/Button';
import { Icon } from '../../shared/components/icons';
import { formatCurrency, formatDate } from '../../shared/utils/format';
import type { Objetivo } from './types';

export function GoalsPage() {
  const { data, isLoading, isError, error, refetch } = useGoalsQuery();
  const deleteGoalMutation = useDeleteGoalMutation();
  const deleteContributionMutation = useDeleteContributionMutation();
  const [goalModal, setGoalModal] = useState<{ open: boolean; goal?: Objetivo }>({ open: false });
  const [contributionTarget, setContributionTarget] = useState<{ id: string; nome: string } | null>(null);

  return (
    <div>
      <PageHeader
        title="Objetivos"
        action={
          <Button type="button" onClick={() => setGoalModal({ open: true })}>
            <Icon name="plus" className="h-4 w-4" />
            Novo objetivo
          </Button>
        }
      />

      {isLoading && <Spinner label="Carregando objetivos..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="target"
          title="Nenhum objetivo cadastrado"
          description="Crie metas para acompanhar sua evolução financeira."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-2.5">
          {data.map((objetivo) => (
            <li
              key={objetivo.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <Icon name="target" className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{objetivo.nome}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Meta para {formatDate(objetivo.dataAlvo)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGoalModal({ open: true, goal: objetivo })}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    aria-label="Editar objetivo"
                  >
                    <Icon name="pencil" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Excluir o objetivo "${objetivo.nome}"?`)) {
                        deleteGoalMutation.mutate(objetivo.id);
                      }
                    }}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    aria-label="Excluir objetivo"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${Math.min(objetivo.percentualConcluido, 100)}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>
                  {formatCurrency(objetivo.valorAtual)} de {formatCurrency(objetivo.valorAlvo)}
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {objetivo.percentualConcluido.toFixed(0)}%
                </span>
              </div>

              {(objetivo.aportes ?? []).length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 dark:border-slate-800">
                  {(objetivo.aportes ?? []).map((aporte) => (
                    <li
                      key={aporte.id}
                      className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400"
                    >
                      <span>
                        {formatDate(aporte.data)} · {formatCurrency(aporte.valor)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Remover o aporte de ${formatCurrency(aporte.valor)}?`)) {
                            deleteContributionMutation.mutate({ goalId: objetivo.id, aporteId: aporte.id });
                          }
                        }}
                        className="text-xs text-slate-400 transition-colors hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContributionTarget({ id: objetivo.id, nome: objetivo.nome })}
                className="mt-3"
              >
                <Icon name="plus" className="h-3.5 w-3.5" />
                Registrar aporte
              </Button>
            </li>
          ))}
        </ul>
      )}

      <GoalFormModal open={goalModal.open} goal={goalModal.goal} onClose={() => setGoalModal({ open: false })} />
      {contributionTarget && (
        <ContributionModal
          open={Boolean(contributionTarget)}
          onClose={() => setContributionTarget(null)}
          goalId={contributionTarget.id}
          goalName={contributionTarget.nome}
        />
      )}
    </div>
  );
}

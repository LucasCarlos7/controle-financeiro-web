import { useState } from 'react';
import { useBudgetsQuery } from './hooks/useBudgetsQuery';
import { useDeleteBudgetMutation } from './hooks/useBudgetMutations';
import { BudgetFormModal } from './components/BudgetFormModal';
import { useCategoriesQuery } from '../categories/hooks/useCategoriesQuery';
import { ApiError } from '../../shared/types/api';
import { useConfirm, useToast } from '../../shared/hooks/useFeedback';
import { ActionMenu } from '../../shared/components/ui/ActionMenu';
import { Amount } from '../../shared/components/ui/Amount';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { MonthYearPicker } from '../../shared/components/ui/MonthYearPicker';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { ProgressBar } from '../../shared/components/ui/ProgressBar';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { Icon } from '../../shared/components/icons';
import { formatPercent } from '../../shared/utils/format';
import { cn } from '../../shared/utils/cn';
import type { Orcamento } from './types';

/** Abaixo de 80% está tranquilo; de 80% ao limite, atenção; acima do limite (estourado), alerta. */
function toneOf(orcamento: Pick<Orcamento, 'estourado' | 'percentualConsumido'>) {
  if (orcamento.estourado) return 'danger' as const;
  if (orcamento.percentualConsumido >= 80) return 'warning' as const;
  return 'success' as const;
}

function Remaining({ limite, consumido }: { limite: number; consumido: number }) {
  const restante = limite - consumido;
  return restante >= 0 ? (
    <span>
      Restam <Amount value={restante} className="font-medium text-text" />
    </span>
  ) : (
    <span className="font-medium text-danger">
      Excedeu <Amount value={-restante} />
    </span>
  );
}

function BudgetsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1, 2, 3].map((key) => (
        <Card key={key}>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-6 w-40" />
          <Skeleton className="mt-3 h-2" />
          <Skeleton className="mt-3 h-3.5 w-24" />
        </Card>
      ))}
    </div>
  );
}

export function BudgetsPage() {
  const now = new Date();
  const [periodo, setPeriodo] = useState({ ano: now.getFullYear(), mes: now.getMonth() + 1 });
  const { data, isLoading, isError, error, refetch } = useBudgetsQuery(periodo.ano, periodo.mes);
  const { data: categories } = useCategoriesQuery();
  const deleteMutation = useDeleteBudgetMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const [modalState, setModalState] = useState<{ open: boolean; budget?: Orcamento }>({ open: false });
  const openNew = () => setModalState({ open: true });

  function categoriaDe(categoriaId: string) {
    return categories?.find((categoria) => categoria.id === categoriaId);
  }

  async function handleDelete(orcamento: Orcamento) {
    const nome = categoriaDe(orcamento.categoriaId)?.nome ?? 'esta categoria';
    const ok = await confirm({
      title: 'Excluir orçamento?',
      description: `O limite de ${nome} neste mês será removido. Os lançamentos não são afetados.`,
      confirmLabel: 'Excluir',
      destructive: true,
    });
    if (!ok) return;
    deleteMutation.mutate(orcamento.id, {
      onSuccess: () => toast('Orçamento excluído'),
      onError: (err) =>
        toast({ tone: 'danger', message: err instanceof ApiError ? err.message : 'Não foi possível excluir.' }),
    });
  }

  const totalLimite = (data ?? []).reduce((sum, item) => sum + item.limiteValor, 0);
  const totalConsumido = (data ?? []).reduce((sum, item) => sum + item.valorConsumido, 0);
  const totalPercentual = totalLimite > 0 ? (totalConsumido / totalLimite) * 100 : 0;

  return (
    <div>
      <PageHeader
        title="Orçamentos"
        description="Limites de gasto por categoria no mês"
        action={
          <>
            <MonthYearPicker ano={periodo.ano} mes={periodo.mes} onChange={(ano, mes) => setPeriodo({ ano, mes })} />
            <Button type="button" onClick={openNew}>
              <Icon name="plus" className="h-4 w-4" />
              Novo orçamento
            </Button>
          </>
        }
      />

      {isLoading && <BudgetsSkeleton />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="pie"
          title="Nenhum orçamento neste mês"
          description="Defina limites de gasto por categoria para acompanhar seu orçamento."
          action={
            <Button type="button" onClick={openNew}>
              <Icon name="plus" className="h-4 w-4" />
              Novo orçamento
            </Button>
          }
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <>
          <Card className="mb-4">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <p className="text-base font-medium text-text-muted">Total do mês</p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                  <Amount value={totalConsumido} split />
                  <span className="text-lg font-medium text-text-muted">
                    {' '}
                    de <Amount value={totalLimite} />
                  </span>
                </p>
              </div>
              <p className="text-sm text-text-muted">
                <Remaining limite={totalLimite} consumido={totalConsumido} />
              </p>
            </div>
            <ProgressBar
              value={totalPercentual}
              label="Total consumido no mês"
              tone={toneOf({ estourado: totalConsumido > totalLimite, percentualConsumido: totalPercentual })}
              className="mt-4"
            />
          </Card>

          <ul className="grid gap-4 md:grid-cols-2">
            {data.map((orcamento) => {
              const categoria = categoriaDe(orcamento.categoriaId);
              const tone = toneOf(orcamento);
              return (
                <Card as="li" key={orcamento.id} className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="flex min-w-0 items-center gap-2 text-base font-semibold text-text">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: categoria?.cor ?? 'var(--color-text-subtle)' }}
                      />
                      <span className="truncate">{categoria?.nome ?? 'Categoria'}</span>
                    </h2>
                    <ActionMenu
                      label={`Ações do orçamento de ${categoria?.nome ?? 'categoria'}`}
                      className="-my-2 -mr-2"
                      items={[
                        { label: 'Editar limite', icon: 'pencil', onSelect: () => setModalState({ open: true, budget: orcamento }) },
                        { label: 'Excluir', icon: 'trash', tone: 'danger', onSelect: () => handleDelete(orcamento) },
                      ]}
                    />
                  </div>

                  <p className="mt-3 text-xl font-semibold tracking-tight text-text">
                    <Amount value={orcamento.valorConsumido} split />
                    <span className="text-base font-medium text-text-muted">
                      {' '}
                      de <Amount value={orcamento.limiteValor} />
                    </span>
                  </p>

                  <ProgressBar
                    value={orcamento.percentualConsumido}
                    tone={tone}
                    label={`Consumo do orçamento de ${categoria?.nome ?? 'categoria'}`}
                    className="mt-3"
                  />

                  <div className="mt-2 flex items-center justify-between text-sm text-text-muted">
                    <Remaining limite={orcamento.limiteValor} consumido={orcamento.valorConsumido} />
                    <span className={cn('font-medium tabular-nums', tone === 'danger' ? 'text-danger' : 'text-text')}>
                      {formatPercent(orcamento.percentualConsumido)}
                    </span>
                  </div>

                  {orcamento.valorPendente > 0 && (
                    <p className="mt-3 flex items-start gap-1.5 border-t border-border pt-3 text-sm text-text-muted">
                      <Icon name="clock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        Inclui <Amount value={orcamento.valorPendente} className="font-medium text-text" /> pendente, que
                        ainda não aparece no painel.
                      </span>
                    </p>
                  )}
                </Card>
              );
            })}
          </ul>
        </>
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

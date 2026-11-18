import { useState } from 'react';
import { useGoalsQuery } from './hooks/useGoalsQuery';
import { useDeleteContributionMutation, useDeleteGoalMutation } from './hooks/useGoalMutations';
import { GoalFormModal } from './components/GoalFormModal';
import { ContributionModal } from './components/ContributionModal';
import { ApiError } from '../../shared/types/api';
import { useConfirm, useToast } from '../../shared/hooks/useFeedback';
import { ActionMenu } from '../../shared/components/ui/ActionMenu';
import { Amount } from '../../shared/components/ui/Amount';
import { Badge } from '../../shared/components/ui/Badge';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { IconButton } from '../../shared/components/ui/IconButton';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { ProgressBar } from '../../shared/components/ui/ProgressBar';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { Icon } from '../../shared/components/icons';
import { formatCurrency, formatDate, formatPercent } from '../../shared/utils/format';
import type { Objetivo } from './types';

const APORTES_VISIVEIS = 3;

function GoalsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1].map((key) => (
        <Card key={key}>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="mt-5 h-6 w-48" />
          <Skeleton className="mt-3 h-2" />
        </Card>
      ))}
    </div>
  );
}

function GoalCard({
  objetivo,
  onEdit,
  onDelete,
  onContribute,
}: {
  objetivo: Objetivo;
  onEdit: () => void;
  onDelete: () => void;
  onContribute: () => void;
}) {
  const deleteContributionMutation = useDeleteContributionMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const [showAll, setShowAll] = useState(false);

  const concluido = objetivo.percentualConcluido >= 100;
  const faltam = Math.max(objetivo.valorAlvo - objetivo.valorAtual, 0);
  const aportes = [...(objetivo.aportes ?? [])].sort((a, b) => b.data.localeCompare(a.data));
  const visiveis = showAll ? aportes : aportes.slice(0, APORTES_VISIVEIS);

  async function removeAporte(aporteId: string, valor: number) {
    const ok = await confirm({
      title: 'Remover aporte?',
      description: `O aporte de ${formatCurrency(valor)} sai do total de "${objetivo.nome}".`,
      confirmLabel: 'Remover',
      destructive: true,
    });
    if (!ok) return;
    deleteContributionMutation.mutate(
      { goalId: objetivo.id, aporteId },
      {
        onSuccess: () => toast('Aporte removido'),
        onError: (err) =>
          toast({ tone: 'danger', message: err instanceof ApiError ? err.message : 'Não foi possível remover.' }),
      },
    );
  }

  return (
    <Card as="li" className="flex min-w-0 flex-col">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={
            concluido
              ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-soft text-success'
              : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-text'
          }
        >
          <Icon name={concluido ? 'check' : 'target'} className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 text-base font-semibold text-text">
            <span className="truncate">{objetivo.nome}</span>
            {concluido && <Badge tone="success">Concluído</Badge>}
          </h2>
          <p className="text-sm text-text-muted">Meta para {formatDate(objetivo.dataAlvo)}</p>
        </div>
        <ActionMenu
          label={`Ações de ${objetivo.nome}`}
          className="-my-1.5 -mr-2"
          items={[
            { label: 'Editar', icon: 'pencil', onSelect: onEdit },
            { label: 'Excluir', icon: 'trash', tone: 'danger', onSelect: onDelete },
          ]}
        />
      </div>

      <p className="mt-4 text-xl font-semibold tracking-tight text-text">
        <Amount value={objetivo.valorAtual} split />
        <span className="text-base font-medium text-text-muted">
          {' '}
          de <Amount value={objetivo.valorAlvo} />
        </span>
      </p>
      <ProgressBar
        value={objetivo.percentualConcluido}
        tone={concluido ? 'success' : 'primary'}
        label={`Progresso de ${objetivo.nome}`}
        className="mt-3"
      />
      <div className="mt-2 flex justify-between text-sm text-text-muted">
        <span>
          {concluido ? (
            'Meta atingida'
          ) : (
            <>
              Faltam <Amount value={faltam} className="font-medium text-text" />
            </>
          )}
        </span>
        <span className="font-medium tabular-nums text-text">{formatPercent(objetivo.percentualConcluido)}</span>
      </div>

      {aportes.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <h3 className="mb-1 text-sm font-medium text-text-muted">Aportes</h3>
          <ul>
            {visiveis.map((aporte) => (
              <li key={aporte.id} className="flex items-center justify-between gap-3 py-1 text-base">
                <span className="text-text-muted tabular-nums">{formatDate(aporte.data)}</span>
                <span className="flex items-center gap-1">
                  <Amount value={aporte.valor} kind="income" className="font-medium" />
                  <IconButton
                    icon="x"
                    size="sm"
                    variant="danger"
                    label={`Remover aporte de ${formatCurrency(aporte.valor)} em ${formatDate(aporte.data)}`}
                    onClick={() => removeAporte(aporte.id, aporte.valor)}
                  />
                </span>
              </li>
            ))}
          </ul>
          {aportes.length > APORTES_VISIVEIS && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="hit-area mt-1 text-sm font-medium text-primary-text hover:underline"
            >
              {showAll ? 'Mostrar menos' : `Ver todos os ${aportes.length} aportes`}
            </button>
          )}
        </div>
      )}

      <div className="mt-auto pt-4">
        <Button type="button" variant="outline" onClick={onContribute} className="w-full">
          <Icon name="plus" className="h-4 w-4" />
          Registrar aporte
        </Button>
      </div>
    </Card>
  );
}

export function GoalsPage() {
  const { data, isLoading, isError, error, refetch } = useGoalsQuery();
  const deleteGoalMutation = useDeleteGoalMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const [goalModal, setGoalModal] = useState<{ open: boolean; goal?: Objetivo }>({ open: false });
  const [contributionTarget, setContributionTarget] = useState<{ id: string; nome: string } | null>(null);
  const openNew = () => setGoalModal({ open: true });

  async function handleDelete(objetivo: Objetivo) {
    const ok = await confirm({
      title: 'Excluir objetivo?',
      description: `"${objetivo.nome}" e todos os aportes registrados serão removidos.`,
      confirmLabel: 'Excluir',
      destructive: true,
    });
    if (!ok) return;
    deleteGoalMutation.mutate(objetivo.id, {
      onSuccess: () => toast('Objetivo excluído'),
      onError: (err) =>
        toast({ tone: 'danger', message: err instanceof ApiError ? err.message : 'Não foi possível excluir.' }),
    });
  }

  return (
    <div>
      <PageHeader
        title="Objetivos"
        description="Metas de economia e seus aportes"
        action={
          <Button type="button" onClick={openNew}>
            <Icon name="plus" className="h-4 w-4" />
            Novo objetivo
          </Button>
        }
      />

      {isLoading && <GoalsSkeleton />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="target"
          title="Nenhum objetivo cadastrado"
          description="Crie metas para acompanhar sua evolução financeira."
          action={
            <Button type="button" onClick={openNew}>
              <Icon name="plus" className="h-4 w-4" />
              Novo objetivo
            </Button>
          }
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2">
          {data.map((objetivo) => (
            <GoalCard
              key={objetivo.id}
              objetivo={objetivo}
              onEdit={() => setGoalModal({ open: true, goal: objetivo })}
              onDelete={() => handleDelete(objetivo)}
              onContribute={() => setContributionTarget({ id: objetivo.id, nome: objetivo.nome })}
            />
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

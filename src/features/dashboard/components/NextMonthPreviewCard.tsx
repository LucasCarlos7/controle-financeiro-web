import { Amount } from '../../../shared/components/ui/Amount';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ErrorState } from '../../../shared/components/ui/ErrorState';
import { TextLink } from '../../../shared/components/ui/TextLink';
import { formatMonthYear } from '../../../shared/utils/format';
import { useMonthlySummaryQuery } from '../hooks/useDashboardQueries';
import { DashboardCard } from './DashboardCard';

interface NextMonthPreviewCardProps {
  anoAtual: number;
  mesAtual: number;
}

function getNextMonth(ano: number, mes: number): { ano: number; mes: number } {
  if (mes === 12) return { ano: ano + 1, mes: 1 };
  return { ano, mes: mes + 1 };
}

export function NextMonthPreviewCard({ anoAtual, mesAtual }: NextMonthPreviewCardProps) {
  const { ano, mes } = getNextMonth(anoAtual, mesAtual);
  const query = useMonthlySummaryQuery(ano, mes);

  const temDados =
    query.data &&
    (query.data.receitasPrevistas > 0 || query.data.despesasPrevistas > 0);

  return (
    <DashboardCard
      title={`Prévia de ${formatMonthYear(ano, mes)}`}
      action={<TextLink to="/extrato">Ver lançamentos</TextLink>}
    >
      {query.isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-52" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Skeleton className="h-14 rounded-control" />
            <Skeleton className="h-14 rounded-control" />
          </div>
        </div>
      )}

      {query.isError && (
        <ErrorState variant="compact" error={query.error} onRetry={() => query.refetch()} />
      )}

      {query.data && !temDados && (
        <div className="py-6 text-center">
          <p className="text-sm text-text-muted">
            Nenhum lançamento previsto para{' '}
            <span className="font-medium">{formatMonthYear(ano, mes).toLowerCase()}</span>.
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Lançamentos recorrentes aparecerão aqui automaticamente.
          </p>
        </div>
      )}

      {query.data && temDados && (
        <>
          <p className="text-sm text-text-muted">
            Saldo previsto para {formatMonthYear(ano, mes).toLowerCase()}
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-text">
            <Amount value={query.data.saldoPrevisto} kind="balance" split />
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-control border border-income/20 bg-income/5 px-3 py-2.5">
              <p className="text-xs text-text-muted">Receitas previstas</p>
              <p className="mt-0.5 text-sm font-semibold">
                <Amount value={query.data.receitasPrevistas} kind="income" showSign={false} />
              </p>
              {query.data.qtdReceitasPendentes > 0 && (
                <p className="mt-0.5 text-xs text-text-muted">
                  {query.data.qtdReceitasPendentes} lançamento{query.data.qtdReceitasPendentes !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="rounded-control border border-expense/20 bg-expense/5 px-3 py-2.5">
              <p className="text-xs text-text-muted">Despesas previstas</p>
              <p className="mt-0.5 text-sm font-semibold">
                <Amount value={query.data.despesasPrevistas} kind="expense" showSign={false} />
              </p>
              {query.data.qtdDespesasPendentes > 0 && (
                <p className="mt-0.5 text-xs text-text-muted">
                  {query.data.qtdDespesasPendentes} lançamento{query.data.qtdDespesasPendentes !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardCard>
  );
}

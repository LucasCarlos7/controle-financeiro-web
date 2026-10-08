import { useAccountsQuery } from '../../accounts/hooks/useAccountsQuery';
import { useCardsQuery } from '../../accounts/hooks/useCardsQuery';
import { useBudgetsQuery } from '../../budgets/hooks/useBudgetsQuery';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useGoalsQuery } from '../../goals/hooks/useGoalsQuery';
import { useTransactionsQuery } from '../../transactions/hooks/useTransactionsQuery';
import { TransactionIcon } from '../../transactions/components/TransactionIcon';
import { useTransactionLookups } from '../../transactions/hooks/useTransactionLookups';
import { Amount } from '../../../shared/components/ui/Amount';
import { ProgressBar } from '../../../shared/components/ui/ProgressBar';
import { TextLink } from '../../../shared/components/ui/TextLink';
import { Icon } from '../../../shared/components/icons';
import { formatDate, formatPercent } from '../../../shared/utils/format';
import { CardEmpty, CardStatus, DashboardCard } from './DashboardCard';

const TIPO_CONTA: Record<string, string> = { Corrente: 'Conta corrente', Poupanca: 'Poupança', Carteira: 'Carteira' };

export function AccountsCard() {
  const { data, isLoading, error, refetch } = useAccountsQuery(true);
  const total = (data ?? []).reduce((sum, conta) => sum + conta.saldoAtual, 0);

  return (
    <DashboardCard title="Contas" action={<TextLink to="/contas" icon="plus">Adicionar</TextLink>}>
      <CardStatus isLoading={isLoading} error={error} onRetry={() => refetch()} />
      {data && data.length === 0 && <CardEmpty>Nenhuma conta ativa.</CardEmpty>}
      {data && data.length > 0 && (
        <>
          <ul className="-mx-1 divide-y divide-border">
            {data.map((conta) => (
              <li key={conta.id} className="flex items-center gap-3 px-1 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-text">
                  <Icon name="bank" className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-text">{conta.nome}</p>
                  <p className="text-sm text-text-muted">{TIPO_CONTA[conta.tipo]}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted">Saldo atual</p>
                  <p className="text-base font-semibold text-text">
                    <Amount value={conta.saldoAtual} kind="balance" split />
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm text-text-muted">Total</span>
            <span className="text-lg font-semibold text-text">
              <Amount value={total} kind="balance" split />
            </span>
          </div>
        </>
      )}
    </DashboardCard>
  );
}

export function CreditCardsCard() {
  const { data, isLoading, error, refetch } = useCardsQuery(true);

  return (
    <DashboardCard title="Cartões de crédito" action={<TextLink to="/contas">Ver cartões</TextLink>}>
      <CardStatus isLoading={isLoading} error={error} onRetry={() => refetch()} rows={2} />
      {data && data.length === 0 && <CardEmpty>Nenhum cartão ativo.</CardEmpty>}
      {data && data.length > 0 && (
        <ul className="space-y-3">
          {data.map((cartao) => {
            const usado = cartao.limite > 0 ? ((cartao.limite - cartao.limiteDisponivel) / cartao.limite) * 100 : 0;
            return (
              <li key={cartao.id}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-control bg-primary text-primary-fg">
                    <Icon name="card" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-text">{cartao.nome}</p>
                    <p className="text-sm text-text-muted">Vence dia {cartao.diaVencimento}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Disponível</p>
                    <p className="text-base font-semibold text-text">
                      <Amount value={cartao.limiteDisponivel} split />
                    </p>
                  </div>
                </div>
                <ProgressBar
                  value={usado}
                  size="sm"
                  label={`Limite usado de ${cartao.nome}`}
                  tone={usado >= 90 ? 'danger' : usado >= 70 ? 'warning' : 'success'}
                  className="mt-2"
                />
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

export function LatestTransactionsCard() {
  const { data, isLoading, error, refetch } = useTransactionsQuery({});
  const describe = useTransactionLookups();
  const ultimas = (data ?? []).slice(0, 6);

  return (
    <DashboardCard title="Últimas transações" action={<TextLink to="/extrato">Ver extrato</TextLink>}>
      <CardStatus isLoading={isLoading} error={error} onRetry={() => refetch()} rows={4} />
      {data && data.length === 0 && <CardEmpty>Nenhum lançamento ainda.</CardEmpty>}
      {ultimas.length > 0 && (
        <ul className="-mx-1 divide-y divide-border">
          {ultimas.map((transacao) => {
            const display = describe(transacao);
            const kind = transacao.tipo === 'Receita' ? 'income' : transacao.tipo === 'Despesa' ? 'expense' : 'transfer';
            return (
              <li key={transacao.id} className="flex items-center gap-3 px-1 py-2.5">
                <TransactionIcon transacao={transacao} cor={display.categoria?.cor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-text">{transacao.descricao}</p>
                  <p className="truncate text-xs text-text-muted">
                    {formatDate(transacao.data).slice(0, 5)} · {display.categoria?.nome ?? 'Sem categoria'}
                  </p>
                </div>
                <div className="text-right">
                  <Amount value={transacao.valor} kind={kind} className="text-sm font-semibold" />
                  {transacao.status === 'Pendente' && <p className="text-xs text-warning">Pendente</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

export function BudgetsCard({ ano, mes }: { ano: number; mes: number }) {
  const { data, isLoading, error, refetch } = useBudgetsQuery(ano, mes);
  const { data: categories } = useCategoriesQuery();

  return (
    <DashboardCard title="Orçamentos do mês" action={<TextLink to="/orcamentos">Ver orçamentos</TextLink>}>
      <CardStatus isLoading={isLoading} error={error} onRetry={() => refetch()} rows={2} />
      {data && data.length === 0 && <CardEmpty>Nenhum limite definido para este mês.</CardEmpty>}
      {data && data.length > 0 && (
        <ul className="space-y-3.5">
          {data.map((orcamento) => {
            const categoria = categories?.find((item) => item.id === orcamento.categoriaId);
            const tone = orcamento.estourado ? 'danger' : orcamento.percentualConsumido >= 80 ? 'warning' : 'success';
            return (
              <li key={orcamento.id}>
                <div className="flex items-baseline justify-between gap-3 text-base">
                  <span className="flex min-w-0 items-center gap-2 font-medium text-text">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: categoria?.cor ?? 'var(--color-text-subtle)' }}
                    />
                    <span className="truncate">{categoria?.nome ?? 'Categoria'}</span>
                  </span>
                  <span className="shrink-0 text-sm text-text-muted">
                    <Amount value={orcamento.valorConsumido} className="font-medium text-text" /> de{' '}
                    <Amount value={orcamento.limiteValor} />
                  </span>
                </div>
                <ProgressBar
                  value={orcamento.percentualConsumido}
                  size="sm"
                  tone={tone}
                  label={`Consumo de ${categoria?.nome ?? 'categoria'}: ${formatPercent(orcamento.percentualConsumido)}`}
                  className="mt-1.5"
                />
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

export function GoalsCard() {
  const { data, isLoading, error, refetch } = useGoalsQuery();

  return (
    <DashboardCard title="Objetivos" action={<TextLink to="/objetivos" icon="plus">Adicionar</TextLink>}>
      <CardStatus isLoading={isLoading} error={error} onRetry={() => refetch()} rows={2} />
      {data && data.length === 0 && (
        <div className="flex flex-col items-center py-4 text-center">
          <Icon name="target" className="h-6 w-6 text-primary-text" />
          <p className="mt-2 text-base text-text-muted">Crie, gerencie e acompanhe seus objetivos.</p>
        </div>
      )}
      {data && data.length > 0 && (
        <ul className="space-y-3.5">
          {data.map((objetivo) => (
            <li key={objetivo.id}>
              <div className="flex items-baseline justify-between gap-3 text-base">
                <span className="truncate font-medium text-text">{objetivo.nome}</span>
                <span className="shrink-0 text-sm tabular-nums text-text-muted">
                  {formatPercent(objetivo.percentualConcluido)}
                </span>
              </div>
              <ProgressBar
                value={objetivo.percentualConcluido}
                size="sm"
                tone="success"
                label={`Progresso de ${objetivo.nome}`}
                className="mt-1.5"
              />
              <p className="mt-1 text-sm text-text-muted">
                <Amount value={objetivo.valorAtual} className="text-text" /> de <Amount value={objetivo.valorAlvo} />
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

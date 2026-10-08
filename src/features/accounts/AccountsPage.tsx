import { useState } from 'react';
import { useAccountsQuery } from './hooks/useAccountsQuery';
import { useDeactivateAccountMutation, useReactivateAccountMutation } from './hooks/useAccountMutations';
import { useCardsQuery } from './hooks/useCardsQuery';
import { useDeactivateCardMutation, useReactivateCardMutation } from './hooks/useCardMutations';
import { AccountFormModal } from './components/AccountFormModal';
import { CardFormModal } from './components/CardFormModal';
import { Spinner } from '../../shared/components/ui/Spinner';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { Tabs } from '../../shared/components/ui/Tabs';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Button } from '../../shared/components/ui/Button';
import { Icon } from '../../shared/components/icons';
import { formatCurrency } from '../../shared/utils/format';
import type { CartaoCredito, Conta } from './types';

const TIPO_LABELS: Record<Conta['tipo'], string> = {
  Corrente: 'Conta corrente',
  Poupanca: 'Poupança',
  Carteira: 'Carteira',
};

function AccountsTab() {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();
  const deactivateMutation = useDeactivateAccountMutation();
  const reactivateMutation = useReactivateAccountMutation();

  const [modalState, setModalState] = useState<{ open: boolean; account?: Conta }>({ open: false });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button type="button" onClick={() => setModalState({ open: true })}>
          <Icon name="plus" className="h-4 w-4" />
          Nova conta
        </Button>
      </div>

      {isLoading && <Spinner label="Carregando contas..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="wallet"
          title="Nenhuma conta cadastrada"
          description="Cadastre sua primeira conta para começar a lançar transações."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-2.5">
          {data.map((conta) => (
            <li
              key={conta.id}
              className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${!conta.ativo ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <Icon name="wallet" className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{conta.nome}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{TIPO_LABELS[conta.tipo]}</p>
                  </div>
                </div>
                <p className="text-right font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(conta.saldoAtual)}
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalState({ open: true, account: conta })}>
                  <Icon name="pencil" className="h-3.5 w-3.5" />
                  Editar
                </Button>
                {conta.ativo ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => deactivateMutation.mutate(conta.id)}
                    disabled={deactivateMutation.isPending}
                  >
                    Desativar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => reactivateMutation.mutate(conta.id)}
                    disabled={reactivateMutation.isPending}
                  >
                    Reativar
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <AccountFormModal
        open={modalState.open}
        account={modalState.account}
        onClose={() => setModalState({ open: false })}
      />
    </div>
  );
}

function CardsTab() {
  const { data, isLoading, isError, error, refetch } = useCardsQuery();
  const deactivateMutation = useDeactivateCardMutation();
  const reactivateMutation = useReactivateCardMutation();
  const [modalState, setModalState] = useState<{ open: boolean; card?: CartaoCredito }>({ open: false });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button type="button" onClick={() => setModalState({ open: true })}>
          <Icon name="plus" className="h-4 w-4" />
          Novo cartão
        </Button>
      </div>

      {isLoading && <Spinner label="Carregando cartões..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="wallet"
          title="Nenhum cartão cadastrado"
          description="Cadastre seus cartões de crédito para acompanhar o limite."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-2.5">
          {data.map((cartao) => (
            <li
              key={cartao.id}
              className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${!cartao.ativo ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <Icon name="wallet" className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{cartao.nome}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Fecha dia {cartao.diaFechamento} · Vence dia {cartao.diaVencimento}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(cartao.limiteDisponivel)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">de {formatCurrency(cartao.limite)}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalState({ open: true, card: cartao })}>
                  <Icon name="pencil" className="h-3.5 w-3.5" />
                  Editar
                </Button>
                {cartao.ativo ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => deactivateMutation.mutate(cartao.id)}
                    disabled={deactivateMutation.isPending}
                  >
                    Desativar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => reactivateMutation.mutate(cartao.id)}
                    disabled={reactivateMutation.isPending}
                  >
                    Reativar
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <CardFormModal
        open={modalState.open}
        card={modalState.card}
        onClose={() => setModalState({ open: false })}
      />
    </div>
  );
}

export function AccountsPage() {
  const [tab, setTab] = useState<'contas' | 'cartoes'>('contas');

  return (
    <div>
      <PageHeader title="Contas e Cartões" />
      <Tabs
        label="Contas e cartões"
        tabs={[
          { value: 'contas', label: 'Contas' },
          { value: 'cartoes', label: 'Cartões' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'contas' ? <AccountsTab /> : <CardsTab />}
    </div>
  );
}

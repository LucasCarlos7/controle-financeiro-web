import { useState, type ReactNode } from 'react';
import { useAccountsQuery } from './hooks/useAccountsQuery';
import { useDeactivateAccountMutation, useReactivateAccountMutation } from './hooks/useAccountMutations';
import { useCardsQuery } from './hooks/useCardsQuery';
import { useDeactivateCardMutation, useReactivateCardMutation } from './hooks/useCardMutations';
import { AccountFormModal } from './components/AccountFormModal';
import { CardFormModal } from './components/CardFormModal';
import { ApiError } from '../../shared/types/api';
import { useToast } from '../../shared/hooks/useFeedback';
import { ActionMenu } from '../../shared/components/ui/ActionMenu';
import { Amount } from '../../shared/components/ui/Amount';
import { Badge } from '../../shared/components/ui/Badge';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { ListRow } from '../../shared/components/ui/ListRow';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { ProgressBar } from '../../shared/components/ui/ProgressBar';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { Tabs } from '../../shared/components/ui/Tabs';
import { Icon } from '../../shared/components/icons';
import { formatCurrency } from '../../shared/utils/format';
import type { CartaoCredito, Conta } from './types';

const TIPO_LABELS: Record<Conta['tipo'], string> = {
  Corrente: 'Conta corrente',
  Poupanca: 'Poupança',
  Carteira: 'Carteira',
};

type Tab = 'contas' | 'cartoes';

function useStatusToast() {
  const toast = useToast();
  return (message: string) => ({
    onSuccess: () => toast(message),
    onError: (error: Error) =>
      toast({ tone: 'danger', message: error instanceof ApiError ? error.message : 'Não foi possível concluir a ação.' }),
  });
}

function ListSkeleton() {
  return (
    <Card padding="none">
      <ul className="divide-y divide-border">
        {[0, 1, 2].map((key) => (
          <li key={key} className="flex items-center gap-3 px-5 py-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="mt-2 h-3 w-1/5" />
            </div>
            <Skeleton className="h-4 w-24" />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SummaryCard({ label, value, hint }: { label: string; value: ReactNode; hint: string }) {
  return (
    <Card className="mb-4">
      <p className="text-base font-medium text-text-muted">{label}</p>
      <p className="mt-1.5 text-3xl font-semibold tracking-tight text-text">{value}</p>
      <p className="mt-1 text-sm text-text-muted">{hint}</p>
    </Card>
  );
}

function AccountsTab({ onCreate, onEdit }: { onCreate: () => void; onEdit: (conta: Conta) => void }) {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();
  const deactivateMutation = useDeactivateAccountMutation();
  const reactivateMutation = useReactivateAccountMutation();
  const feedback = useStatusToast();

  if (isLoading) return <ListSkeleton />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="wallet"
        title="Nenhuma conta cadastrada"
        description="Cadastre sua primeira conta para começar a lançar transações."
        action={
          <Button type="button" onClick={onCreate}>
            <Icon name="plus" className="h-4 w-4" />
            Nova conta
          </Button>
        }
      />
    );
  }

  const ativas = data.filter((conta) => conta.ativo);
  const saldoTotal = ativas.reduce((sum, conta) => sum + conta.saldoAtual, 0);

  return (
    <>
      <SummaryCard
        label="Saldo total"
        value={<Amount value={saldoTotal} kind="balance" />}
        hint={`${ativas.length} ${ativas.length === 1 ? 'conta ativa' : 'contas ativas'}`}
      />
      <Card padding="none">
        <ul className="divide-y divide-border">
          {data.map((conta) => (
            <ListRow
              key={conta.id}
              icon="wallet"
              iconClassName={conta.ativo ? 'bg-primary-soft text-primary-text' : 'bg-surface-sunken text-text-subtle'}
              title={
                <>
                  <span className="truncate">{conta.nome}</span>
                  {!conta.ativo && <Badge>Inativa</Badge>}
                </>
              }
              onOpen={() => onEdit(conta)}
              openLabel={`Editar ${conta.nome}`}
              meta={TIPO_LABELS[conta.tipo]}
              value={<Amount value={conta.saldoAtual} kind="balance" className="text-base font-semibold" />}
              actions={
                <ActionMenu
                  label={`Ações de ${conta.nome}`}
                  items={[
                    { label: 'Editar', icon: 'pencil', onSelect: () => onEdit(conta) },
                    conta.ativo
                      ? {
                          label: 'Desativar',
                          icon: 'x',
                          disabled: deactivateMutation.isPending,
                          onSelect: () => deactivateMutation.mutate(conta.id, feedback('Conta desativada')),
                        }
                      : {
                          label: 'Reativar',
                          icon: 'check',
                          disabled: reactivateMutation.isPending,
                          onSelect: () => reactivateMutation.mutate(conta.id, feedback('Conta reativada')),
                        },
                  ]}
                />
              }
            />
          ))}
        </ul>
      </Card>
    </>
  );
}

function CardsTab({ onCreate, onEdit }: { onCreate: () => void; onEdit: (cartao: CartaoCredito) => void }) {
  const { data, isLoading, isError, error, refetch } = useCardsQuery();
  const deactivateMutation = useDeactivateCardMutation();
  const reactivateMutation = useReactivateCardMutation();
  const feedback = useStatusToast();

  if (isLoading) return <ListSkeleton />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="card"
        title="Nenhum cartão cadastrado"
        description="Cadastre seus cartões de crédito para acompanhar o limite."
        action={
          <Button type="button" onClick={onCreate}>
            <Icon name="plus" className="h-4 w-4" />
            Novo cartão
          </Button>
        }
      />
    );
  }

  const ativos = data.filter((cartao) => cartao.ativo);
  const disponivel = ativos.reduce((sum, cartao) => sum + cartao.limiteDisponivel, 0);
  const limite = ativos.reduce((sum, cartao) => sum + cartao.limite, 0);

  return (
    <>
      <SummaryCard
        label="Limite disponível"
        value={<Amount value={disponivel} />}
        hint={`de ${formatCurrency(limite)} em ${ativos.length} ${ativos.length === 1 ? 'cartão ativo' : 'cartões ativos'}`}
      />
      <Card padding="none">
        <ul className="divide-y divide-border">
          {data.map((cartao) => {
            const usado = cartao.limite > 0 ? ((cartao.limite - cartao.limiteDisponivel) / cartao.limite) * 100 : 0;
            return (
              <ListRow
                key={cartao.id}
                icon="card"
                iconClassName={cartao.ativo ? 'bg-primary-soft text-primary-text' : 'bg-surface-sunken text-text-subtle'}
                title={
                  <>
                    <span className="truncate">{cartao.nome}</span>
                    {!cartao.ativo && <Badge>Inativo</Badge>}
                  </>
                }
                onOpen={() => onEdit(cartao)}
                openLabel={`Editar ${cartao.nome}`}
                meta={`Fecha dia ${cartao.diaFechamento} · Vence dia ${cartao.diaVencimento}`}
                value={
                  <>
                    <Amount value={cartao.limiteDisponivel} className="block text-base font-semibold" />
                    <span className="text-sm text-text-muted">
                      de <Amount value={cartao.limite} />
                    </span>
                  </>
                }
                actions={
                  <ActionMenu
                    label={`Ações de ${cartao.nome}`}
                    items={[
                      { label: 'Editar', icon: 'pencil', onSelect: () => onEdit(cartao) },
                      cartao.ativo
                        ? {
                            label: 'Desativar',
                            icon: 'x',
                            disabled: deactivateMutation.isPending,
                            onSelect: () => deactivateMutation.mutate(cartao.id, feedback('Cartão desativado')),
                          }
                        : {
                            label: 'Reativar',
                            icon: 'check',
                            disabled: reactivateMutation.isPending,
                            onSelect: () => reactivateMutation.mutate(cartao.id, feedback('Cartão reativado')),
                          },
                    ]}
                  />
                }
              >
                <ProgressBar
                  value={usado}
                  size="sm"
                  label={`Limite usado de ${cartao.nome}`}
                  tone={usado >= 90 ? 'danger' : usado >= 70 ? 'warning' : 'primary'}
                  className="mt-2.5"
                />
              </ListRow>
            );
          })}
        </ul>
      </Card>
    </>
  );
}

export function AccountsPage() {
  const [tab, setTab] = useState<Tab>('contas');
  const [accountModal, setAccountModal] = useState<{ open: boolean; account?: Conta }>({ open: false });
  const [cardModal, setCardModal] = useState<{ open: boolean; card?: CartaoCredito }>({ open: false });

  const createAccount = () => setAccountModal({ open: true });
  const createCard = () => setCardModal({ open: true });

  return (
    <div>
      <PageHeader
        title="Contas e cartões"
        description="Saldos das contas e limites dos cartões"
        action={
          <Button type="button" onClick={tab === 'contas' ? createAccount : createCard}>
            <Icon name="plus" className="h-4 w-4" />
            {tab === 'contas' ? 'Nova conta' : 'Novo cartão'}
          </Button>
        }
      />
      <Tabs
        label="Contas e cartões"
        tabs={[
          { value: 'contas', label: 'Contas' },
          { value: 'cartoes', label: 'Cartões' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'contas' ? (
        <AccountsTab onCreate={createAccount} onEdit={(account) => setAccountModal({ open: true, account })} />
      ) : (
        <CardsTab onCreate={createCard} onEdit={(card) => setCardModal({ open: true, card })} />
      )}

      <AccountFormModal
        open={accountModal.open}
        account={accountModal.account}
        onClose={() => setAccountModal({ open: false })}
      />
      <CardFormModal open={cardModal.open} card={cardModal.card} onClose={() => setCardModal({ open: false })} />
    </div>
  );
}

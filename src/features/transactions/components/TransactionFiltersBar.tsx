import { useId, useState } from 'react';
import type { TransactionFilters, TransactionSortOrder } from '../types';
import { useAccountsQuery } from '../../accounts/hooks/useAccountsQuery';
import { useCardsQuery } from '../../accounts/hooks/useCardsQuery';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useTagsQuery } from '../../categories/hooks/useTagsQuery';
import { TIPO_CONTA_ICONS } from '../../accounts/pickerOptions';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Icon, type IconName } from '../../../shared/components/icons';
import { cn } from '../../../shared/utils/cn';

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  ordenacao: TransactionSortOrder;
  onOrdenacaoChange: (value: TransactionSortOrder) => void;
}

/** Busca sempre visível; os demais filtros ficam num painel que abre sob demanda. */
export function TransactionFiltersBar({ filters, onChange, ordenacao, onOrdenacaoChange }: TransactionFiltersBarProps) {
  const { data: accounts } = useAccountsQuery();
  const { data: cards } = useCardsQuery();
  const { data: categories } = useCategoriesQuery();
  const { data: tags } = useTagsQuery();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const activeCount = Object.entries(filters).filter(
    ([key, value]) => !['busca', 'dataInicio', 'dataFim', 'contaId', 'cartaoCreditoId'].includes(key) && Boolean(value),
  ).length;

  function toggleApenasRecorrentes() {
    onChange({ ...filters, apenasRecorrentes: filters.apenasRecorrentes ? undefined : true });
  }

  function update<K extends keyof TransactionFilters>(key: K, value: string) {
    onChange({ ...filters, [key]: value === '' ? undefined : (value as TransactionFilters[K]) });
  }

  function selectConta(id: string | undefined) {
    onChange({ ...filters, contaId: id, cartaoCreditoId: undefined });
  }

  function selectCartao(id: string | undefined) {
    onChange({ ...filters, cartaoCreditoId: id, contaId: undefined });
  }

  const hasAccountFilter = Boolean(filters.contaId || filters.cartaoCreditoId);
  const hasAccounts = (accounts?.length ?? 0) > 0 || (cards?.length ?? 0) > 0;

  return (
    <div className="mb-4">
      {/* Seletor de conta/cartão */}
      {hasAccounts && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {/* Chip "Todas" */}
          <button
            type="button"
            aria-pressed={!hasAccountFilter}
            onClick={() => onChange({ ...filters, contaId: undefined, cartaoCreditoId: undefined })}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors duration-(--duration-fast)',
              !hasAccountFilter
                ? 'border-primary bg-primary-soft text-primary-text'
                : 'border-border-strong bg-surface text-text-muted hover:bg-surface-hover hover:text-text',
            )}
          >
            Todas
          </button>

          {/* Contas */}
          {(accounts ?? []).filter((c) => c.ativo).map((conta) => {
            const isSelected = filters.contaId === conta.id;
            return (
              <button
                key={conta.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectConta(isSelected ? undefined : conta.id)}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors duration-(--duration-fast)',
                  isSelected
                    ? 'border-primary bg-primary-soft text-primary-text'
                    : 'border-border-strong bg-surface text-text-muted hover:bg-surface-hover hover:text-text',
                )}
              >
                <Icon
                  name={(conta.icone as IconName | null | undefined) ?? TIPO_CONTA_ICONS[conta.tipo]}
                  className="h-3.5 w-3.5"
                />
                {conta.nome}
              </button>
            );
          })}

          {/* Cartões */}
          {(cards ?? []).filter((c) => c.ativo).map((cartao) => {
            const isSelected = filters.cartaoCreditoId === cartao.id;
            return (
              <button
                key={cartao.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectCartao(isSelected ? undefined : cartao.id)}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors duration-(--duration-fast)',
                  isSelected
                    ? 'border-primary bg-primary-soft text-primary-text'
                    : 'border-border-strong bg-surface text-text-muted hover:bg-surface-hover hover:text-text',
                )}
              >
                <Icon name={(cartao.icone as IconName | null | undefined) ?? 'card'} className="h-3.5 w-3.5" />
                {cartao.nome}
              </button>
            );
          })}
        </div>
      )}

      {/* Chips de filtro rápido */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button
          type="button"
          aria-pressed={Boolean(filters.apenasRecorrentes)}
          onClick={toggleApenasRecorrentes}
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors duration-(--duration-fast)',
            filters.apenasRecorrentes
              ? 'border-primary bg-primary-soft text-primary-text'
              : 'border-border-strong bg-surface text-text-muted hover:bg-surface-hover hover:text-text',
          )}
        >
          <Icon name="repeat" className="h-3.5 w-3.5" />
          Recorrentes
        </button>
        <button
          type="button"
          aria-pressed={filters.status === 'Pendente'}
          onClick={() => onChange({ ...filters, status: filters.status === 'Pendente' ? undefined : 'Pendente' })}
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors duration-(--duration-fast)',
            filters.status === 'Pendente'
              ? 'border-warning bg-warning/10 text-warning'
              : 'border-border-strong bg-surface text-text-muted hover:bg-surface-hover hover:text-text',
          )}
        >
          Pendentes
        </button>
        <button
          type="button"
          aria-pressed={filters.status === 'Pago' || filters.status === 'Recebido'}
          onClick={() => {
            const isActive = filters.status === 'Pago' || filters.status === 'Recebido';
            onChange({ ...filters, status: isActive ? undefined : 'Pago' });
          }}
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors duration-(--duration-fast)',
            filters.status === 'Pago' || filters.status === 'Recebido'
              ? 'border-income/60 bg-income/10 text-income'
              : 'border-border-strong bg-surface text-text-muted hover:bg-surface-hover hover:text-text',
          )}
        >
          Realizados
        </button>
      </div>

      {/* Busca + ordenação + filtros avançados */}
      <div className="flex gap-2">
        <Input
          type="search"
          icon="search"
          aria-label="Buscar por descrição"
          placeholder="Buscar por descrição"
          value={filters.busca ?? ''}
          onChange={(event) => update('busca', event.target.value)}
          containerClassName="flex-1"
        />
        <select
          aria-label="Ordenar por"
          value={ordenacao}
          onChange={(event) => onOrdenacaoChange(event.target.value as TransactionSortOrder)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="data_desc">Data (recente)</option>
          <option value="data_asc">Data (antiga)</option>
          <option value="valor_desc">Valor (maior)</option>
          <option value="valor_asc">Valor (menor)</option>
        </select>
        <Button
          type="button"
          variant={activeCount > 0 ? 'primary' : 'outline'}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          <Icon name="sliders" className="h-4 w-4" />
          Filtros
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger-fill px-1.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {open && (
        <Card id={panelId} padding="md" className="mt-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 lg:grid-cols-4">
            <Select label="Tipo" value={filters.tipo ?? ''} onChange={(event) => update('tipo', event.target.value)}>
              <option value="">Todos</option>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
              <option value="Transferencia">Transferência</option>
            </Select>
            <Select
              label="Status"
              value={filters.status ?? ''}
              onChange={(event) => update('status', event.target.value)}
            >
              <option value="">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
              <option value="Recebido">Recebido</option>
              <option value="Cancelado">Cancelado</option>
            </Select>
            <Select
              label="Conta"
              value={filters.contaId ?? ''}
              onChange={(event) => update('contaId', event.target.value)}
            >
              <option value="">Todas</option>
              {(accounts ?? []).map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.nome}
                </option>
              ))}
            </Select>
            <Select
              label="Categoria"
              value={filters.categoriaId ?? ''}
              onChange={(event) => update('categoriaId', event.target.value)}
            >
              <option value="">Todas</option>
              {(categories ?? []).map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </Select>
            <Select label="Tag" value={filters.tagId ?? ''} onChange={(event) => update('tagId', event.target.value)}>
              <option value="">Todas</option>
              {(tags ?? []).map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.nome}
                </option>
              ))}
            </Select>
            <div className="col-span-2 flex items-end lg:col-span-1">
              <Button
                type="button"
                variant="ghost"
                disabled={activeCount === 0}
                onClick={() => onChange({ busca: filters.busca })}
                className="w-full sm:w-auto"
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

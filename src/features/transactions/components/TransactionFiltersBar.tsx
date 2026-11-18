import { useId, useState } from 'react';
import type { TransactionFilters } from '../types';
import { useAccountsQuery } from '../../accounts/hooks/useAccountsQuery';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useTagsQuery } from '../../categories/hooks/useTagsQuery';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Icon } from '../../../shared/components/icons';

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

/** Busca sempre visível; os demais filtros ficam num painel que abre sob demanda. */
export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersBarProps) {
  const { data: accounts } = useAccountsQuery();
  const { data: categories } = useCategoriesQuery();
  const { data: tags } = useTagsQuery();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const activeCount = Object.entries(filters).filter(([key, value]) => key !== 'busca' && Boolean(value)).length;

  function update<K extends keyof TransactionFilters>(key: K, value: string) {
    onChange({ ...filters, [key]: value === '' ? undefined : (value as TransactionFilters[K]) });
  }

  return (
    <div className="mb-4">
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
            <Input
              type="date"
              label="De"
              value={filters.dataInicio ?? ''}
              onChange={(event) => update('dataInicio', event.target.value)}
            />
            <Input
              type="date"
              label="Até"
              value={filters.dataFim ?? ''}
              onChange={(event) => update('dataFim', event.target.value)}
            />
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

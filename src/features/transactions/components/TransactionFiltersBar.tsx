import type { TransactionFilters } from '../types';
import { useAccountsQuery } from '../../accounts/hooks/useAccountsQuery';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useTagsQuery } from '../../categories/hooks/useTagsQuery';
import { Card } from '../../../shared/components/ui/Card';
import { Select } from '../../../shared/components/ui/Select';
import { Icon } from '../../../shared/components/icons';

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersBarProps) {
  const { data: accounts } = useAccountsQuery();
  const { data: categories } = useCategoriesQuery();
  const { data: tags } = useTagsQuery();

  function update<K extends keyof TransactionFilters>(key: K, value: string) {
    onChange({ ...filters, [key]: value === '' ? undefined : (value as TransactionFilters[K]) });
  }

  return (
    <Card className="mb-5 space-y-3 p-4">
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          type="search"
          placeholder="Buscar por descrição..."
          value={filters.busca ?? ''}
          onChange={(event) => update('busca', event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={filters.dataInicio ?? ''}
          onChange={(event) => update('dataInicio', event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark] dark:focus:ring-indigo-500/20"
        />
        <input
          type="date"
          value={filters.dataFim ?? ''}
          onChange={(event) => update('dataFim', event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark] dark:focus:ring-indigo-500/20"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select value={filters.tipo ?? ''} onChange={(event) => update('tipo', event.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="Receita">Receita</option>
          <option value="Despesa">Despesa</option>
          <option value="Transferencia">Transferência</option>
        </Select>
        <Select value={filters.status ?? ''} onChange={(event) => update('status', event.target.value)}>
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Pago">Pago</option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select value={filters.contaId ?? ''} onChange={(event) => update('contaId', event.target.value)}>
          <option value="">Todas as contas</option>
          {(accounts ?? []).map((conta) => (
            <option key={conta.id} value={conta.id}>
              {conta.nome}
            </option>
          ))}
        </Select>
        <Select value={filters.categoriaId ?? ''} onChange={(event) => update('categoriaId', event.target.value)}>
          <option value="">Todas as categorias</option>
          {(categories ?? []).map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </Select>
      </div>
      <Select value={filters.tagId ?? ''} onChange={(event) => update('tagId', event.target.value)}>
        <option value="">Todas as tags</option>
        {(tags ?? []).map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.nome}
          </option>
        ))}
      </Select>
    </Card>
  );
}

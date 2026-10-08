import { useState, type FormEvent } from 'react';
import { Tabs } from '../../shared/components/ui/Tabs';
import { Spinner } from '../../shared/components/ui/Spinner';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Button } from '../../shared/components/ui/Button';
import { Icon } from '../../shared/components/icons';
import { useCategoriesQuery } from './hooks/useCategoriesQuery';
import { useDeleteCategoryMutation } from './hooks/useCategoryMutations';
import { useTagsQuery } from './hooks/useTagsQuery';
import { useCreateTagMutation, useDeleteTagMutation } from './hooks/useTagMutations';
import { CategoryFormModal } from './components/CategoryFormModal';
import { SubcategoryManager } from './components/SubcategoryManager';
import type { Categoria } from './types';

const TIPO_LABELS: Record<Categoria['tipo'], string> = {
  Receita: 'Receita',
  Despesa: 'Despesa',
};

function CategoriesTab() {
  const { data, isLoading, isError, error, refetch } = useCategoriesQuery();
  const deleteMutation = useDeleteCategoryMutation();
  const [modalState, setModalState] = useState<{ open: boolean; category?: Categoria }>({ open: false });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button type="button" onClick={() => setModalState({ open: true })}>
          <Icon name="plus" className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      {isLoading && <Spinner label="Carregando categorias..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="tag"
          title="Nenhuma categoria cadastrada"
          description="Cadastre categorias para organizar seus lançamentos."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-2.5">
          {data.map((categoria) => (
            <li
              key={categoria.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900"
                    style={{ backgroundColor: categoria.cor ?? '#94a3b8' }}
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{categoria.nome}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{TIPO_LABELS[categoria.tipo]}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalState({ open: true, category: categoria })}
                  >
                    <Icon name="pencil" className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Excluir a categoria "${categoria.nome}"?`)) {
                        deleteMutation.mutate(categoria.id);
                      }
                    }}
                  >
                    <Icon name="trash" className="h-3.5 w-3.5" />
                    Excluir
                  </Button>
                </div>
              </div>
              <SubcategoryManager category={categoria} />
            </li>
          ))}
        </ul>
      )}

      <CategoryFormModal
        open={modalState.open}
        category={modalState.category}
        onClose={() => setModalState({ open: false })}
      />
    </div>
  );
}

function TagsTab() {
  const { data, isLoading, isError, error, refetch } = useTagsQuery();
  const createMutation = useCreateTagMutation();
  const deleteMutation = useDeleteTagMutation();
  const [novaTag, setNovaTag] = useState('');

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const nome = novaTag.trim();
    if (!nome) return;
    createMutation.mutate({ nome }, { onSuccess: () => setNovaTag('') });
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-5 flex gap-2">
        <input
          value={novaTag}
          onChange={(event) => setNovaTag(event.target.value)}
          placeholder="Nova tag"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20"
        />
        <Button type="submit" disabled={createMutation.isPending}>
          <Icon name="plus" className="h-4 w-4" />
          Adicionar
        </Button>
      </form>

      {isLoading && <Spinner label="Carregando tags..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon="tag"
          title="Nenhuma tag cadastrada"
          description="Crie tags para marcar transações com contexto extra."
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag.nome}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Remover a tag "${tag.nome}"? Ela sai de todos os lançamentos.`)) {
                    deleteMutation.mutate(tag.id);
                  }
                }}
                className="text-slate-400 transition-colors hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                aria-label={`Remover ${tag.nome}`}
              >
                <Icon name="x" className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoriesPage() {
  const [tab, setTab] = useState<'categorias' | 'tags'>('categorias');

  return (
    <div>
      <PageHeader title="Categorias" />
      <Tabs
        label="Categorias e tags"
        tabs={[
          { value: 'categorias', label: 'Categorias' },
          { value: 'tags', label: 'Tags' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'categorias' ? <CategoriesTab /> : <TagsTab />}
    </div>
  );
}

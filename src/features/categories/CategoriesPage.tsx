import { useState } from 'react';
import { ApiError } from '../../shared/types/api';
import { useConfirm, useToast } from '../../shared/hooks/useFeedback';
import { ActionMenu } from '../../shared/components/ui/ActionMenu';
import { Button } from '../../shared/components/ui/Button';
import { Card } from '../../shared/components/ui/Card';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { ErrorState } from '../../shared/components/ui/ErrorState';
import { IconBadge } from '../../shared/components/ui/IconPicker';
import { ListRow } from '../../shared/components/ui/ListRow';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { Tabs } from '../../shared/components/ui/Tabs';
import { Icon } from '../../shared/components/icons';
import { useCategoriesQuery } from './hooks/useCategoriesQuery';
import { useDeleteCategoryMutation } from './hooks/useCategoryMutations';
import { useTagsQuery } from './hooks/useTagsQuery';
import { useDeleteTagMutation } from './hooks/useTagMutations';
import { CategoryFormModal } from './components/CategoryFormModal';
import { SubcategoryManager } from './components/SubcategoryManager';
import { TagFormModal } from './components/TagFormModal';
import type { Categoria, Tag, TipoCategoria } from './types';

const SECOES: { tipo: TipoCategoria; titulo: string }[] = [
  { tipo: 'Despesa', titulo: 'Despesas' },
  { tipo: 'Receita', titulo: 'Receitas' },
];

function useErrorToast() {
  const toast = useToast();
  return (error: Error) =>
    toast({ tone: 'danger', message: error instanceof ApiError ? error.message : 'Não foi possível concluir a ação.' });
}

function CategoriesSkeleton() {
  return (
    <Card padding="none">
      <ul className="divide-y divide-border">
        {[0, 1, 2].map((key) => (
          <li key={key} className="px-5 py-4">
            <Skeleton className="h-4 w-40" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CategoriesTab({ onCreate, onEdit }: { onCreate: () => void; onEdit: (categoria: Categoria) => void }) {
  const { data, isLoading, isError, error, refetch } = useCategoriesQuery();
  const deleteMutation = useDeleteCategoryMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const onError = useErrorToast();

  async function handleDelete(categoria: Categoria) {
    const ok = await confirm({
      title: 'Excluir categoria?',
      description: `"${categoria.nome}" e suas subcategorias serão removidas.`,
      confirmLabel: 'Excluir',
      destructive: true,
    });
    if (ok) deleteMutation.mutate(categoria.id, { onSuccess: () => toast('Categoria excluída'), onError });
  }

  if (isLoading) return <CategoriesSkeleton />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="tag"
        title="Nenhuma categoria cadastrada"
        description="Cadastre categorias para organizar seus lançamentos."
        action={
          <Button type="button" onClick={onCreate}>
            <Icon name="plus" className="h-4 w-4" />
            Nova categoria
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {SECOES.map(({ tipo, titulo }) => {
        const categorias = data.filter((categoria) => categoria.tipo === tipo);
        if (categorias.length === 0) return null;
        return (
          <section key={tipo} aria-labelledby={`secao-${tipo}`}>
            <h2 id={`secao-${tipo}`} className="mb-2 flex items-baseline gap-2 px-1 text-sm font-semibold text-text">
              {titulo}
              <span className="font-normal text-text-muted">{categorias.length}</span>
            </h2>
            <Card padding="none">
              <ul className="divide-y divide-border">
                {categorias.map((categoria) => (
                  <li key={categoria.id} className="px-4 py-4 sm:px-5">
                    <div className="flex items-center gap-3">
                      <IconBadge name={categoria.icone} fallback="tag" color={categoria.cor} className="h-9 w-9 rounded-full ring-0" />
                      <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-text">{categoria.nome}</h3>
                      <ActionMenu
                        label={`Ações de ${categoria.nome}`}
                        className="-my-2 -mr-2"
                        items={[
                          { label: 'Editar', icon: 'pencil', onSelect: () => onEdit(categoria) },
                          { label: 'Excluir', icon: 'trash', tone: 'danger', onSelect: () => handleDelete(categoria) },
                        ]}
                      />
                    </div>
                    <div className="pl-12">
                      <SubcategoryManager category={categoria} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        );
      })}
    </div>
  );
}

function TagsTab({ onCreate, onEdit }: { onCreate: () => void; onEdit: (tag: Tag) => void }) {
  const { data, isLoading, isError, error, refetch } = useTagsQuery();
  const deleteMutation = useDeleteTagMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const onError = useErrorToast();

  async function handleDelete(tag: Tag) {
    const ok = await confirm({
      title: 'Remover tag?',
      description: `"${tag.nome}" sai de todos os lançamentos.`,
      confirmLabel: 'Remover',
      destructive: true,
    });
    if (ok) deleteMutation.mutate(tag.id, { onSuccess: () => toast('Tag removida'), onError });
  }

  if (isLoading) return <CategoriesSkeleton />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="tag"
        title="Nenhuma tag cadastrada"
        description="Tags marcam lançamentos de receita e despesa com contexto extra."
        action={
          <Button type="button" onClick={onCreate}>
            <Icon name="plus" className="h-4 w-4" />
            Nova tag
          </Button>
        }
      />
    );
  }

  return (
    <Card padding="none">
      <ul className="divide-y divide-border">
        {data.map((tag) => (
          <ListRow
            key={tag.id}
            icon={tag.icone || 'tag'}
            iconClassName="bg-primary-soft text-primary-text"
            title={<span className="truncate">#{tag.nome}</span>}
            onOpen={() => onEdit(tag)}
            openLabel={`Editar tag ${tag.nome}`}
            actions={
              <ActionMenu
                label={`Ações de ${tag.nome}`}
                items={[
                  { label: 'Editar', icon: 'pencil', onSelect: () => onEdit(tag) },
                  { label: 'Remover', icon: 'trash', tone: 'danger', onSelect: () => handleDelete(tag) },
                ]}
              />
            }
          />
        ))}
      </ul>
    </Card>
  );
}

export function CategoriesPage() {
  const [tab, setTab] = useState<'categorias' | 'tags'>('categorias');
  const [modalState, setModalState] = useState<{ open: boolean; category?: Categoria }>({ open: false });
  const [tagModal, setTagModal] = useState<{ open: boolean; tag?: Tag }>({ open: false });
  const openNew = () => setModalState({ open: true });
  const openNewTag = () => setTagModal({ open: true });

  return (
    <div>
      <PageHeader
        title="Categorias e tags"
        description="Como seus lançamentos são organizados"
        action={
          tab === 'categorias' ? (
            <Button type="button" onClick={openNew}>
              <Icon name="plus" className="h-4 w-4" />
              Nova categoria
            </Button>
          ) : (
            <Button type="button" onClick={openNewTag}>
              <Icon name="plus" className="h-4 w-4" />
              Nova tag
            </Button>
          )
        }
      />
      <Tabs
        label="Categorias e tags"
        tabs={[
          { value: 'categorias', label: 'Categorias' },
          { value: 'tags', label: 'Tags' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'categorias' ? (
        <CategoriesTab onCreate={openNew} onEdit={(category) => setModalState({ open: true, category })} />
      ) : (
        <TagsTab onCreate={openNewTag} onEdit={(tag) => setTagModal({ open: true, tag })} />
      )}

      <CategoryFormModal
        open={modalState.open}
        category={modalState.category}
        onClose={() => setModalState({ open: false })}
      />
      <TagFormModal open={tagModal.open} tag={tagModal.tag} onClose={() => setTagModal({ open: false })} />
    </div>
  );
}

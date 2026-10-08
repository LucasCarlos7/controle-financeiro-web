import { useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Categoria } from '../types';
import {
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from '../hooks/useCategoryMutations';
import { ApiError } from '../../../shared/types/api';
import { useConfirm, useToast } from '../../../shared/hooks/useFeedback';
import { Button } from '../../../shared/components/ui/Button';
import { RemovableChip } from '../../../shared/components/ui/Chip';
import { Input } from '../../../shared/components/ui/Input';
import { Icon } from '../../../shared/components/icons';

export function SubcategoryManager({ category }: { category: Categoria }) {
  const [novaSubcategoria, setNovaSubcategoria] = useState('');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<{ id: string; nome: string } | null>(null);
  const createMutation = useCreateSubcategoryMutation();
  const updateMutation = useUpdateSubcategoryMutation();
  const deleteMutation = useDeleteSubcategoryMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const subcategorias = category.subcategorias ?? [];

  const onError = (error: Error) =>
    toast({ tone: 'danger', message: error instanceof ApiError ? error.message : 'Não foi possível salvar.' });

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const nome = novaSubcategoria.trim();
    if (!nome) return;
    createMutation.mutate(
      { categoriaId: category.id, request: { nome } },
      {
        onSuccess: () => {
          setNovaSubcategoria('');
          toast('Subcategoria adicionada');
        },
        onError,
      },
    );
  }

  function commitRename(nomeAtual: string) {
    if (!editing) return;
    const nome = editing.nome.trim();
    const subcategoriaId = editing.id;
    setEditing(null);
    if (!nome || nome === nomeAtual) return;
    updateMutation.mutate(
      { categoriaId: category.id, subcategoriaId, request: { nome } },
      { onSuccess: () => toast('Subcategoria renomeada'), onError },
    );
  }

  function handleRenameKey(event: KeyboardEvent<HTMLInputElement>, nomeAtual: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitRename(nomeAtual);
    } else if (event.key === 'Escape') {
      setEditing(null);
    }
  }

  async function handleDelete(subcategoriaId: string, nome: string) {
    const ok = await confirm({
      title: 'Remover subcategoria?',
      description: `"${nome}" deixa de existir em ${category.nome}.`,
      confirmLabel: 'Remover',
      destructive: true,
    });
    if (ok) {
      deleteMutation.mutate(
        { categoriaId: category.id, subcategoriaId },
        { onSuccess: () => toast('Subcategoria removida'), onError },
      );
    }
  }

  return (
    <div className="mt-2 space-y-2">
      {subcategorias.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subcategorias.map((sub) =>
            editing?.id === sub.id ? (
              <input
                key={sub.id}
                autoFocus
                value={editing.nome}
                onChange={(event) => setEditing({ id: sub.id, nome: event.target.value })}
                onKeyDown={(event) => handleRenameKey(event, sub.nome)}
                onBlur={() => commitRename(sub.nome)}
                aria-label={`Novo nome para ${sub.nome}`}
                className="h-8 w-40 rounded-full border border-primary bg-surface px-3 text-sm text-text focus-visible:outline-offset-0"
              />
            ) : (
              <RemovableChip
                key={sub.id}
                onClick={() => setEditing({ id: sub.id, nome: sub.nome })}
                clickLabel={`Renomear ${sub.nome}`}
                onRemove={() => handleDelete(sub.id, sub.nome)}
                removeLabel={`Remover ${sub.nome}`}
              >
                {sub.nome}
              </RemovableChip>
            ),
          )}
        </div>
      )}

      {adding ? (
        <form onSubmit={handleAdd} className="flex items-start gap-2">
          <Input
            autoFocus
            aria-label={`Nova subcategoria de ${category.nome}`}
            placeholder="Nome da subcategoria"
            value={novaSubcategoria}
            onChange={(event) => setNovaSubcategoria(event.target.value)}
            onKeyDown={(event) => event.key === 'Escape' && setAdding(false)}
            containerClassName="flex-1"
          />
          <Button type="submit" variant="outline" loading={createMutation.isPending}>
            Adicionar
          </Button>
          <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
            Fechar
          </Button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="hit-area inline-flex items-center gap-1.5 rounded-control text-sm font-medium text-primary-text hover:underline"
        >
          <Icon name="plus" className="h-3.5 w-3.5" />
          Adicionar subcategoria
        </button>
      )}
    </div>
  );
}

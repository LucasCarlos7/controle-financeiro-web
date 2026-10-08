import { useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Categoria } from '../types';
import {
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from '../hooks/useCategoryMutations';
import { Button } from '../../../shared/components/ui/Button';
import { Icon } from '../../../shared/components/icons';

export function SubcategoryManager({ category }: { category: Categoria }) {
  const [novaSubcategoria, setNovaSubcategoria] = useState('');
  const [editing, setEditing] = useState<{ id: string; nome: string } | null>(null);
  const createMutation = useCreateSubcategoryMutation();
  const updateMutation = useUpdateSubcategoryMutation();
  const deleteMutation = useDeleteSubcategoryMutation();

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const nome = novaSubcategoria.trim();
    if (!nome) return;
    createMutation.mutate({ categoriaId: category.id, request: { nome } }, { onSuccess: () => setNovaSubcategoria('') });
  }

  function commitRename(nomeAtual: string) {
    if (!editing) return;
    const nome = editing.nome.trim();
    const subcategoriaId = editing.id;
    setEditing(null);
    if (!nome || nome === nomeAtual) return;
    updateMutation.mutate({ categoriaId: category.id, subcategoriaId, request: { nome } });
  }

  function handleRenameKey(event: KeyboardEvent<HTMLInputElement>, nomeAtual: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitRename(nomeAtual);
    } else if (event.key === 'Escape') {
      setEditing(null);
    }
  }

  function handleDelete(subcategoriaId: string, nome: string) {
    if (window.confirm(`Remover a subcategoria "${nome}"?`)) {
      deleteMutation.mutate({ categoriaId: category.id, subcategoriaId });
    }
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
      <div className="flex flex-wrap gap-2">
        {(category.subcategorias ?? []).map((sub) =>
          editing?.id === sub.id ? (
            <input
              key={sub.id}
              autoFocus
              value={editing.nome}
              onChange={(event) => setEditing({ id: sub.id, nome: event.target.value })}
              onKeyDown={(event) => handleRenameKey(event, sub.nome)}
              onBlur={() => commitRename(sub.nome)}
              aria-label={`Novo nome para ${sub.nome}`}
              className="w-36 rounded-full border border-indigo-500 bg-white px-3 py-1 text-xs text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-500/20"
            />
          ) : (
            <span
              key={sub.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <button
                type="button"
                onClick={() => setEditing({ id: sub.id, nome: sub.nome })}
                className="hover:underline"
                title="Clique para renomear"
              >
                {sub.nome}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(sub.id, sub.nome)}
                className="text-slate-400 transition-colors hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                aria-label={`Remover ${sub.nome}`}
              >
                <Icon name="x" className="h-3 w-3" />
              </button>
            </span>
          ),
        )}
      </div>
      <form onSubmit={handleAdd} className="mt-2 flex gap-2">
        <input
          value={novaSubcategoria}
          onChange={(event) => setNovaSubcategoria(event.target.value)}
          placeholder="Nova subcategoria"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20"
        />
        <Button type="submit" variant="outline" size="sm" disabled={createMutation.isPending}>
          Adicionar
        </Button>
      </form>
    </div>
  );
}

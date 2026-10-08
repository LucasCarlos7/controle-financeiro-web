import { useMemo } from 'react';
import { useCategoriesQuery } from '../../../categories/hooks/useCategoriesQuery';
import { Select } from '../../../../shared/components/ui/Select';
import { useTransactionForm } from './useTransactionForm';

/** Categoria do tipo escolhido e, quando ela tem, a subcategoria. */
export function CategoryFields() {
  const { register, watch } = useTransactionForm();
  const { data: categories } = useCategoriesQuery();

  const tipo = watch('tipo');
  const categoriaId = watch('categoriaId');

  const categoriasDoTipo = useMemo(
    () => (categories ?? []).filter((categoria) => categoria.tipo === tipo),
    [categories, tipo],
  );
  const subcategorias = useMemo(
    () => categoriasDoTipo.find((categoria) => categoria.id === categoriaId)?.subcategorias ?? [],
    [categoriasDoTipo, categoriaId],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        id="categoriaId"
        label="Categoria"
        containerClassName={subcategorias.length > 0 ? undefined : 'sm:col-span-2'}
        {...register('categoriaId')}
      >
        <option value="">Nenhuma</option>
        {categoriasDoTipo.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </Select>
      {subcategorias.length > 0 && (
        <Select id="subcategoriaId" label="Subcategoria" {...register('subcategoriaId')}>
          <option value="">Nenhuma</option>
          {subcategorias.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.nome}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}

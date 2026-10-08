import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useCategoriesQuery } from '../../../categories/hooks/useCategoriesQuery';
import { useTagsQuery } from '../../../categories/hooks/useTagsQuery';
import { SelectableChip } from '../../../../shared/components/ui/Chip';
import { FormSection } from '../../../../shared/components/ui/FormRows';
import type { PickerOption } from '../../../../shared/components/ui/OptionPicker';
import { SelectRowField } from '../../../../shared/components/ui/SelectRowField';
import { EntityIcon, Icon } from '../../../../shared/components/icons';
import { useTransactionForm } from './useTransactionForm';

const NENHUMA: PickerOption = { value: '', label: 'Nenhuma', description: 'Sem classificação', icon: 'x' };

function subcategoriasLabel(count: number) {
  if (count === 0) return undefined;
  return count === 1 ? '1 subcategoria' : `${count} subcategorias`;
}

/** Categoria do tipo escolhido, subcategoria (quando houver) e tags. */
export function ClassificationSection() {
  const { control, watch } = useTransactionForm();
  const { data: categories } = useCategoriesQuery();
  const { data: tags } = useTagsQuery();

  const tipo = watch('tipo');
  const categoriaId = watch('categoriaId');

  const categoriasDoTipo = useMemo(
    () => (categories ?? []).filter((categoria) => categoria.tipo === tipo),
    [categories, tipo],
  );
  const categoriaAtual = categoriasDoTipo.find((categoria) => categoria.id === categoriaId);
  const subcategorias = categoriaAtual?.subcategorias ?? [];
  const categoriaCor = categoriaAtual?.cor;

  return (
    <FormSection label="Classificação">
      <SelectRowField
        control={control}
        name="categoriaId"
        icon="tag"
        label="Categoria"
        pickerTitle="Qual é a categoria?"
        placeholder="Nenhuma"
        options={[
          NENHUMA,
          ...categoriasDoTipo.map((categoria) => ({
            value: categoria.id,
            label: categoria.nome,
            description: subcategoriasLabel(categoria.subcategorias?.length ?? 0),
            icon: categoria.icone || 'tag',
            color: categoria.cor,
          })),
        ]}
      />

      {subcategorias.length > 0 && (
        <SelectRowField
          control={control}
          name="subcategoriaId"
          icon="tag"
          label="Subcategoria"
          pickerTitle="Qual é a subcategoria?"
          placeholder="Nenhuma"
          options={[
            NENHUMA,
            ...subcategorias.map((sub) => ({ value: sub.id, label: sub.nome, icon: 'tag' as const, color: categoriaCor })),
          ]}
        />
      )}

      {tags && tags.length > 0 && (
        <fieldset className="px-3 py-3">
          <legend className="sr-only">Tags</legend>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-surface-sunken text-text-muted ring-1 ring-border"
            >
              <Icon name="tag" className="h-4 w-4" />
            </span>
            <span className="text-base font-medium text-text">Tags</span>
          </div>
          <Controller
            control={control}
            name="tagIds"
            render={({ field }) => (
              <div className="mt-2.5 flex flex-wrap gap-2 pl-11">
                {tags.map((tag) => {
                  const current = field.value ?? [];
                  const selected = current.includes(tag.id);
                  return (
                    <SelectableChip
                      key={tag.id}
                      selected={selected}
                      onToggle={() =>
                        field.onChange(selected ? current.filter((id) => id !== tag.id) : [...current, tag.id])
                      }
                    >
                      {tag.icone && <EntityIcon name={tag.icone} className="h-3.5 w-3.5" />}
                      {tag.nome}
                    </SelectableChip>
                  );
                })}
              </div>
            )}
          />
        </fieldset>
      )}
    </FormSection>
  );
}

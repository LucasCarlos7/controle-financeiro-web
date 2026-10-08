import { Controller } from 'react-hook-form';
import { useTagsQuery } from '../../../categories/hooks/useTagsQuery';
import { SelectableChip } from '../../../../shared/components/ui/Chip';
import { useTransactionForm } from './useTransactionForm';

export function TagsField() {
  const { control } = useTransactionForm();
  const { data: tags } = useTagsQuery();

  if (!tags || tags.length === 0) return null;

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-text">Tags</legend>
      <Controller
        control={control}
        name="tagIds"
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
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
                  {tag.nome}
                </SelectableChip>
              );
            })}
          </div>
        )}
      />
    </fieldset>
  );
}

import type { ReactNode } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { SelectRow } from './FormRows';
import type { IconName } from '../icons';
import type { PickerOption } from './OptionPicker';

interface SelectRowFieldProps<T extends FieldValues> {
  // O tipo de saída do formulário (zod) não importa para este campo.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  name: Path<T>;
  icon: IconName;
  label: string;
  pickerTitle: string;
  pickerDescription?: ReactNode;
  options: PickerOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  /** Efeito extra ao escolher (ex.: ajustar outro campo). */
  onPicked?: (value: string) => void;
}

/** SelectRow ligado ao react-hook-form. */
export function SelectRowField<T extends FieldValues>({ control, name, onPicked, ...props }: SelectRowFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <SelectRow
          {...props}
          value={(field.value as string | undefined) ?? ''}
          onChange={(value) => {
            field.onChange(value);
            onPicked?.(value);
          }}
        />
      )}
    />
  );
}

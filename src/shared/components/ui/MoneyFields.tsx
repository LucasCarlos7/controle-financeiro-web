import type { ReactNode } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { IconName } from '../icons';
import { AmountInput, MoneyRow } from './FormRows';

interface MoneyFieldBase<T extends FieldValues> {
  // O tipo de saída do formulário (zod) não importa para este campo.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  name: Path<T>;
  id?: string;
  error?: string;
}

/** AmountInput ligado ao react-hook-form; o campo recebe um número em reais. */
export function AmountInputField<T extends FieldValues>({
  control,
  name,
  ...props
}: MoneyFieldBase<T> & { tone?: 'expense' | 'income' | 'neutral'; label?: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AmountInput
          {...props}
          ref={field.ref}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

/** MoneyRow ligado ao react-hook-form. */
export function MoneyRowField<T extends FieldValues>({
  control,
  name,
  ...props
}: MoneyFieldBase<T> & { icon: IconName; label: ReactNode; required?: boolean; allowNegative?: boolean }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <MoneyRow
          {...props}
          ref={field.ref}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

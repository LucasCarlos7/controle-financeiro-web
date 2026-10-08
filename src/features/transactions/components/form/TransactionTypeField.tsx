import { Controller } from 'react-hook-form';
import { SegmentedControl } from '../../../../shared/components/ui/SegmentedControl';
import type { TipoTransacao } from '../../types';
import { useTransactionForm } from './useTransactionForm';

const TIPOS: { value: TipoTransacao; label: string }[] = [
  { value: 'Despesa', label: 'Despesa' },
  { value: 'Receita', label: 'Receita' },
  { value: 'Transferencia', label: 'Transferência' },
];

export function TransactionTypeField() {
  const { control } = useTransactionForm();

  return (
    <Controller
      control={control}
      name="tipo"
      render={({ field }) => (
        <SegmentedControl label="Tipo" options={TIPOS} value={field.value} onChange={field.onChange} />
      )}
    />
  );
}

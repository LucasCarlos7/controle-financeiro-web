import { Controller } from 'react-hook-form';
import { SegmentedControl } from '../../../../shared/components/ui/SegmentedControl';
import type { TipoTransacao } from '../../types';
import { useTransactionForm } from './useTransactionForm';

const TIPOS: { value: TipoTransacao; label: string; tone?: 'danger' | 'success' }[] = [
  { value: 'Despesa', label: 'Despesa', tone: 'danger' },
  { value: 'Receita', label: 'Receita', tone: 'success' },
  { value: 'Transferencia', label: 'Transferência' },
];

export function TransactionTypeField() {
  const { control } = useTransactionForm();

  return (
    <Controller
      control={control}
      name="tipo"
      render={({ field }) => (
        <SegmentedControl label="Tipo" options={TIPOS} value={field.value} onChange={field.onChange} className="mb-5" />
      )}
    />
  );
}

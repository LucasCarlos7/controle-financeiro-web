import { Controller } from 'react-hook-form';
import { SegmentedControl } from '../../../../shared/components/ui/SegmentedControl';
import type { StatusTransacao } from '../../types';
import { useTransactionForm } from './useTransactionForm';

const STATUS: { value: StatusTransacao; label: string }[] = [
  { value: 'Pago', label: 'Pago' },
  { value: 'Pendente', label: 'Pendente' },
];

export function StatusField() {
  const { control, watch } = useTransactionForm();
  const pagaComCartao = watch('tipo') === 'Despesa' && watch('formaPagamento') === 'cartao';

  return (
    <div>
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <SegmentedControl label="Status" showLabel options={STATUS} value={field.value} onChange={field.onChange} />
        )}
      />
      {pagaComCartao && (
        <p className="mt-1.5 text-sm text-text-muted">
          No cartão, a compra pendente ocupa o limite. Marque como paga quando a fatura for paga.
        </p>
      )}
    </div>
  );
}

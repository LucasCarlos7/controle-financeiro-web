import { Controller } from 'react-hook-form';
import { useAccountsQuery } from '../../../accounts/hooks/useAccountsQuery';
import { useCardsQuery } from '../../../accounts/hooks/useCardsQuery';
import { SegmentedControl } from '../../../../shared/components/ui/SegmentedControl';
import { Select } from '../../../../shared/components/ui/Select';
import type { FormaPagamento } from '../../transactionFormSchema';
import { useTransactionForm } from './useTransactionForm';

const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: 'conta', label: 'Conta' },
  { value: 'cartao', label: 'Cartão de crédito' },
];

/** Origem do lançamento: conta ou cartão (despesa) e, na transferência, a conta de destino. */
export function PaymentSourceFields() {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useTransactionForm();
  const { data: accounts } = useAccountsQuery(true);
  const { data: cards } = useCardsQuery(true);

  const tipo = watch('tipo');
  const formaPagamento = watch('formaPagamento');
  const isTransferencia = tipo === 'Transferencia';
  const pagaComCartao = tipo === 'Despesa' && formaPagamento === 'cartao';

  const contaOptions = (accounts ?? []).map((conta) => (
    <option key={conta.id} value={conta.id}>
      {conta.nome}
    </option>
  ));

  return (
    <>
      {tipo === 'Despesa' && (
        <Controller
          control={control}
          name="formaPagamento"
          render={({ field }) => (
            <SegmentedControl
              label="Pagar com"
              showLabel
              options={FORMAS_PAGAMENTO}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                // Compra no cartão normalmente ainda não foi paga: Pendente ocupa o limite até a fatura.
                setValue('status', value === 'cartao' ? 'Pendente' : 'Pago');
              }}
            />
          )}
        />
      )}

      <div className={isTransferencia ? 'grid gap-4 sm:grid-cols-2' : undefined}>
        {pagaComCartao ? (
          <Select
            id="cartaoCreditoId"
            label="Cartão de crédito"
            error={errors.cartaoCreditoId?.message}
            {...register('cartaoCreditoId')}
          >
            <option value="">Selecione</option>
            {(cards ?? []).map((cartao) => (
              <option key={cartao.id} value={cartao.id}>
                {cartao.nome}
              </option>
            ))}
          </Select>
        ) : (
          <Select
            id="contaId"
            label={isTransferencia ? 'Conta de origem' : 'Conta'}
            error={errors.contaId?.message}
            {...register('contaId')}
          >
            <option value="">Selecione</option>
            {contaOptions}
          </Select>
        )}

        {isTransferencia && (
          <Select
            id="contaDestinoId"
            label="Conta de destino"
            error={errors.contaDestinoId?.message}
            {...register('contaDestinoId')}
          >
            <option value="">Selecione</option>
            {contaOptions}
          </Select>
        )}
      </div>
    </>
  );
}

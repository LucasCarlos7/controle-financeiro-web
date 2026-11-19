import { useEffect } from 'react';
import { useAccountsQuery } from '../../../accounts/hooks/useAccountsQuery';
import { useCardsQuery } from '../../../accounts/hooks/useCardsQuery';
import { cartaoOption, contaOption } from '../../../accounts/pickerOptions';
import type { PickerOption } from '../../../../shared/components/ui/OptionPicker';
import { FormSection } from '../../../../shared/components/ui/FormRows';
import { SelectRowField } from '../../../../shared/components/ui/SelectRowField';
import { useTransactionForm } from './useTransactionForm';

const STATUS: PickerOption[] = [
  { value: 'Pago', label: 'Pago', description: 'Já conta no saldo', icon: 'check' },
  { value: 'Pendente', label: 'Pendente', description: 'Ainda não saiu da conta', icon: 'clock' },
];

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** Origem (conta ou cartão), destino da transferência e status. */
export function PaymentSection({ showStatus }: { showStatus: boolean }) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useTransactionForm();
  const { data: accounts } = useAccountsQuery(true);
  const { data: cards } = useCardsQuery(true);

  const tipo = watch('tipo');
  const formaPagamento = watch('formaPagamento');
  const contaId = watch('contaId');
  const cartaoCreditoId = watch('cartaoCreditoId');
  const isTransferencia = tipo === 'Transferencia';
  const pagaComCartao = tipo === 'Despesa' && formaPagamento === 'cartao';

  const contaOptions = (accounts ?? []).map(contaOption);
  const cartaoOptions = (cards ?? []).map(cartaoOption);

  useEffect(() => {
    if (contaOptions.length === 1 && !contaId) {
      setValue('contaId', contaOptions[0].value as string);
    }
  }, [contaOptions.length, contaId]);

  useEffect(() => {
    if (cartaoOptions.length === 1 && pagaComCartao && !cartaoCreditoId) {
      setValue('cartaoCreditoId', cartaoOptions[0].value as string);
    }
  }, [cartaoOptions.length, pagaComCartao, cartaoCreditoId]);
  const formasPagamento: PickerOption[] = [
    {
      value: 'conta',
      label: 'Conta',
      description: 'Débito, Pix ou dinheiro',
      icon: 'bank',
      meta: { value: plural(contaOptions.length, 'conta', 'contas') },
    },
    {
      value: 'cartao',
      label: 'Cartão de crédito',
      description: 'Entra pendente e ocupa o limite até a fatura',
      icon: 'card',
      meta: { value: plural(cartaoOptions.length, 'cartão', 'cartões') },
    },
  ];

  return (
    <FormSection
      label={isTransferencia ? 'Transferência' : 'Pagamento'}
      hint={
        showStatus && pagaComCartao
          ? 'No cartão, a compra pendente ocupa o limite. Marque como paga quando a fatura for paga.'
          : undefined
      }
    >
      {tipo === 'Despesa' && (
        <SelectRowField
          control={control}
          name="formaPagamento"
          icon="wallet"
          label="Pagar com"
          pickerTitle="Como foi pago?"
          pickerDescription="Depois você escolhe a conta ou o cartão."
          options={formasPagamento}
          required
          // Compra no cartão normalmente ainda não foi paga: Pendente ocupa o limite até a fatura.
          onPicked={(value) => setValue('status', value === 'cartao' ? 'Pendente' : 'Pago')}
        />
      )}

      {pagaComCartao ? (
        <SelectRowField
          control={control}
          name="cartaoCreditoId"
          icon="card"
          label="Cartão"
          pickerTitle="Qual cartão?"
          pickerDescription="Limite disponível de cada cartão."
          options={cartaoOptions}
          required
          error={errors.cartaoCreditoId?.message}
        />
      ) : (
        <SelectRowField
          control={control}
          name="contaId"
          icon="bank"
          label={isTransferencia ? 'De' : tipo === 'Receita' ? 'Recebido em' : 'Conta'}
          pickerTitle={isTransferencia ? 'De qual conta sai?' : 'Qual conta?'}
          pickerDescription="Saldo atual de cada conta."
          options={contaOptions}
          required
          error={errors.contaId?.message}
        />
      )}

      {isTransferencia && (
        <SelectRowField
          control={control}
          name="contaDestinoId"
          icon="swap"
          label="Para"
          pickerTitle="Para qual conta vai?"
          pickerDescription="Saldo atual de cada conta."
          options={contaOptions}
          required
          error={errors.contaDestinoId?.message}
        />
      )}

      {showStatus && (
        <SelectRowField
          control={control}
          name="status"
          icon="check"
          label="Status"
          pickerTitle="Já foi pago?"
          pickerDescription="Pendentes não mexem no saldo até serem marcados como pagos."
          options={STATUS}
          required
        />
      )}
    </FormSection>
  );
}

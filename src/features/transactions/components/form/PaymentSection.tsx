import { useAccountsQuery } from '../../../accounts/hooks/useAccountsQuery';
import { useCardsQuery } from '../../../accounts/hooks/useCardsQuery';
import { FormSection } from '../../../../shared/components/ui/FormRows';
import { SelectRowField } from '../../../../shared/components/ui/SelectRowField';
import { useTransactionForm } from './useTransactionForm';

const FORMAS_PAGAMENTO = [
  { value: 'conta', label: 'Conta', description: 'Débito, Pix ou dinheiro' },
  { value: 'cartao', label: 'Cartão de crédito', description: 'Entra pendente e ocupa o limite até a fatura' },
];

const STATUS = [
  { value: 'Pago', label: 'Pago' },
  { value: 'Pendente', label: 'Pendente', description: 'Ainda não saiu da conta' },
];

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
  const isTransferencia = tipo === 'Transferencia';
  const pagaComCartao = tipo === 'Despesa' && formaPagamento === 'cartao';

  const contaOptions = (accounts ?? []).map((conta) => ({ value: conta.id, label: conta.nome }));
  const cartaoOptions = (cards ?? []).map((cartao) => ({ value: cartao.id, label: cartao.nome }));

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
          options={FORMAS_PAGAMENTO}
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
          options={STATUS}
          required
        />
      )}
    </FormSection>
  );
}

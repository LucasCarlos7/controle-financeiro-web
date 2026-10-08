import { useFormContext } from 'react-hook-form';
import type { TransactionFormInput, TransactionFormOutput } from '../../transactionFormSchema';

/** Acesso tipado ao formulário de lançamento a partir dos subcomponentes. */
export function useTransactionForm() {
  return useFormContext<TransactionFormInput, unknown, TransactionFormOutput>();
}

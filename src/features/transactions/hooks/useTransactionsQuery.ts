import { useQuery } from '@tanstack/react-query';
import { listTransactions } from '../api/transactions.api';
import type { TransactionFilters } from '../types';

export function useTransactionsQuery(filters: TransactionFilters) {
  return useQuery({
    queryKey: ['transacoes', filters],
    queryFn: () => listTransactions(filters),
  });
}

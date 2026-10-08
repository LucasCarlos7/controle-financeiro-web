import { useQuery } from '@tanstack/react-query';
import { listBudgets } from '../api/budgets.api';

export function useBudgetsQuery(ano: number, mes: number) {
  return useQuery({
    queryKey: ['orcamentos', { ano, mes }],
    queryFn: () => listBudgets(ano, mes),
  });
}

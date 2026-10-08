import { useQuery } from '@tanstack/react-query';
import { getMonthlyEvolution, getMonthlySummary, getSpendingByCategory } from '../api/dashboard.api';

export function useMonthlySummaryQuery(ano: number, mes: number) {
  return useQuery({
    queryKey: ['dashboard', 'resumo-mensal', { ano, mes }],
    queryFn: () => getMonthlySummary(ano, mes),
  });
}

export function useSpendingByCategoryQuery(ano: number, mes: number) {
  return useQuery({
    queryKey: ['dashboard', 'gastos-por-categoria', { ano, mes }],
    queryFn: () => getSpendingByCategory(ano, mes),
  });
}

export function useMonthlyEvolutionQuery(dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: ['dashboard', 'evolucao-mensal', { dataInicio, dataFim }],
    queryFn: () => getMonthlyEvolution(dataInicio, dataFim),
  });
}

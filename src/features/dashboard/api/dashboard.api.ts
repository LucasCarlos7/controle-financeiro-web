import { apiRequest } from '../../../shared/lib/apiClient';
import type { EvolucaoMensal, GastoPorCategoria, ResumoMensal } from '../types';

export function getMonthlySummary(ano: number, mes: number): Promise<ResumoMensal> {
  return apiRequest<ResumoMensal>('/api/v1/Dashboard/resumo-mensal', { query: { ano, mes } });
}

export function getSpendingByCategory(ano: number, mes: number, incluirPendentes = true): Promise<GastoPorCategoria[]> {
  return apiRequest<GastoPorCategoria[]>('/api/v1/Dashboard/gastos-por-categoria', { query: { ano, mes, incluirPendentes } });
}

export function getMonthlyEvolution(dataInicio: string, dataFim: string): Promise<EvolucaoMensal[]> {
  return apiRequest<EvolucaoMensal[]>('/api/v1/Dashboard/evolucao-mensal', { query: { dataInicio, dataFim } });
}

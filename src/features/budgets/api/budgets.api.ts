import { apiRequest } from '../../../shared/lib/apiClient';
import type { CreateOrcamentoRequest, Orcamento, UpdateOrcamentoRequest } from '../types';

export function listBudgets(ano: number, mes: number): Promise<Orcamento[]> {
  return apiRequest<Orcamento[]>('/api/v1/Orcamentos', { query: { ano, mes } });
}

export function createBudget(request: CreateOrcamentoRequest): Promise<void> {
  return apiRequest<void>('/api/v1/Orcamentos', { method: 'POST', body: request });
}

export function updateBudget(id: string, request: UpdateOrcamentoRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/Orcamentos/${id}`, { method: 'PUT', body: request });
}

export function deleteBudget(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Orcamentos/${id}`, { method: 'DELETE' });
}

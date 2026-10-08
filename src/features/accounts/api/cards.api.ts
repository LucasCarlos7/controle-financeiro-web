import { apiRequest } from '../../../shared/lib/apiClient';
import type { CartaoCredito, CreateCartaoCreditoRequest, UpdateCartaoCreditoRequest } from '../types';

export function listCards(apenasAtivos?: boolean): Promise<CartaoCredito[]> {
  return apiRequest<CartaoCredito[]>('/api/v1/cartoes-credito', { query: { apenasAtivos } });
}

export function createCard(request: CreateCartaoCreditoRequest): Promise<void> {
  return apiRequest<void>('/api/v1/cartoes-credito', { method: 'POST', body: request });
}

export function updateCard(id: string, request: UpdateCartaoCreditoRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/cartoes-credito/${id}`, { method: 'PUT', body: request });
}

export function deactivateCard(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/cartoes-credito/${id}/desativar`, { method: 'POST' });
}

export function reactivateCard(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/cartoes-credito/${id}/reativar`, { method: 'POST' });
}

import { apiRequest } from '../../../shared/lib/apiClient';
import type { Conta, CreateContaRequest, UpdateContaRequest } from '../types';

export function listAccounts(apenasAtivas?: boolean): Promise<Conta[]> {
  return apiRequest<Conta[]>('/api/v1/Contas', { query: { apenasAtivas } });
}

export function createAccount(request: CreateContaRequest): Promise<void> {
  return apiRequest<void>('/api/v1/Contas', { method: 'POST', body: request });
}

export function updateAccount(id: string, request: UpdateContaRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/Contas/${id}`, { method: 'PUT', body: request });
}

export function deactivateAccount(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Contas/${id}/desativar`, { method: 'POST' });
}

export function reactivateAccount(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Contas/${id}/reativar`, { method: 'POST' });
}

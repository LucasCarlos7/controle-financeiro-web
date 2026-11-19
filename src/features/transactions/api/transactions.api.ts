import { apiRequest } from '../../../shared/lib/apiClient';
import type {
  CreateTransacaoRecorrenteRequest,
  CreateTransacaoRequest,
  Transacao,
  TransactionFilters,
  UpdateTransacaoRequest,
} from '../types';

export function listTransactions(filters: TransactionFilters): Promise<Transacao[]> {
  return apiRequest<Transacao[]>('/api/v1/Transacoes', { query: { ...filters } });
}

export function createTransaction(request: CreateTransacaoRequest): Promise<void> {
  return apiRequest<void>('/api/v1/Transacoes', { method: 'POST', body: request });
}

export function createRecurringTransaction(request: CreateTransacaoRecorrenteRequest): Promise<void> {
  return apiRequest<void>('/api/v1/Transacoes/recorrente', { method: 'POST', body: request });
}

export function deleteRecurrence(recorrenciaId: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Transacoes/recorrencias/${recorrenciaId}`, { method: 'DELETE' });
}

export function updateTransaction(id: string, request: UpdateTransacaoRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/Transacoes/${id}`, { method: 'PUT', body: request });
}

export function deleteTransaction(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Transacoes/${id}`, { method: 'DELETE' });
}

export function markTransactionPaid(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Transacoes/${id}/marcar-pago`, { method: 'POST' });
}

export function markTransactionReceived(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Transacoes/${id}/marcar-recebido`, { method: 'POST' });
}

export function markTransactionPending(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Transacoes/${id}/marcar-pendente`, { method: 'POST' });
}

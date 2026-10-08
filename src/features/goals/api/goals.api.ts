import { apiRequest } from '../../../shared/lib/apiClient';
import type { CreateAporteRequest, CreateObjetivoRequest, Objetivo, UpdateObjetivoRequest } from '../types';

export function listGoals(): Promise<Objetivo[]> {
  return apiRequest<Objetivo[]>('/api/v1/Objetivos');
}

export function createGoal(request: CreateObjetivoRequest): Promise<void> {
  return apiRequest<void>('/api/v1/Objetivos', { method: 'POST', body: request });
}

export function updateGoal(id: string, request: UpdateObjetivoRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/Objetivos/${id}`, { method: 'PUT', body: request });
}

export function deleteGoal(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Objetivos/${id}`, { method: 'DELETE' });
}

export function createContribution(goalId: string, request: CreateAporteRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/Objetivos/${goalId}/aportes`, { method: 'POST', body: request });
}

export function deleteContribution(goalId: string, aporteId: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Objetivos/${goalId}/aportes/${aporteId}`, { method: 'DELETE' });
}

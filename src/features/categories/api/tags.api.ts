import { apiRequest } from '../../../shared/lib/apiClient';
import type { CreateTagRequest, Tag, UpdateTagRequest } from '../types';

export function listTags(): Promise<Tag[]> {
  return apiRequest<Tag[]>('/api/v1/Tags');
}

export function createTag(request: CreateTagRequest): Promise<void> {
  return apiRequest<void>('/api/v1/Tags', { method: 'POST', body: request });
}

export function updateTag(id: string, request: UpdateTagRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/Tags/${id}`, { method: 'PUT', body: request });
}

export function deleteTag(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Tags/${id}`, { method: 'DELETE' });
}

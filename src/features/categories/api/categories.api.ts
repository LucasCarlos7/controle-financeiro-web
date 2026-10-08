import { apiRequest } from '../../../shared/lib/apiClient';
import type { Categoria, CreateCategoriaRequest, SubcategoriaRequest, UpdateCategoriaRequest } from '../types';

export function listCategories(): Promise<Categoria[]> {
  return apiRequest<Categoria[]>('/api/v1/Categorias');
}

export function createCategory(request: CreateCategoriaRequest): Promise<void> {
  return apiRequest<void>('/api/v1/Categorias', { method: 'POST', body: request });
}

export function updateCategory(id: string, request: UpdateCategoriaRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/Categorias/${id}`, { method: 'PUT', body: request });
}

export function deleteCategory(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Categorias/${id}`, { method: 'DELETE' });
}

export function createSubcategory(categoriaId: string, request: SubcategoriaRequest): Promise<void> {
  return apiRequest<void>(`/api/v1/Categorias/${categoriaId}/subcategorias`, { method: 'POST', body: request });
}

export function updateSubcategory(
  categoriaId: string,
  subcategoriaId: string,
  request: SubcategoriaRequest,
): Promise<void> {
  return apiRequest<void>(`/api/v1/Categorias/${categoriaId}/subcategorias/${subcategoriaId}`, {
    method: 'PUT',
    body: request,
  });
}

export function deleteSubcategory(categoriaId: string, subcategoriaId: string): Promise<void> {
  return apiRequest<void>(`/api/v1/Categorias/${categoriaId}/subcategorias/${subcategoriaId}`, {
    method: 'DELETE',
  });
}

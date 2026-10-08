import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  updateCategory,
  updateSubcategory,
} from '../api/categories.api';
import type { CreateCategoriaRequest, SubcategoriaRequest, UpdateCategoriaRequest } from '../types';
import { CATEGORIES_KEY } from './useCategoriesQuery';

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateCategoriaRequest) => createCategory(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateCategoriaRequest }) => updateCategory(id, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useCreateSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoriaId, request }: { categoriaId: string; request: SubcategoriaRequest }) =>
      createSubcategory(categoriaId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUpdateSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoriaId,
      subcategoriaId,
      request,
    }: {
      categoriaId: string;
      subcategoriaId: string;
      request: SubcategoriaRequest;
    }) => updateSubcategory(categoriaId, subcategoriaId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoriaId, subcategoriaId }: { categoriaId: string; subcategoriaId: string }) =>
      deleteSubcategory(categoriaId, subcategoriaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

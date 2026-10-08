import { useQuery } from '@tanstack/react-query';
import { listCategories } from '../api/categories.api';

export const CATEGORIES_KEY = ['categorias'];

export function useCategoriesQuery() {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: listCategories });
}

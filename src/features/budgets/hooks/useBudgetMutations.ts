import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudget, deleteBudget, updateBudget } from '../api/budgets.api';
import type { CreateOrcamentoRequest, UpdateOrcamentoRequest } from '../types';

const BUDGETS_KEY = ['orcamentos'];

export function useCreateBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateOrcamentoRequest) => createBudget(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
  });
}

export function useUpdateBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateOrcamentoRequest }) => updateBudget(id, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
  });
}

export function useDeleteBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
  });
}

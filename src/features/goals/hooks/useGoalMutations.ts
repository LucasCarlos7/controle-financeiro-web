import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContribution, createGoal, deleteContribution, deleteGoal, updateGoal } from '../api/goals.api';
import type { CreateAporteRequest, CreateObjetivoRequest, UpdateObjetivoRequest } from '../types';
import { GOALS_KEY } from './useGoalsQuery';

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateObjetivoRequest) => createGoal(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateObjetivoRequest }) => updateGoal(id, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });
}

export function useDeleteGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });
}

export function useCreateContributionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, request }: { goalId: string; request: CreateAporteRequest }) =>
      createContribution(goalId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });
}

export function useDeleteContributionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, aporteId }: { goalId: string; aporteId: string }) => deleteContribution(goalId, aporteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  });
}

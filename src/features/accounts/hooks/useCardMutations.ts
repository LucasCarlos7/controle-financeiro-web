import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCard, deactivateCard, reactivateCard, updateCard } from '../api/cards.api';
import type { CreateCartaoCreditoRequest, UpdateCartaoCreditoRequest } from '../types';

const CARDS_KEY = ['cartoes'];

export function useCreateCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateCartaoCreditoRequest) => createCard(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CARDS_KEY }),
  });
}

export function useUpdateCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateCartaoCreditoRequest }) => updateCard(id, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CARDS_KEY }),
  });
}

export function useDeactivateCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateCard(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CARDS_KEY }),
  });
}

export function useReactivateCardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivateCard(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CARDS_KEY }),
  });
}

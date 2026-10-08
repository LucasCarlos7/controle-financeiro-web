import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createRecurringTransaction,
  createTransaction,
  deleteRecurrence,
  deleteTransaction,
  markTransactionPaid,
  markTransactionPending,
  updateTransaction,
} from '../api/transactions.api';
import type { CreateTransacaoRecorrenteRequest, CreateTransacaoRequest, UpdateTransacaoRequest } from '../types';

function useInvalidateAfterMutation() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['transacoes'] });
    queryClient.invalidateQueries({ queryKey: ['contas'] });
    queryClient.invalidateQueries({ queryKey: ['cartoes'] });
    // Painel e orçamentos são derivados dos lançamentos; sem isso ficariam desatualizados até o staleTime expirar.
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
  };
}

export function useCreateTransactionMutation() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: (request: CreateTransacaoRequest) => createTransaction(request),
    onSuccess: invalidate,
  });
}

export function useCreateRecurringTransactionMutation() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: (request: CreateTransacaoRecorrenteRequest) => createRecurringTransaction(request),
    onSuccess: invalidate,
  });
}

export function useDeleteRecurrenceMutation() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: (recorrenciaId: string) => deleteRecurrence(recorrenciaId),
    onSuccess: invalidate,
  });
}

export function useUpdateTransactionMutation() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateTransacaoRequest }) => updateTransaction(id, request),
    onSuccess: invalidate,
  });
}

export function useDeleteTransactionMutation() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: invalidate,
  });
}

export function useMarkPaidMutation() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: (id: string) => markTransactionPaid(id),
    onSuccess: invalidate,
  });
}

export function useMarkPendingMutation() {
  const invalidate = useInvalidateAfterMutation();
  return useMutation({
    mutationFn: (id: string) => markTransactionPending(id),
    onSuccess: invalidate,
  });
}

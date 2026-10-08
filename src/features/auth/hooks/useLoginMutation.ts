import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth.api';
import { useAuth } from './useAuth';
import type { LoginRequest } from '../types';

export function useLoginMutation() {
  const { signIn } = useAuth();
  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onSuccess: (data) => signIn(data),
  });
}

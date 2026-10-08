import { useMutation } from '@tanstack/react-query';
import { register } from '../api/auth.api';
import { useAuth } from './useAuth';
import type { RegisterRequest } from '../types';

export function useRegisterMutation() {
  const { signIn } = useAuth();
  return useMutation({
    mutationFn: (request: RegisterRequest) => register(request),
    onSuccess: (data) => signIn(data),
  });
}

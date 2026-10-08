import { apiRequest } from '../../../shared/lib/apiClient';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export function login(request: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/Auth/entrar', {
    method: 'POST',
    body: request,
    skipAuth: true,
  });
}

export function register(request: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/Auth/registrar', {
    method: 'POST',
    body: request,
    skipAuth: true,
  });
}

import { ApiError, type ProblemDetails } from '../types/api';
import { emitUnauthorized, getStoredAuth } from './authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type QueryValue = string | number | boolean | undefined | null;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
  skipAuth?: boolean;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    }
  }
  const queryString = params.toString();
  const suffix = queryString ? `?${queryString}` : '';
  return `${BASE_URL}${path}${suffix}`;
}

export async function apiRequest<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { method = 'GET', body, query, signal, skipAuth } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (!skipAuth) {
    const auth = getStoredAuth();
    if (auth?.token) headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 401 && !skipAuth) {
    emitUnauthorized();
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!response.ok) {
    throw new ApiError(response.status, (data as ProblemDetails) ?? null);
  }

  return data as TResponse;
}

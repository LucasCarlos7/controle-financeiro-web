import { ApiError } from '../../types/api';
import { Icon } from '../icons';

interface FormErrorProps {
  error: unknown;
  fallback?: string;
}

/** Erro de envio de formulário (ProblemDetails da API ou mensagem genérica). */
export function FormError({ error, fallback = 'Não foi possível salvar.' }: FormErrorProps) {
  if (!error) return null;

  return (
    <p role="alert" className="flex items-start gap-2 rounded-control bg-danger-soft px-3 py-2.5 text-base text-danger">
      <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
      {error instanceof ApiError ? error.message : fallback}
    </p>
  );
}

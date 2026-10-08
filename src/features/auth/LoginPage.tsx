import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from './hooks/useLoginMutation';
import { ApiError } from '../../shared/types/api';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Icon } from '../../shared/components/icons';

const loginSchema = z.object({
  email: z.email({ message: 'E-mail inválido' }),
  senha: z.string().min(1, 'Informe a senha'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  function onSubmit(data: LoginFormData) {
    mutate(data, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    });
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm shadow-indigo-600/30">
            CF
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Controle Financeiro
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Entre para acompanhar suas finanças</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              id="email"
              type="email"
              label="E-mail"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="senha"
              type="password"
              label="Senha"
              autoComplete="current-password"
              error={errors.senha?.message}
              {...register('senha')}
            />
            {error && (
              <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                <Icon name="alert" className="h-4 w-4 shrink-0" />
                {error instanceof ApiError ? error.message : 'Não foi possível entrar. Tente novamente.'}
              </p>
            )}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Ainda não tem uma conta?{' '}
          <Link
            to="/registrar"
            className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

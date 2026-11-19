import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from './hooks/useLoginMutation';
import { AuthLayout } from '../../shared/layout/AuthLayout';
import { Button } from '../../shared/components/ui/Button';
import { FormError } from '../../shared/components/ui/FormError';
import { Input } from '../../shared/components/ui/Input';
import { PasswordInput } from '../../shared/components/ui/PasswordInput';

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
    <AuthLayout
      title="Entrar"
      description="Acompanhe suas finanças no Controle Financeiro"
      footer={
        <>
          Ainda não tem uma conta?{' '}
          <Link to="/registrar" className="hit-area font-medium text-primary-text hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="email"
          type="email"
          label="E-mail"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordInput
          id="senha"
          label="Senha"
          autoComplete="current-password"
          error={errors.senha?.message}
          {...register('senha')}
        />
        <FormError error={error} fallback="Não foi possível entrar. Tente novamente." />
        <Button type="submit" loading={isPending} className="w-full">
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </AuthLayout>
  );
}

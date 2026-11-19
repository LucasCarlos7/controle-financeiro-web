import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from './hooks/useRegisterMutation';
import { AuthLayout } from '../../shared/layout/AuthLayout';
import { Button } from '../../shared/components/ui/Button';
import { FormError } from '../../shared/components/ui/FormError';
import { Input } from '../../shared/components/ui/Input';
import { PasswordInput } from '../../shared/components/ui/PasswordInput';

const registerSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  email: z.email({ message: 'E-mail inválido' }),
  senha: z.string().min(8, 'A senha deve ter ao menos 8 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  function onSubmit(data: RegisterFormData) {
    mutate(data, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    });
  }

  return (
    <AuthLayout
      title="Criar conta"
      description="Comece a organizar suas finanças"
      footer={
        <>
          Já tem uma conta?{' '}
          <Link to="/login" className="hit-area font-medium text-primary-text hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="nome" label="Nome" autoComplete="name" error={errors.nome?.message} {...register('nome')} />
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
          autoComplete="new-password"
          hint="Mínimo de 8 caracteres."
          error={errors.senha?.message}
          {...register('senha')}
        />
        <FormError error={error} fallback="Não foi possível criar a conta. Tente novamente." />
        <Button type="submit" loading={isPending} className="w-full">
          {isPending ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
    </AuthLayout>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Conta, TipoConta } from '../types';
import { useCreateAccountMutation, useUpdateAccountMutation } from '../hooks/useAccountMutations';
import { ApiError } from '../../../shared/types/api';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Icon } from '../../../shared/components/icons';

const TIPO_CONTA_OPTIONS: { value: TipoConta; label: string }[] = [
  { value: 'Corrente', label: 'Conta corrente' },
  { value: 'Poupanca', label: 'Poupança' },
  { value: 'Carteira', label: 'Carteira' },
];

const formSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  tipo: z.enum(['Corrente', 'Poupanca', 'Carteira']),
  saldoInicial: z.coerce.number(),
});

type AccountFormInput = z.input<typeof formSchema>;
type AccountFormOutput = z.output<typeof formSchema>;

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  account?: Conta;
}

export function AccountFormModal({ open, onClose, account }: AccountFormModalProps) {
  const isEditing = Boolean(account);
  const createMutation = useCreateAccountMutation();
  const updateMutation = useUpdateAccountMutation();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormInput, unknown, AccountFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', tipo: 'Corrente', saldoInicial: 0 },
  });

  useEffect(() => {
    if (open) {
      reset({
        nome: account?.nome ?? '',
        tipo: account?.tipo ?? 'Corrente',
        saldoInicial: account?.saldoInicial ?? 0,
      });
    }
  }, [open, account, reset]);

  if (!open) return null;

  function onSubmit(data: AccountFormOutput) {
    if (isEditing && account) {
      updateMutation.mutate({ id: account.id, request: { nome: data.nome } }, { onSuccess: onClose });
    } else {
      createMutation.mutate(
        { nome: data.nome, tipo: data.tipo, saldoInicial: data.saldoInicial },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar conta' : 'Nova conta'}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="nome" label="Nome" error={errors.nome?.message} {...register('nome')} />

        {!isEditing && (
          <>
            <Select id="tipo" label="Tipo" {...register('tipo')}>
              {TIPO_CONTA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input
              id="saldoInicial"
              type="number"
              step="0.01"
              label="Saldo inicial"
              {...register('saldoInicial')}
            />
          </>
        )}

        {mutation.error && (
          <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            <Icon name="alert" className="h-4 w-4 shrink-0" />
            {mutation.error instanceof ApiError ? mutation.error.message : 'Não foi possível salvar.'}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending} className="flex-1">
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

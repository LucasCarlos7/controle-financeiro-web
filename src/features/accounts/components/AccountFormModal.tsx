import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Conta, TipoConta } from '../types';
import { useCreateAccountMutation, useUpdateAccountMutation } from '../hooks/useAccountMutations';
import { useToast } from '../../../shared/hooks/useFeedback';
import { Modal, ModalActions } from '../../../shared/components/ui/Modal';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';

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
  const formId = useId();
  const toast = useToast();
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
    const done = (message: string) => () => {
      toast(message);
      onClose();
    };
    if (isEditing && account) {
      updateMutation.mutate({ id: account.id, request: { nome: data.nome } }, { onSuccess: done('Conta atualizada') });
    } else {
      createMutation.mutate(
        { nome: data.nome, tipo: data.tipo, saldoInicial: data.saldoInicial },
        { onSuccess: done('Conta criada') },
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar conta' : 'Nova conta'}
      description={isEditing ? 'Depois de criada, só o nome da conta pode ser alterado.' : undefined}
      footer={<ModalActions onCancel={onClose} formId={formId} pending={mutation.isPending} />}
    >
      <form id={formId} className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="nome" label="Nome" placeholder="Ex.: Nubank" error={errors.nome?.message} {...register('nome')} />

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
              inputMode="decimal"
              prefix="R$"
              label="Saldo inicial"
              hint="Saldo da conta no dia em que você começa a usar o app."
              className="tabular-nums"
              onFocus={(event) => event.target.select()}
              {...register('saldoInicial')}
            />
          </>
        )}

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

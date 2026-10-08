import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Conta, TipoConta } from '../types';
import { useCreateAccountMutation, useUpdateAccountMutation } from '../hooks/useAccountMutations';
import { useToast } from '../../../shared/hooks/useFeedback';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { FormSection, TextRow } from '../../../shared/components/ui/FormRows';
import { SelectRowField } from '../../../shared/components/ui/SelectRowField';
import { MoneyRowField } from '../../../shared/components/ui/MoneyFields';
import { FormError } from '../../../shared/components/ui/FormError';

const TIPO_CONTA_OPTIONS: { value: TipoConta; label: string; description: string }[] = [
  { value: 'Corrente', label: 'Conta corrente', description: 'Conta de banco do dia a dia' },
  { value: 'Poupanca', label: 'Poupança', description: 'Reserva com rendimento' },
  { value: 'Carteira', label: 'Carteira', description: 'Dinheiro em espécie' },
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
    control,
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
      variant="sheet"
      title={isEditing ? 'Editar conta' : 'Criar conta'}
      description={isEditing ? 'Depois de criada, só o apelido da conta pode ser alterado.' : undefined}
      footer={
        <Button type="submit" form={formId} loading={mutation.isPending} className="h-12 w-full text-lg">
          {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar conta'}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormSection label="Minha conta">
          <TextRow
            id="nome"
            icon="text"
            label="Apelido da conta"
            placeholder="Ex.: Nubank"
            required
            error={errors.nome?.message}
            {...register('nome')}
          />
          {!isEditing && (
            <SelectRowField
              control={control}
              name="tipo"
              icon="wallet"
              label="Tipo de conta"
              pickerTitle="Qual é o tipo de conta?"
              options={TIPO_CONTA_OPTIONS}
              required
            />
          )}
        </FormSection>

        {!isEditing && (
          <FormSection label="Saldo" hint="Saldo da conta no dia em que você começa a usar o app. Use “-” para saldo negativo.">
            <MoneyRowField control={control} name="saldoInicial" id="saldoInicial" icon="bank" label="Saldo inicial" allowNegative />
          </FormSection>
        )}

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

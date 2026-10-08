import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { todayApiDate } from '../../../shared/utils/format';
import { useToast } from '../../../shared/hooks/useFeedback';
import { useCreateGoalMutation, useUpdateGoalMutation } from '../hooks/useGoalMutations';
import type { Objetivo } from '../types';
import { Modal, ModalActions } from '../../../shared/components/ui/Modal';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';

const formSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  valorAlvo: z.coerce.number().positive('Informe um valor válido'),
  dataAlvo: z.string().min(1, 'Informe a data alvo'),
});

type GoalFormInput = z.input<typeof formSchema>;
type GoalFormOutput = z.output<typeof formSchema>;

interface GoalFormModalProps {
  open: boolean;
  onClose: () => void;
  goal?: Objetivo;
}

export function GoalFormModal({ open, onClose, goal }: GoalFormModalProps) {
  const isEditing = Boolean(goal);
  const formId = useId();
  const toast = useToast();
  const createMutation = useCreateGoalMutation();
  const updateMutation = useUpdateGoalMutation();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormInput, unknown, GoalFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', valorAlvo: 0, dataAlvo: todayApiDate() },
  });

  useEffect(() => {
    if (open) {
      reset({
        nome: goal?.nome ?? '',
        valorAlvo: goal?.valorAlvo ?? 0,
        dataAlvo: goal?.dataAlvo ?? todayApiDate(),
      });
    }
  }, [open, goal, reset]);

  if (!open) return null;

  function onSubmit(data: GoalFormOutput) {
    const done = (message: string) => () => {
      toast(message);
      onClose();
    };
    if (isEditing && goal) {
      updateMutation.mutate({ id: goal.id, request: data }, { onSuccess: done('Objetivo atualizado') });
    } else {
      createMutation.mutate(data, { onSuccess: done('Objetivo criado') });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar objetivo' : 'Novo objetivo'}
      footer={<ModalActions onCancel={onClose} formId={formId} pending={mutation.isPending} />}
    >
      <form id={formId} className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="nome"
          label="Nome"
          placeholder="Ex.: Reserva de emergência"
          error={errors.nome?.message}
          {...register('nome')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="valorAlvo"
            type="number"
            step="0.01"
            inputMode="decimal"
            prefix="R$"
            label="Valor alvo"
            className="tabular-nums"
            error={errors.valorAlvo?.message}
            onFocus={(event) => event.target.select()}
            {...register('valorAlvo')}
          />
          <Input id="dataAlvo" type="date" label="Data alvo" error={errors.dataAlvo?.message} {...register('dataAlvo')} />
        </div>

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

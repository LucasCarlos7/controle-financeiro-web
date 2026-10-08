import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Modal } from '../../../shared/components/ui/Modal';
import { ApiError } from '../../../shared/types/api';
import { todayApiDate } from '../../../shared/utils/format';
import { useCreateGoalMutation, useUpdateGoalMutation } from '../hooks/useGoalMutations';
import type { Objetivo } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Icon } from '../../../shared/components/icons';

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
    if (isEditing && goal) {
      updateMutation.mutate({ id: goal.id, request: data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar objetivo' : 'Novo objetivo'}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="nome" label="Nome" error={errors.nome?.message} {...register('nome')} />

        <Input
          id="valorAlvo"
          type="number"
          step="0.01"
          label="Valor alvo"
          error={errors.valorAlvo?.message}
          {...register('valorAlvo')}
        />

        <Input id="dataAlvo" type="date" label="Data alvo" error={errors.dataAlvo?.message} {...register('dataAlvo')} />

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

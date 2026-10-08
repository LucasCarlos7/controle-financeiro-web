import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { todayApiDate } from '../../../shared/utils/format';
import { useToast } from '../../../shared/hooks/useFeedback';
import { useCreateGoalMutation, useUpdateGoalMutation } from '../hooks/useGoalMutations';
import type { Objetivo } from '../types';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { FormSection, TextRow } from '../../../shared/components/ui/FormRows';
import { AmountInputField } from '../../../shared/components/ui/MoneyFields';
import { FormError } from '../../../shared/components/ui/FormError';

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
    control,
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
      variant="sheet"
      title={isEditing ? 'Editar objetivo' : 'Novo objetivo'}
      footer={
        <Button type="submit" form={formId} loading={mutation.isPending} className="h-12 w-full text-lg">
          {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar objetivo'}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <AmountInputField control={control} name="valorAlvo" id="valorAlvo" label="Valor alvo" error={errors.valorAlvo?.message} />
        <FormSection label="Objetivo">
          <TextRow
            id="nome"
            icon="target"
            label="Nome"
            placeholder="Ex.: Viagem"
            required
            error={errors.nome?.message}
            {...register('nome')}
          />
          <TextRow
            id="dataAlvo"
            icon="calendar"
            label="Data alvo"
            type="date"
            required
            error={errors.dataAlvo?.message}
            {...register('dataAlvo')}
          />
        </FormSection>

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

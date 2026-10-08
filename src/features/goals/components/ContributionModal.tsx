import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { todayApiDate } from '../../../shared/utils/format';
import { useToast } from '../../../shared/hooks/useFeedback';
import { useCreateContributionMutation } from '../hooks/useGoalMutations';
import { Modal, ModalActions } from '../../../shared/components/ui/Modal';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';

const formSchema = z.object({
  valor: z.coerce.number().positive('Informe um valor válido'),
  data: z.string().min(1, 'Informe a data'),
});

type ContributionFormInput = z.input<typeof formSchema>;
type ContributionFormOutput = z.output<typeof formSchema>;

interface ContributionModalProps {
  open: boolean;
  onClose: () => void;
  goalId: string;
  goalName: string;
}

export function ContributionModal({ open, onClose, goalId, goalName }: ContributionModalProps) {
  const formId = useId();
  const toast = useToast();
  const createMutation = useCreateContributionMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionFormInput, unknown, ContributionFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: { valor: 0, data: todayApiDate() },
  });

  if (!open) return null;

  function onSubmit(data: ContributionFormOutput) {
    createMutation.mutate(
      { goalId, request: data },
      {
        onSuccess: () => {
          reset();
          toast('Aporte registrado');
          onClose();
        },
      },
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar aporte"
      description={goalName}
      footer={<ModalActions onCancel={onClose} formId={formId} pending={createMutation.isPending} />}
    >
      <form id={formId} className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="valor"
            type="number"
            step="0.01"
            inputMode="decimal"
            prefix="R$"
            label="Valor"
            className="tabular-nums"
            error={errors.valor?.message}
            onFocus={(event) => event.target.select()}
            {...register('valor')}
          />
          <Input id="data" type="date" label="Data" error={errors.data?.message} {...register('data')} />
        </div>
        <p className="text-sm text-text-muted">O aporte soma no objetivo; ele não movimenta nenhuma conta.</p>

        <FormError error={createMutation.error} />
      </form>
    </Modal>
  );
}

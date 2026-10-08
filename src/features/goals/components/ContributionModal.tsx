import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { todayApiDate } from '../../../shared/utils/format';
import { useToast } from '../../../shared/hooks/useFeedback';
import { useCreateContributionMutation } from '../hooks/useGoalMutations';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { AmountInput, FormSection, TextRow } from '../../../shared/components/ui/FormRows';
import { FormError } from '../../../shared/components/ui/FormError';

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
  const mutation = createMutation;

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
      variant="sheet"
      title="Registrar aporte"
      description={goalName}
      footer={
        <Button type="submit" form={formId} loading={mutation.isPending} className="h-12 w-full text-lg">
          {mutation.isPending ? 'Salvando...' : 'Registrar aporte'}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <AmountInput id="valor" tone="income" error={errors.valor?.message} {...register('valor')} />
        <FormSection label="Aporte" hint="O aporte soma no objetivo; ele não movimenta nenhuma conta.">
          <TextRow id="data" icon="calendar" label="Data" type="date" required error={errors.data?.message} {...register('data')} />
        </FormSection>

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

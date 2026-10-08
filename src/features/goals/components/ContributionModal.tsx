import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Modal } from '../../../shared/components/Modal';
import { ApiError } from '../../../shared/types/api';
import { todayApiDate } from '../../../shared/utils/format';
import { useCreateContributionMutation } from '../hooks/useGoalMutations';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Icon } from '../../../shared/components/icons';

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
          onClose();
        },
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={`Registrar aporte — ${goalName}`}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="valor" type="number" step="0.01" label="Valor" error={errors.valor?.message} {...register('valor')} />

        <Input id="data" type="date" label="Data" error={errors.data?.message} {...register('data')} />

        {createMutation.error && (
          <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            <Icon name="alert" className="h-4 w-4 shrink-0" />
            {createMutation.error instanceof ApiError ? createMutation.error.message : 'Não foi possível salvar.'}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={createMutation.isPending} className="flex-1">
            {createMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

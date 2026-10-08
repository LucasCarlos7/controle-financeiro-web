import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Modal } from '../../../shared/components/Modal';
import { ApiError } from '../../../shared/types/api';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useCreateBudgetMutation, useUpdateBudgetMutation } from '../hooks/useBudgetMutations';
import type { Orcamento } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Icon } from '../../../shared/components/icons';

const formSchema = z.object({
  categoriaId: z.string().min(1, 'Selecione a categoria'),
  limiteValor: z.coerce.number().positive('Informe um valor válido'),
});

type BudgetFormInput = z.input<typeof formSchema>;
type BudgetFormOutput = z.output<typeof formSchema>;

interface BudgetFormModalProps {
  open: boolean;
  onClose: () => void;
  ano: number;
  mes: number;
  budget?: Orcamento;
}

export function BudgetFormModal({ open, onClose, ano, mes, budget }: BudgetFormModalProps) {
  const isEditing = Boolean(budget);
  const createMutation = useCreateBudgetMutation();
  const updateMutation = useUpdateBudgetMutation();
  const mutation = isEditing ? updateMutation : createMutation;
  const { data: categories } = useCategoriesQuery();
  const despesaCategories = (categories ?? []).filter((categoria) => categoria.tipo === 'Despesa');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormInput, unknown, BudgetFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoriaId: budget?.categoriaId ?? '',
      limiteValor: budget?.limiteValor ?? 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        categoriaId: budget?.categoriaId ?? '',
        limiteValor: budget?.limiteValor ?? 0,
      });
    }
  }, [open, budget, reset]);

  if (!open) return null;

  function onSubmit(data: BudgetFormOutput) {
    if (isEditing && budget) {
      updateMutation.mutate({ id: budget.id, request: { limiteValor: data.limiteValor } }, { onSuccess: onClose });
    } else {
      createMutation.mutate(
        { categoriaId: data.categoriaId, ano, mes, limiteValor: data.limiteValor },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar orçamento' : 'Novo orçamento'}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {!isEditing && (
          <Select id="categoriaId" label="Categoria" error={errors.categoriaId?.message} {...register('categoriaId')}>
            <option value="">Selecione</option>
            {despesaCategories.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </Select>
        )}

        <Input
          id="limiteValor"
          type="number"
          step="0.01"
          label="Limite"
          error={errors.limiteValor?.message}
          {...register('limiteValor')}
        />

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

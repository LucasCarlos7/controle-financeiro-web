import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useCreateBudgetMutation, useUpdateBudgetMutation } from '../hooks/useBudgetMutations';
import type { Orcamento } from '../types';
import { useToast } from '../../../shared/hooks/useFeedback';
import { Modal, ModalActions } from '../../../shared/components/ui/Modal';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { formatMonthYear } from '../../../shared/utils/format';

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
  const formId = useId();
  const toast = useToast();
  const createMutation = useCreateBudgetMutation();
  const updateMutation = useUpdateBudgetMutation();
  const mutation = isEditing ? updateMutation : createMutation;
  const { data: categories } = useCategoriesQuery();
  const despesaCategories = (categories ?? []).filter((categoria) => categoria.tipo === 'Despesa');
  const categoriaNome = categories?.find((categoria) => categoria.id === budget?.categoriaId)?.nome;

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
    const done = (message: string) => () => {
      toast(message);
      onClose();
    };
    if (isEditing && budget) {
      updateMutation.mutate(
        { id: budget.id, request: { limiteValor: data.limiteValor } },
        { onSuccess: done('Orçamento atualizado') },
      );
    } else {
      createMutation.mutate(
        { categoriaId: data.categoriaId, ano, mes, limiteValor: data.limiteValor },
        { onSuccess: done('Orçamento criado') },
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar orçamento' : 'Novo orçamento'}
      description={
        isEditing
          ? `${categoriaNome ?? 'Categoria'} · ${formatMonthYear(ano, mes)}`
          : `Limite de gasto para ${formatMonthYear(ano, mes).toLowerCase()}`
      }
      footer={<ModalActions onCancel={onClose} formId={formId} pending={mutation.isPending} />}
    >
      <form id={formId} className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {!isEditing && (
          <Select
            id="categoriaId"
            label="Categoria"
            hint="Só categorias de despesa."
            error={errors.categoriaId?.message}
            {...register('categoriaId')}
          >
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
          inputMode="decimal"
          prefix="R$"
          label="Limite"
          className="tabular-nums"
          error={errors.limiteValor?.message}
          onFocus={(event) => event.target.select()}
          {...register('limiteValor')}
        />

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

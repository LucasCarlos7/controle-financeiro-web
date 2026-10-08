import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useCreateBudgetMutation, useUpdateBudgetMutation } from '../hooks/useBudgetMutations';
import type { Orcamento } from '../types';
import { useToast } from '../../../shared/hooks/useFeedback';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { AmountInput, FormSection } from '../../../shared/components/ui/FormRows';
import { SelectRowField } from '../../../shared/components/ui/SelectRowField';
import { FormError } from '../../../shared/components/ui/FormError';
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
    control,
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
      variant="sheet"
      title={isEditing ? 'Editar orçamento' : 'Novo orçamento'}
      description={
        isEditing
          ? `${categoriaNome ?? 'Categoria'} · ${formatMonthYear(ano, mes)}`
          : `Limite de gasto para ${formatMonthYear(ano, mes).toLowerCase()}`
      }
      footer={
        <Button type="submit" form={formId} loading={mutation.isPending} className="h-12 w-full text-lg">
          {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar orçamento'}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <AmountInput id="limiteValor" label="Limite do mês" error={errors.limiteValor?.message} {...register('limiteValor')} />
        {!isEditing && (
          <FormSection label="Classificação" hint="Só categorias de despesa.">
            <SelectRowField
              control={control}
              name="categoriaId"
              icon="tag"
              label="Categoria"
              pickerTitle="Qual é a categoria?"
              options={despesaCategories.map((categoria) => ({
                value: categoria.id,
                label: categoria.nome,
                color: categoria.cor,
              }))}
              required
              error={errors.categoriaId?.message}
            />
          </FormSection>
        )}

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '../../../shared/hooks/useFeedback';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../hooks/useCategoryMutations';
import type { Categoria, TipoCategoria } from '../types';
import { Modal, ModalActions } from '../../../shared/components/ui/Modal';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { SegmentedControl } from '../../../shared/components/ui/SegmentedControl';

const formSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  tipo: z.enum(['Receita', 'Despesa']),
  icone: z.string().optional(),
  cor: z.string().optional(),
});

type CategoryFormData = z.infer<typeof formSchema>;

const TIPOS: { value: TipoCategoria; label: string }[] = [
  { value: 'Despesa', label: 'Despesa' },
  { value: 'Receita', label: 'Receita' },
];

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  category?: Categoria;
}

export function CategoryFormModal({ open, onClose, category }: CategoryFormModalProps) {
  const isEditing = Boolean(category);
  const formId = useId();
  const toast = useToast();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', tipo: 'Despesa', icone: '', cor: '#64748b' },
  });

  useEffect(() => {
    if (open) {
      reset({
        nome: category?.nome ?? '',
        tipo: category?.tipo ?? 'Despesa',
        icone: category?.icone ?? '',
        cor: category?.cor ?? '#64748b',
      });
    }
  }, [open, category, reset]);

  function onSubmit(data: CategoryFormData) {
    const done = (message: string) => () => {
      toast(message);
      onClose();
    };
    if (isEditing && category) {
      updateMutation.mutate(
        { id: category.id, request: { nome: data.nome, icone: data.icone || null, cor: data.cor || null } },
        { onSuccess: done('Categoria atualizada') },
      );
    } else {
      createMutation.mutate(
        { nome: data.nome, tipo: data.tipo, icone: data.icone || null, cor: data.cor || null },
        { onSuccess: done('Categoria criada') },
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar categoria' : 'Nova categoria'}
      description={isEditing ? 'O tipo da categoria não pode ser alterado.' : undefined}
      footer={<ModalActions onCancel={onClose} formId={formId} pending={mutation.isPending} />}
    >
      <form id={formId} className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {!isEditing && (
          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <SegmentedControl label="Tipo" showLabel options={TIPOS} value={field.value} onChange={field.onChange} />
            )}
          />
        )}

        <Input id="nome" label="Nome" placeholder="Ex.: Mercado" error={errors.nome?.message} {...register('nome')} />

        <div className="grid grid-cols-[auto_1fr] gap-4">
          <div>
            <label htmlFor="cor" className="mb-1.5 block text-sm font-medium text-text">
              Cor
            </label>
            <input
              id="cor"
              type="color"
              className="block h-11 w-16 cursor-pointer rounded-control border border-border-strong bg-surface p-1 shadow-card sm:h-10"
              {...register('cor')}
            />
          </div>
          <Input
            id="icone"
            label="Ícone"
            hint="Opcional. Nome do ícone, ex.: shopping-cart."
            placeholder="shopping-cart"
            {...register('icone')}
          />
        </div>

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

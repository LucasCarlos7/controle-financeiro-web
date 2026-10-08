import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '../../../shared/hooks/useFeedback';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../hooks/useCategoryMutations';
import type { Categoria, TipoCategoria } from '../types';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { FormSection, TextRow } from '../../../shared/components/ui/FormRows';
import { FormError } from '../../../shared/components/ui/FormError';
import { SegmentedControl } from '../../../shared/components/ui/SegmentedControl';

const formSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  tipo: z.enum(['Receita', 'Despesa']),
  icone: z.string().optional(),
  cor: z.string().optional(),
});

type CategoryFormData = z.infer<typeof formSchema>;

const TIPOS: { value: TipoCategoria; label: string; tone: 'danger' | 'success' }[] = [
  { value: 'Despesa', label: 'Despesa', tone: 'danger' },
  { value: 'Receita', label: 'Receita', tone: 'success' },
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
    watch,
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
      variant="sheet"
      title={isEditing ? 'Editar categoria' : 'Nova categoria'}
      description={isEditing ? 'O tipo da categoria não pode ser alterado.' : undefined}
      footer={
        <Button type="submit" form={formId} loading={mutation.isPending} className="h-12 w-full text-lg">
          {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar categoria'}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        {!isEditing && (
          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <SegmentedControl label="Tipo" options={TIPOS} value={field.value} onChange={field.onChange} className="mb-5" />
            )}
          />
        )}

        <FormSection label="Categoria">
          <TextRow
            id="nome"
            icon="tag"
            label="Nome"
            placeholder="Ex.: Mercado"
            required
            error={errors.nome?.message}
            {...register('nome')}
          />
          <label htmlFor="cor" className="flex min-h-14 cursor-pointer items-center gap-3 px-3 py-2 hover:bg-surface-hover">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-surface-sunken ring-1 ring-border"
            >
              <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: watch('cor') }} />
            </span>
            <span className="text-base font-medium text-text">Cor</span>
            <input
              id="cor"
              type="color"
              className="ml-auto h-8 w-12 cursor-pointer rounded-control border border-border-strong bg-transparent p-0.5"
              {...register('cor')}
            />
          </label>
          <TextRow id="icone" icon="text" label="Ícone" placeholder="shopping-cart" {...register('icone')} />
        </FormSection>

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

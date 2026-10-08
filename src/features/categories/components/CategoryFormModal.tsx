import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Modal } from '../../../shared/components/Modal';
import { ApiError } from '../../../shared/types/api';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../hooks/useCategoryMutations';
import type { Categoria } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Icon } from '../../../shared/components/icons';

const formSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  tipo: z.enum(['Receita', 'Despesa']),
  icone: z.string().optional(),
  cor: z.string().optional(),
});

type CategoryFormData = z.infer<typeof formSchema>;

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  category?: Categoria;
}

export function CategoryFormModal({ open, onClose, category }: CategoryFormModalProps) {
  const isEditing = Boolean(category);
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
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
    if (isEditing && category) {
      updateMutation.mutate(
        { id: category.id, request: { nome: data.nome, icone: data.icone || null, cor: data.cor || null } },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        { nome: data.nome, tipo: data.tipo, icone: data.icone || null, cor: data.cor || null },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar categoria' : 'Nova categoria'}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="nome" label="Nome" error={errors.nome?.message} {...register('nome')} />

        {!isEditing && (
          <Select id="tipo" label="Tipo" {...register('tipo')}>
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </Select>
        )}

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="cor" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Cor
            </label>
            <input
              id="cor"
              type="color"
              className="h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
              {...register('cor')}
            />
          </div>
          <div className="flex-1">
            <Input id="icone" label="Ícone (opcional)" placeholder="ex: shopping-cart" {...register('icone')} />
          </div>
        </div>

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

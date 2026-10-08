import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '../../../shared/hooks/useFeedback';
import { useCreateTagMutation, useUpdateTagMutation } from '../hooks/useTagMutations';
import type { Tag } from '../types';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { FormSection, TextRow } from '../../../shared/components/ui/FormRows';
import { FormError } from '../../../shared/components/ui/FormError';
import { IconPickerField } from '../../../shared/components/ui/IconPicker';

const formSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome').max(50, 'Até 50 caracteres'),
  icone: z.string().optional(),
});

type TagFormData = z.infer<typeof formSchema>;

interface TagFormModalProps {
  open: boolean;
  onClose: () => void;
  tag?: Tag;
}

export function TagFormModal({ open, onClose, tag }: TagFormModalProps) {
  const isEditing = Boolean(tag);
  const formId = useId();
  const toast = useToast();
  const createMutation = useCreateTagMutation();
  const updateMutation = useUpdateTagMutation();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', icone: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ nome: tag?.nome ?? '', icone: tag?.icone ?? '' });
    }
  }, [open, tag, reset]);

  function onSubmit(data: TagFormData) {
    const request = { nome: data.nome, icone: data.icone || null };
    const done = (message: string) => () => {
      toast(message);
      onClose();
    };
    if (isEditing && tag) {
      updateMutation.mutate({ id: tag.id, request }, { onSuccess: done('Tag atualizada') });
    } else {
      createMutation.mutate(request, { onSuccess: done('Tag criada') });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="sheet"
      title={isEditing ? 'Editar tag' : 'Nova tag'}
      description="Tags marcam lançamentos de receita e despesa com contexto extra."
      footer={
        <Button type="submit" form={formId} loading={mutation.isPending} className="h-12 w-full text-lg">
          {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar tag'}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormSection label="Tag">
          <TextRow
            id="tagNome"
            icon="text"
            label="Nome"
            placeholder="Ex.: viagem"
            required
            maxLength={50}
            error={errors.nome?.message}
            {...register('nome')}
          />
          <IconPickerField control={control} name="icone" fallback="tag" />
        </FormSection>

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

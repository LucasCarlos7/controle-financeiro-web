import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Modal } from '../../../shared/components/ui/Modal';
import { ApiError } from '../../../shared/types/api';
import { useCreateCardMutation, useUpdateCardMutation } from '../hooks/useCardMutations';
import { useAccountsQuery } from '../hooks/useAccountsQuery';
import type { CartaoCredito } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Icon } from '../../../shared/components/icons';

const formSchema = z.object({
  nome: z.string().min(1, 'Informe o nome'),
  limite: z.coerce.number().positive('Informe um limite válido'),
  diaFechamento: z.coerce.number().int().min(1, 'Entre 1 e 31').max(31, 'Entre 1 e 31'),
  diaVencimento: z.coerce.number().int().min(1, 'Entre 1 e 31').max(31, 'Entre 1 e 31'),
  contaPagamentoId: z.string().optional(),
});

type CardFormInput = z.input<typeof formSchema>;
type CardFormOutput = z.output<typeof formSchema>;

interface CardFormModalProps {
  open: boolean;
  onClose: () => void;
  card?: CartaoCredito;
}

export function CardFormModal({ open, onClose, card }: CardFormModalProps) {
  const isEditing = Boolean(card);
  const createMutation = useCreateCardMutation();
  const updateMutation = useUpdateCardMutation();
  const mutation = isEditing ? updateMutation : createMutation;
  const { data: accounts } = useAccountsQuery(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormInput, unknown, CardFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', limite: 0, diaFechamento: 1, diaVencimento: 10, contaPagamentoId: '' },
  });

  useEffect(() => {
    if (open) {
      reset({
        nome: card?.nome ?? '',
        limite: card?.limite ?? 0,
        diaFechamento: card?.diaFechamento ?? 1,
        diaVencimento: card?.diaVencimento ?? 10,
        contaPagamentoId: card?.contaPagamentoId ?? '',
      });
    }
  }, [open, card, reset]);

  if (!open) return null;

  function onSubmit(data: CardFormOutput) {
    const request = {
      nome: data.nome,
      limite: data.limite,
      diaFechamento: data.diaFechamento,
      diaVencimento: data.diaVencimento,
      contaPagamentoId: data.contaPagamentoId || null,
    };

    if (isEditing && card) {
      updateMutation.mutate({ id: card.id, request }, { onSuccess: onClose });
    } else {
      createMutation.mutate(request, { onSuccess: onClose });
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar cartão de crédito' : 'Novo cartão de crédito'}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="cardNome" label="Nome" error={errors.nome?.message} {...register('nome')} />

        <Input
          id="limite"
          type="number"
          step="0.01"
          label="Limite"
          error={errors.limite?.message}
          {...register('limite')}
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="diaFechamento"
              type="number"
              min={1}
              max={31}
              label="Dia de fechamento"
              error={errors.diaFechamento?.message}
              {...register('diaFechamento')}
            />
          </div>
          <div className="flex-1">
            <Input
              id="diaVencimento"
              type="number"
              min={1}
              max={31}
              label="Dia de vencimento"
              error={errors.diaVencimento?.message}
              {...register('diaVencimento')}
            />
          </div>
        </div>

        <Select id="contaPagamentoId" label="Conta de pagamento (opcional)" {...register('contaPagamentoId')}>
          <option value="">Nenhuma</option>
          {(accounts ?? []).map((conta) => (
            <option key={conta.id} value={conta.id}>
              {conta.nome}
            </option>
          ))}
        </Select>

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

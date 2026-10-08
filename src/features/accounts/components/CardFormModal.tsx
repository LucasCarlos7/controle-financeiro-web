import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateCardMutation, useUpdateCardMutation } from '../hooks/useCardMutations';
import { useAccountsQuery } from '../hooks/useAccountsQuery';
import type { CartaoCredito } from '../types';
import { useToast } from '../../../shared/hooks/useFeedback';
import { Modal, ModalActions } from '../../../shared/components/ui/Modal';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';

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
  const formId = useId();
  const toast = useToast();
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
    const done = (message: string) => () => {
      toast(message);
      onClose();
    };

    if (isEditing && card) {
      updateMutation.mutate({ id: card.id, request }, { onSuccess: done('Cartão atualizado') });
    } else {
      createMutation.mutate(request, { onSuccess: done('Cartão criado') });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar cartão de crédito' : 'Novo cartão de crédito'}
      footer={<ModalActions onCancel={onClose} formId={formId} pending={mutation.isPending} />}
    >
      <form id={formId} className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="cardNome" label="Nome" placeholder="Ex.: Nubank" error={errors.nome?.message} {...register('nome')} />

        <Input
          id="limite"
          type="number"
          step="0.01"
          inputMode="decimal"
          prefix="R$"
          label="Limite"
          className="tabular-nums"
          error={errors.limite?.message}
          onFocus={(event) => event.target.select()}
          {...register('limite')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="diaFechamento"
            type="number"
            inputMode="numeric"
            min={1}
            max={31}
            label="Dia de fechamento"
            error={errors.diaFechamento?.message}
            {...register('diaFechamento')}
          />
          <Input
            id="diaVencimento"
            type="number"
            inputMode="numeric"
            min={1}
            max={31}
            label="Dia de vencimento"
            error={errors.diaVencimento?.message}
            {...register('diaVencimento')}
          />
        </div>

        <Select
          id="contaPagamentoId"
          label="Conta de pagamento"
          hint="Opcional. Conta de onde a fatura costuma ser paga."
          {...register('contaPagamentoId')}
        >
          <option value="">Nenhuma</option>
          {(accounts ?? []).map((conta) => (
            <option key={conta.id} value={conta.id}>
              {conta.nome}
            </option>
          ))}
        </Select>

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

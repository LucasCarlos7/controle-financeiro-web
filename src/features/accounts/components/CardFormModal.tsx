import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateCardMutation, useUpdateCardMutation } from '../hooks/useCardMutations';
import { useAccountsQuery } from '../hooks/useAccountsQuery';
import type { CartaoCredito } from '../types';
import { useToast } from '../../../shared/hooks/useFeedback';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { FormSection, TextRow } from '../../../shared/components/ui/FormRows';
import { SelectRowField } from '../../../shared/components/ui/SelectRowField';
import { MoneyRowField } from '../../../shared/components/ui/MoneyFields';
import { FormError } from '../../../shared/components/ui/FormError';

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
    control,
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
      variant="sheet"
      title={isEditing ? 'Editar cartão' : 'Novo cartão de crédito'}
      footer={
        <Button type="submit" form={formId} loading={mutation.isPending} className="h-12 w-full text-lg">
          {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar cartão'}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormSection label="Cartão">
          <TextRow
            id="cardNome"
            icon="card"
            label="Apelido do cartão"
            placeholder="Ex.: Nubank"
            required
            error={errors.nome?.message}
            {...register('nome')}
          />
          <MoneyRowField
            control={control}
            name="limite"
            id="limite"
            icon="wallet"
            label="Limite"
            required
            error={errors.limite?.message}
          />
        </FormSection>

        <FormSection label="Fatura">
          <TextRow
            id="diaFechamento"
            icon="calendar"
            label="Dia de fechamento"
            type="number"
            inputMode="numeric"
            min={1}
            max={31}
            required
            error={errors.diaFechamento?.message}
            {...register('diaFechamento')}
          />
          <TextRow
            id="diaVencimento"
            icon="calendar"
            label="Dia de vencimento"
            type="number"
            inputMode="numeric"
            min={1}
            max={31}
            required
            error={errors.diaVencimento?.message}
            {...register('diaVencimento')}
          />
          <SelectRowField
            control={control}
            name="contaPagamentoId"
            icon="bank"
            label="Conta de pagamento"
            pickerTitle="De qual conta a fatura é paga?"
            placeholder="Nenhuma"
            options={[
              { value: '', label: 'Nenhuma' },
              ...(accounts ?? []).map((conta) => ({ value: conta.id, label: conta.nome })),
            ]}
          />
        </FormSection>

        <FormError error={mutation.error} />
      </form>
    </Modal>
  );
}

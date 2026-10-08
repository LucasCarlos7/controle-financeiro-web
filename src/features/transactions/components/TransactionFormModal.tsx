import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal, ModalActions } from '../../../shared/components/ui/Modal';
import { FormError } from '../../../shared/components/ui/FormError';
import { Input } from '../../../shared/components/ui/Input';
import { useToast } from '../../../shared/hooks/useFeedback';
import { todayApiDate } from '../../../shared/utils/format';
import {
  useCreateRecurringTransactionMutation,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from '../hooks/useTransactionMutations';
import type { Transacao } from '../types';
import {
  createTransactionFormSchema,
  resolverOrigem,
  type TransactionFormInput,
  type TransactionFormOutput,
} from '../transactionFormSchema';
import { TransactionTypeField } from './form/TransactionTypeField';
import { PaymentSourceFields } from './form/PaymentSourceFields';
import { CategoryFields } from './form/CategoryFields';
import { TagsField } from './form/TagsField';
import { StatusField } from './form/StatusField';
import { RecurrenceFields } from './form/RecurrenceFields';

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transacao;
}

export function TransactionFormModal({ open, onClose, transaction }: TransactionFormModalProps) {
  const isEditing = Boolean(transaction);
  const formId = useId();
  const toast = useToast();
  const createMutation = useCreateTransactionMutation();
  const createRecurringMutation = useCreateRecurringTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();

  const formSchema = useMemo(() => createTransactionFormSchema(isEditing), [isEditing]);

  const form = useForm<TransactionFormInput, unknown, TransactionFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: 'Despesa',
      valor: 0,
      data: todayApiDate(),
      descricao: '',
      formaPagamento: 'conta',
      contaId: '',
      cartaoCreditoId: '',
      contaDestinoId: '',
      categoriaId: '',
      subcategoriaId: '',
      status: 'Pago',
      tagIds: [],
      recorrente: false,
      tipoRecorrencia: 'Mensal',
      intervaloMeses: 1,
      totalParcelas: undefined,
      dataFim: '',
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        tipo: transaction?.tipo ?? 'Despesa',
        valor: transaction?.valor ?? 0,
        data: transaction?.data ?? todayApiDate(),
        descricao: transaction?.descricao ?? '',
        formaPagamento: transaction?.cartaoCreditoId ? 'cartao' : 'conta',
        contaId: transaction?.contaId ?? '',
        cartaoCreditoId: transaction?.cartaoCreditoId ?? '',
        contaDestinoId: transaction?.contaDestinoId ?? '',
        categoriaId: transaction?.categoriaId ?? '',
        subcategoriaId: transaction?.subcategoriaId ?? '',
        status: transaction?.status ?? 'Pago',
        tagIds: transaction?.tagIds ?? [],
        recorrente: false,
        tipoRecorrencia: 'Mensal',
        intervaloMeses: 1,
        totalParcelas: undefined,
        dataFim: '',
      });
    }
  }, [open, transaction, reset]);

  const tipo = watch('tipo');
  const recorrente = watch('recorrente');
  const isTransferencia = tipo === 'Transferencia';

  if (!open) return null;

  function closeWith(message: string) {
    return () => {
      toast(message);
      onClose();
    };
  }

  function onSubmit(data: TransactionFormOutput) {
    if (isEditing && transaction) {
      updateMutation.mutate(
        {
          id: transaction.id,
          request: {
            valor: data.valor,
            data: data.data,
            descricao: data.descricao,
            categoriaId: data.categoriaId || null,
            subcategoriaId: data.subcategoriaId || null,
            tagIds: data.tagIds ?? [],
          },
        },
        { onSuccess: closeWith('Lançamento atualizado') },
      );
      return;
    }

    const { contaId, cartaoCreditoId, contaDestinoId } = resolverOrigem(data);
    const categoriaId = data.tipo === 'Transferencia' ? null : data.categoriaId || null;
    const subcategoriaId = data.tipo === 'Transferencia' ? null : data.subcategoriaId || null;
    const tagIds = data.tipo === 'Transferencia' ? [] : (data.tagIds ?? []);

    if (data.recorrente && data.tipoRecorrencia) {
      createRecurringMutation.mutate(
        {
          tipo: data.tipo,
          valor: data.valor,
          dataInicio: data.data,
          descricao: data.descricao,
          contaId,
          cartaoCreditoId,
          contaDestinoId,
          categoriaId,
          subcategoriaId,
          tagIds,
          tipoRecorrencia: data.tipoRecorrencia,
          intervaloMeses: data.intervaloMeses || null,
          totalParcelas: data.tipoRecorrencia === 'Parcelada' ? data.totalParcelas || null : null,
          dataFim: data.tipoRecorrencia === 'Parcelada' ? null : data.dataFim || null,
        },
        { onSuccess: closeWith('Lançamentos recorrentes criados') },
      );
      return;
    }

    createMutation.mutate(
      {
        tipo: data.tipo,
        valor: data.valor,
        data: data.data,
        descricao: data.descricao,
        contaId,
        cartaoCreditoId,
        contaDestinoId,
        categoriaId,
        subcategoriaId,
        status: data.status,
        tagIds,
      },
      { onSuccess: closeWith('Lançamento criado') },
    );
  }

  const mutation = isEditing ? updateMutation : recorrente ? createRecurringMutation : createMutation;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={isEditing ? 'Editar lançamento' : 'Novo lançamento'}
      description={isEditing ? 'Tipo, origem e recorrência não podem ser alterados.' : undefined}
      footer={<ModalActions onCancel={onClose} formId={formId} pending={mutation.isPending} />}
    >
      <FormProvider {...form}>
        <form id={formId} className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {!isEditing && <TransactionTypeField />}

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="valor"
              type="number"
              step="0.01"
              inputMode="decimal"
              prefix="R$"
              label="Valor"
              className="tabular-nums"
              error={errors.valor?.message}
              onFocus={(event) => event.target.select()}
              {...register('valor')}
            />
            <Input id="data" type="date" label="Data" error={errors.data?.message} {...register('data')} />
          </div>

          <Input id="descricao" label="Descrição" error={errors.descricao?.message} {...register('descricao')} />

          {!isEditing && <PaymentSourceFields />}

          {!isTransferencia && (
            <>
              <CategoryFields />
              <TagsField />
            </>
          )}

          {!isEditing && !recorrente && <StatusField />}

          {!isEditing && <RecurrenceFields />}

          <FormError error={mutation.error} />
        </form>
      </FormProvider>
    </Modal>
  );
}

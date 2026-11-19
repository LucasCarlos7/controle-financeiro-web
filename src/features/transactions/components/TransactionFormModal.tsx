import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { FormSection, TextRow } from '../../../shared/components/ui/FormRows';
import { AmountInputField } from '../../../shared/components/ui/MoneyFields';
import { FormError } from '../../../shared/components/ui/FormError';
import { useToast } from '../../../shared/hooks/useFeedback';
import { todayApiDate } from '../../../shared/utils/format';
import {
  useCreateRecurringTransactionMutation,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from '../hooks/useTransactionMutations';
import type { EscopoEdicaoRecorrencia, Transacao } from '../types';
import {
  createTransactionFormSchema,
  resolverOrigem,
  type TransactionFormInput,
  type TransactionFormOutput,
} from '../transactionFormSchema';
import { TransactionTypeField } from './form/TransactionTypeField';
import { PaymentSection } from './form/PaymentSection';
import { ClassificationSection } from './form/ClassificationSection';
import { RecurrenceSection } from './form/RecurrenceSection';
import { EditScopeModal } from './EditScopeModal';

const SUBMIT_LABELS = {
  Despesa: 'Registrar despesa',
  Receita: 'Registrar receita',
  Transferencia: 'Registrar transferência',
} as const;

const AMOUNT_TONES = {
  Despesa: 'expense',
  Receita: 'income',
  Transferencia: 'neutral',
} as const;

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transacao;
}

export function TransactionFormModal({ open, onClose, transaction }: TransactionFormModalProps) {
  const isEditing = Boolean(transaction);
  const isRecorrente = isEditing && Boolean(transaction?.recorrenciaId);
  const formId = useId();
  const toast = useToast();
  const createMutation = useCreateTransactionMutation();
  const createRecurringMutation = useCreateRecurringTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();

  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const pendingPayload = useRef<Parameters<typeof updateMutation.mutate>[0] | null>(null);

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
    control,
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
        status: transaction?.status === 'Recebido' ? 'Pago' : transaction?.status === 'Cancelado' ? 'Pendente' : (transaction?.status ?? 'Pago'),
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

  function handleScopeConfirm(escopo: EscopoEdicaoRecorrencia) {
    if (!pendingPayload.current) return;
    const payload = {
      ...pendingPayload.current,
      request: { ...pendingPayload.current.request, escopoEdicao: escopo },
    };
    updateMutation.mutate(payload, {
      onSuccess: () => {
        setScopeModalOpen(false);
        pendingPayload.current = null;
        closeWith('Lançamento atualizado')();
      },
    });
  }

  function onSubmit(data: TransactionFormOutput) {
    if (isEditing && transaction) {
      const basePayload = {
        id: transaction.id,
        request: {
          valor: data.valor,
          data: data.data,
          descricao: data.descricao,
          categoriaId: data.categoriaId || null,
          subcategoriaId: data.subcategoriaId || null,
          tagIds: data.tagIds ?? [],
        },
      };

      if (isRecorrente) {
        pendingPayload.current = basePayload;
        setScopeModalOpen(true);
        return;
      }

      updateMutation.mutate(basePayload, { onSuccess: closeWith('Lançamento atualizado') });
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
    <>
    <EditScopeModal
      open={scopeModalOpen}
      pending={updateMutation.isPending}
      transactionDate={transaction?.data}
      onConfirm={handleScopeConfirm}
      onClose={() => setScopeModalOpen(false)}
    />
    <Modal
      open={open}
      onClose={onClose}
      variant="sheet"
      title={isEditing ? 'Editar lançamento' : 'Novo lançamento'}
      description={isEditing ? 'Tipo, origem e recorrência não podem ser alterados.' : undefined}
      footer={
        <Button type="submit" form={formId} loading={mutation.isPending} className="h-12 w-full text-lg sm:h-12">
          {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : SUBMIT_LABELS[tipo]}
        </Button>
      }
    >
      <FormProvider {...form}>
        <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
          {!isEditing && <TransactionTypeField />}

          <AmountInputField
            control={control}
            name="valor"
            id="valor"
            tone={AMOUNT_TONES[tipo]}
            error={errors.valor?.message}
          />

          <FormSection label="Detalhes">
            <TextRow
              id="descricao"
              icon="text"
              label="Descrição"
              placeholder="Ex.: Mercado"
              required
              error={errors.descricao?.message}
              {...register('descricao')}
            />
            <TextRow id="data" icon="calendar" label="Data" type="date" required error={errors.data?.message} {...register('data')} />
          </FormSection>

          {!isEditing && <PaymentSection showStatus={!recorrente} />}

          {!isTransferencia && <ClassificationSection />}

          {!isEditing && <RecurrenceSection />}

          <FormError error={mutation.error} />
        </form>
      </FormProvider>
    </Modal>
    </>
  );
}

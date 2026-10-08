import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from '../../../shared/components/Modal';
import { ApiError } from '../../../shared/types/api';
import { todayApiDate } from '../../../shared/utils/format';
import { useAccountsQuery } from '../../accounts/hooks/useAccountsQuery';
import { useCardsQuery } from '../../accounts/hooks/useCardsQuery';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useTagsQuery } from '../../categories/hooks/useTagsQuery';
import {
  useCreateRecurringTransactionMutation,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from '../hooks/useTransactionMutations';
import type { Transacao } from '../types';
import {
  createTransactionFormSchema,
  resolverOrigem,
  type FormaPagamento,
  type TransactionFormInput,
  type TransactionFormOutput,
} from '../transactionFormSchema';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Icon } from '../../../shared/components/icons';

const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: 'conta', label: 'Conta' },
  { value: 'cartao', label: 'Cartão de crédito' },
];

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transacao;
}

export function TransactionFormModal({ open, onClose, transaction }: TransactionFormModalProps) {
  const isEditing = Boolean(transaction);
  const createMutation = useCreateTransactionMutation();
  const createRecurringMutation = useCreateRecurringTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();

  const { data: accounts } = useAccountsQuery(true);
  const { data: cards } = useCardsQuery(true);
  const { data: categories } = useCategoriesQuery();
  const { data: tags } = useTagsQuery();

  const formSchema = useMemo(() => createTransactionFormSchema(isEditing), [isEditing]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormInput, unknown, TransactionFormOutput>({
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
  const categoriaId = watch('categoriaId');
  const recorrente = watch('recorrente');
  const tipoRecorrencia = watch('tipoRecorrencia');
  const formaPagamento = watch('formaPagamento');
  const isTransferencia = tipo === 'Transferencia';
  const pagaComCartao = tipo === 'Despesa' && formaPagamento === 'cartao';

  const categoriasDoTipo = useMemo(
    () => (categories ?? []).filter((categoria) => categoria.tipo === tipo),
    [categories, tipo],
  );
  const subcategorias = useMemo(
    () => categoriasDoTipo.find((categoria) => categoria.id === categoriaId)?.subcategorias ?? [],
    [categoriasDoTipo, categoriaId],
  );

  if (!open) return null;

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
        { onSuccess: onClose },
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
        { onSuccess: onClose },
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
      { onSuccess: onClose },
    );
  }

  const mutation = isEditing ? updateMutation : recorrente ? createRecurringMutation : createMutation;

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Editar lançamento' : 'Novo lançamento'}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {!isEditing && (
          <Select id="tipo" label="Tipo" {...register('tipo')}>
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
            <option value="Transferencia">Transferência</option>
          </Select>
        )}

        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="valor"
              type="number"
              step="0.01"
              label="Valor"
              error={errors.valor?.message}
              {...register('valor')}
            />
          </div>
          <div className="flex-1">
            <Input id="data" type="date" label="Data" error={errors.data?.message} {...register('data')} />
          </div>
        </div>

        <Input id="descricao" label="Descrição" error={errors.descricao?.message} {...register('descricao')} />

        {!isEditing && (
          <>
            {tipo === 'Despesa' && (
              <div>
                <p className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Pagar com</p>
                <Controller
                  control={control}
                  name="formaPagamento"
                  render={({ field }) => (
                    <div
                      role="radiogroup"
                      aria-label="Pagar com"
                      className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
                    >
                      {FORMAS_PAGAMENTO.map((opcao) => {
                        const selected = field.value === opcao.value;
                        return (
                          <button
                            key={opcao.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                              field.onChange(opcao.value);
                              // Compra no cartão normalmente ainda não foi paga: Pendente ocupa o limite até a fatura.
                              setValue('status', opcao.value === 'cartao' ? 'Pendente' : 'Pago');
                            }}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                              selected
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                          >
                            {opcao.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            )}

            {pagaComCartao ? (
              <Select
                id="cartaoCreditoId"
                label="Cartão de crédito"
                error={errors.cartaoCreditoId?.message}
                {...register('cartaoCreditoId')}
              >
                <option value="">Selecione</option>
                {(cards ?? []).map((cartao) => (
                  <option key={cartao.id} value={cartao.id}>
                    {cartao.nome}
                  </option>
                ))}
              </Select>
            ) : (
              <Select
                id="contaId"
                label={isTransferencia ? 'Conta de origem' : 'Conta'}
                error={errors.contaId?.message}
                {...register('contaId')}
              >
                <option value="">Selecione</option>
                {(accounts ?? []).map((conta) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome}
                  </option>
                ))}
              </Select>
            )}

            {isTransferencia && (
              <Select
                id="contaDestinoId"
                label="Conta de destino"
                error={errors.contaDestinoId?.message}
                {...register('contaDestinoId')}
              >
                <option value="">Selecione</option>
                {(accounts ?? []).map((conta) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome}
                  </option>
                ))}
              </Select>
            )}
          </>
        )}

        {!isTransferencia && (
          <>
            <div className="flex gap-4">
              <div className="flex-1">
                <Select id="categoriaId" label="Categoria" {...register('categoriaId')}>
                  <option value="">Nenhuma</option>
                  {categoriasDoTipo.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </Select>
              </div>
              {subcategorias.length > 0 && (
                <div className="flex-1">
                  <Select id="subcategoriaId" label="Subcategoria" {...register('subcategoriaId')}>
                    <option value="">Nenhuma</option>
                    {subcategorias.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nome}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>

            <div>
              <p className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tags</p>
              <Controller
                control={control}
                name="tagIds"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {(tags ?? []).map((tag) => {
                      const selected = (field.value ?? []).includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const current = field.value ?? [];
                            field.onChange(
                              selected ? current.filter((id) => id !== tag.id) : [...current, tag.id],
                            );
                          }}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            selected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                          }`}
                        >
                          {tag.nome}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          </>
        )}

        {!isEditing && !recorrente && (
          <div>
            <Select id="status" label="Status" {...register('status')}>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
            </Select>
            {pagaComCartao && (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                No cartão, a compra pendente ocupa o limite. Marque como paga quando a fatura for paga.
              </p>
            )}
          </div>
        )}

        {!isEditing && (
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                {...register('recorrente')}
              />
              Repetir ou parcelar este lançamento
            </label>

            {recorrente && (
              <div className="mt-3 space-y-3">
                <Select
                  id="tipoRecorrencia"
                  label="Periodicidade"
                  error={errors.tipoRecorrencia?.message}
                  {...register('tipoRecorrencia')}
                >
                  <option value="Mensal">Mensal (sem data fim, até 24 lançamentos)</option>
                  <option value="Fixa">Recorrente com intervalo customizado</option>
                  <option value="Parcelada">Parcelada</option>
                </Select>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      id="intervaloMeses"
                      type="number"
                      min={1}
                      max={12}
                      label="Intervalo (meses)"
                      error={errors.intervaloMeses?.message}
                      {...register('intervaloMeses')}
                    />
                  </div>

                  {tipoRecorrencia === 'Parcelada' ? (
                    <div className="flex-1">
                      <Input
                        id="totalParcelas"
                        type="number"
                        min={1}
                        max={120}
                        label="Total de parcelas"
                        error={errors.totalParcelas?.message}
                        {...register('totalParcelas')}
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <Input
                        id="dataFim"
                        type="date"
                        label="Repetir até (opcional)"
                        error={errors.dataFim?.message}
                        {...register('dataFim')}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

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

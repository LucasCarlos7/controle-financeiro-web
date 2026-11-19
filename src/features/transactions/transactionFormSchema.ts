import { z } from 'zod';

export type FormaPagamento = 'conta' | 'cartao';

const baseSchema = z.object({
  tipo: z.enum(['Receita', 'Despesa', 'Transferencia']),
  valor: z.coerce.number().positive('Informe um valor válido'),
  data: z.string().min(1, 'Informe a data'),
  descricao: z.string().min(1, 'Informe a descrição'),
  formaPagamento: z.enum(['conta', 'cartao']),
  contaId: z.string().optional(),
  cartaoCreditoId: z.string().optional(),
  contaDestinoId: z.string().optional(),
  categoriaId: z.string().optional(),
  subcategoriaId: z.string().optional(),
  status: z.enum(['Pendente', 'Pago']),
  tagIds: z.array(z.string()).optional(),
  recorrente: z.boolean().optional(),
  tipoRecorrencia: z.enum(['Mensal', 'Fixa', 'Parcelada']).optional(),
  intervaloMeses: z.coerce.number().int().min(1).max(12).optional(),
  totalParcelas: z.coerce.number().int().min(1).max(120).optional(),
});

type BaseFormOutput = z.output<typeof baseSchema>;
type OrigemFields = Pick<BaseFormOutput, 'tipo' | 'formaPagamento' | 'contaId' | 'cartaoCreditoId' | 'contaDestinoId'>;

function usaCartao(data: Pick<OrigemFields, 'tipo' | 'formaPagamento'>): boolean {
  return data.tipo === 'Despesa' && data.formaPagamento === 'cartao';
}

/**
 * Espelha Transacao.ValidarOrigem da API: exatamente uma conta ou um cartão; transferência exige
 * conta de destino diferente da origem. Validar aqui evita o 422 depois do envio.
 */
function validarOrigem(data: OrigemFields, ctx: z.RefinementCtx) {
  if (usaCartao(data)) {
    if (!data.cartaoCreditoId) {
      ctx.addIssue({ code: 'custom', path: ['cartaoCreditoId'], message: 'Selecione o cartão' });
    }
    return;
  }

  const isTransferencia = data.tipo === 'Transferencia';
  if (!data.contaId) {
    ctx.addIssue({
      code: 'custom',
      path: ['contaId'],
      message: isTransferencia ? 'Selecione a conta de origem' : 'Selecione a conta',
    });
  }

  if (!isTransferencia) return;

  if (!data.contaDestinoId) {
    ctx.addIssue({ code: 'custom', path: ['contaDestinoId'], message: 'Selecione a conta de destino' });
  } else if (data.contaDestinoId === data.contaId) {
    ctx.addIssue({
      code: 'custom',
      path: ['contaDestinoId'],
      message: 'A conta de destino deve ser diferente da conta de origem',
    });
  }
}

export function createTransactionFormSchema(isEditing: boolean) {
  return baseSchema.superRefine((data, ctx) => {
    // Na edição a origem não pode ser alterada, então não é validada.
    if (!isEditing) validarOrigem(data, ctx);

    if (!data.recorrente) return;

    if (!data.tipoRecorrencia) {
      ctx.addIssue({ code: 'custom', path: ['tipoRecorrencia'], message: 'Selecione a periodicidade' });
    }

    if (data.tipoRecorrencia === 'Parcelada' && !data.totalParcelas) {
      ctx.addIssue({ code: 'custom', path: ['totalParcelas'], message: 'Informe o total de parcelas' });
    }
  });
}

export type TransactionFormSchema = ReturnType<typeof createTransactionFormSchema>;
export type TransactionFormInput = z.input<TransactionFormSchema>;
export type TransactionFormOutput = z.output<TransactionFormSchema>;

/** Monta a origem enviada à API, descartando os campos que não se aplicam ao tipo e à forma de pagamento. */
export function resolverOrigem(data: OrigemFields) {
  const cartao = usaCartao(data);
  return {
    contaId: cartao ? null : data.contaId || null,
    cartaoCreditoId: cartao ? data.cartaoCreditoId || null : null,
    contaDestinoId: data.tipo === 'Transferencia' ? data.contaDestinoId || null : null,
  };
}

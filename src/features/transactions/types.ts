export type TipoTransacao = 'Receita' | 'Despesa' | 'Transferencia';
export type StatusTransacao = 'Pendente' | 'Pago' | 'Recebido' | 'Cancelado';
export type TipoRecorrencia = 'Mensal' | 'Fixa' | 'Parcelada';

export function isRealizado(status: StatusTransacao): boolean {
  return status === 'Pago' || status === 'Recebido';
}

export function isPendenteParaPrevisao(status: StatusTransacao): boolean {
  return status === 'Pendente';
}

/** Vencido é derivado: Pendente + data anterior a hoje. */
export function isVencido(status: StatusTransacao, data: string): boolean {
  if (status !== 'Pendente') return false;
  const [y, m, d] = data.split('-').map(Number);
  const dataTransacao = new Date(y, m - 1, d);
  const hoje = new Date();
  const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return dataTransacao < inicioDia;
}
export type EscopoEdicaoRecorrencia = 'SomenteEsta' | 'EstaEPosteriores' | 'Todas';

export interface Transacao {
  id: string;
  tipo: TipoTransacao;
  valor: number;
  data: string;
  descricao: string;
  contaId?: string | null;
  cartaoCreditoId?: string | null;
  contaDestinoId?: string | null;
  categoriaId?: string | null;
  subcategoriaId?: string | null;
  status: StatusTransacao;
  recorrenciaId?: string | null;
  tagIds: string[];
}

export interface CreateTransacaoRequest {
  tipo: TipoTransacao;
  valor: number;
  data: string;
  descricao: string;
  contaId?: string | null;
  cartaoCreditoId?: string | null;
  contaDestinoId?: string | null;
  categoriaId?: string | null;
  subcategoriaId?: string | null;
  status?: StatusTransacao;
  tagIds?: string[] | null;
}

export interface CreateTransacaoRecorrenteRequest {
  tipo: TipoTransacao;
  valor: number;
  dataInicio: string;
  descricao: string;
  contaId?: string | null;
  cartaoCreditoId?: string | null;
  contaDestinoId?: string | null;
  categoriaId?: string | null;
  subcategoriaId?: string | null;
  tagIds?: string[] | null;
  tipoRecorrencia: TipoRecorrencia;
  intervaloMeses?: number | null;
  totalParcelas?: number | null;
}

export interface UpdateTransacaoRequest {
  valor: number;
  data: string;
  descricao: string;
  categoriaId?: string | null;
  subcategoriaId?: string | null;
  tagIds?: string[] | null;
  escopoEdicao?: EscopoEdicaoRecorrencia;
}

export interface TransactionFilters {
  dataInicio?: string;
  dataFim?: string;
  contaId?: string;
  cartaoCreditoId?: string;
  categoriaId?: string;
  tagId?: string;
  tipo?: TipoTransacao;
  status?: StatusTransacao;
  apenasRecorrentes?: boolean;
  busca?: string;
}

export type TransactionSortOrder = 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc';

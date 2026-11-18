export type TipoTransacao = 'Receita' | 'Despesa' | 'Transferencia';
export type StatusTransacao = 'Pendente' | 'Pago';
export type TipoRecorrencia = 'Mensal' | 'Fixa' | 'Parcelada';
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
  dataFim?: string | null;
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
  categoriaId?: string;
  tagId?: string;
  tipo?: TipoTransacao;
  status?: StatusTransacao;
  busca?: string;
}

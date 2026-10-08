export type TipoConta = 'Corrente' | 'Poupanca' | 'Carteira';

export interface Conta {
  id: string;
  nome: string;
  tipo: TipoConta;
  saldoInicial: number;
  saldoAtual: number;
  icone?: string | null;
  ativo: boolean;
}

export interface CreateContaRequest {
  nome: string;
  tipo: TipoConta;
  saldoInicial: number;
  icone?: string | null;
}

export interface UpdateContaRequest {
  nome: string;
  icone?: string | null;
}

export interface CartaoCredito {
  id: string;
  nome: string;
  limite: number;
  limiteDisponivel: number;
  diaFechamento: number;
  diaVencimento: number;
  contaPagamentoId?: string | null;
  icone?: string | null;
  ativo: boolean;
}

export interface CreateCartaoCreditoRequest {
  nome: string;
  limite: number;
  diaFechamento: number;
  diaVencimento: number;
  contaPagamentoId?: string | null;
  icone?: string | null;
}

export type UpdateCartaoCreditoRequest = CreateCartaoCreditoRequest;

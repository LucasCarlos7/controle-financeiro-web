export interface Orcamento {
  id: string;
  categoriaId: string;
  ano: number;
  mes: number;
  limiteValor: number;
  valorConsumido: number;
  /** Parte de valorConsumido ainda pendente (o painel só conta despesas pagas). */
  valorPendente: number;
  percentualConsumido: number;
  estourado: boolean;
}

export interface CreateOrcamentoRequest {
  categoriaId: string;
  ano: number;
  mes: number;
  limiteValor: number;
}

export interface UpdateOrcamentoRequest {
  limiteValor: number;
}

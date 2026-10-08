export interface Aporte {
  id: string;
  valor: number;
  data: string;
}

export interface Objetivo {
  id: string;
  nome: string;
  valorAlvo: number;
  valorAtual: number;
  percentualConcluido: number;
  dataAlvo: string;
  aportes: Aporte[] | null;
}

export interface CreateObjetivoRequest {
  nome: string;
  valorAlvo: number;
  dataAlvo: string;
}

export type UpdateObjetivoRequest = CreateObjetivoRequest;

export interface CreateAporteRequest {
  valor: number;
  data: string;
}

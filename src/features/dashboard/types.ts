export interface ResumoMensal {
  ano: number;
  mes: number;
  // Realizados
  receitasRecebidas: number;
  despesasPagas: number;
  saldoRealizado: number;
  // Pendentes
  receitasPendentes: number;
  despesasPendentes: number;
  // Previsão (realizados + pendentes)
  receitasPrevistas: number;
  despesasPrevistas: number;
  saldoPrevisto: number;
  // Contagens
  qtdReceitasPendentes: number;
  qtdDespesasPendentes: number;
}

export interface GastoPorCategoria {
  categoriaId?: string | null;
  categoriaNome: string;
  valor: number;
}

export interface EvolucaoMensal {
  ano: number;
  mes: number;
  // Realizados
  receitasRealizadas: number;
  despesasRealizadas: number;
  saldoRealizado: number;
  saldoAcumuladoRealizado: number;
  // Previsão
  receitasPrevistas: number;
  despesasPrevistas: number;
  saldoPrevisto: number;
  saldoAcumuladoPrevisto: number;
}

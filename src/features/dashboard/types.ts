export interface ResumoMensal {
  ano: number;
  mes: number;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface GastoPorCategoria {
  categoriaId?: string | null;
  categoriaNome: string;
  valor: number;
}

export interface EvolucaoMensal {
  ano: number;
  mes: number;
  receitas: number;
  despesas: number;
  saldoAcumulado: number;
}

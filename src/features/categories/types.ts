export type TipoCategoria = 'Receita' | 'Despesa';

export interface Subcategoria {
  id: string;
  nome: string;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: TipoCategoria;
  icone?: string | null;
  cor?: string | null;
  subcategorias: Subcategoria[] | null;
}

export interface CreateCategoriaRequest {
  nome: string;
  tipo: TipoCategoria;
  icone?: string | null;
  cor?: string | null;
}

export interface UpdateCategoriaRequest {
  nome: string;
  icone?: string | null;
  cor?: string | null;
}

export interface SubcategoriaRequest {
  nome: string;
}

export interface Tag {
  id: string;
  nome: string;
  icone?: string | null;
}

export interface CreateTagRequest {
  nome: string;
  icone?: string | null;
}

export type UpdateTagRequest = CreateTagRequest;

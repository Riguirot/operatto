export interface EstoqueItem {
  id: string;
  produtoId: string;
  quantidade: number;
  reservado: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CriarEstoqueDTO {
  produtoId: string;
  quantidade: number;
}

export interface AtualizarEstoqueDTO {
  quantidade?: number;
}

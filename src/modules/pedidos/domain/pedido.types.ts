export interface PedidoItemInput {
  produtoId: number;
  quantidade: number;
}

export interface PedidoContext {
  clienteId: number;
  itens: PedidoItemInput[];
  produtoAtual?: number;
}

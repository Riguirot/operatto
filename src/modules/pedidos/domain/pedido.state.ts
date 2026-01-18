export enum PedidoState {
  INICIO = "INICIO",
  ESCOLHENDO_PRODUTO = "ESCOLHENDO_PRODUTO",
  DEFININDO_QUANTIDADE = "DEFININDO_QUANTIDADE",
  RESUMO = "RESUMO",
  CONFIRMADO = "CONFIRMADO",
  CANCELADO = "CANCELADO",
}

export type PedidoEvent =
  | { type: "INICIAR" }
  | { type: "SELECIONAR_PRODUTO"; produtoId: number }
  | { type: "DEFINIR_QUANTIDADE"; quantidade: number }
  | { type: "ADICIONAR_OUTRO" }
  | { type: "IR_PARA_RESUMO" }
  | { type: "CONFIRMAR" }
  | { type: "CANCELAR" };

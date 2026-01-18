import { PedidoState } from "./pedido.state";
import { PedidoContext } from "./pedido.types";

/**
 * Entidade de Pedido (Domínio)
 * Representa o estado atual do pedido fora do HTTP/DB
 */
export class PedidoEntity {
  constructor(
    public clienteId: number,
    public state: PedidoState,
    public context: PedidoContext
  ) {}

  static create(clienteId: number): PedidoEntity {
    return new PedidoEntity(clienteId, PedidoState.INICIO, {
      clienteId,
      itens: [],
    });
  }
}

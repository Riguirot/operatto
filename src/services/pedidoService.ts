import Pedido from "../models/Pedido.js";
import AppError from "../utils/AppError.js";

import type {
  StatusPedido,
  AtualizarStatusPedidoInput
} from "../schemas/pedido.schema";

/**
 * Serviço de pedidos
 */
class PedidoService {
  static async buscarPorId(id_pedido: number) {
    return Pedido.buscarPorId(id_pedido);
  }

  static async atualizarStatusPedido({
    id_pedido,
    status
  }: AtualizarStatusPedidoInput & { id_pedido: number }) {
    const pedido = await Pedido.buscarPorId(id_pedido);

    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404);
    }

    const statusAtual: StatusPedido = pedido.status;

    const transicoesPermitidas: Record<StatusPedido, StatusPedido[]> = {
      ABERTO: ["EM_PRODUCAO", "CANCELADO"],
      EM_PRODUCAO: ["FINALIZADO", "CANCELADO"],
      FINALIZADO: [],
      CANCELADO: []
    };

    if (!transicoesPermitidas[statusAtual].includes(status)) {
      throw new AppError("Transição de status não permitida", 400);
    }

    const pedidoAtualizado = await Pedido.atualizarStatus(
      id_pedido,
      status
    );

    return pedidoAtualizado;
  }
}

export default PedidoService;

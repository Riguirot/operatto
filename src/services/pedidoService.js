/* import Pedido from "../models/Pedido.js";
import AppError from "../utils/AppError.js";

class PedidoService {
  static async atualizarStatusPedido({ id_pedido, status }) {
    const pedido = await Pedido.buscarPorId(id_pedido);

    if (!pedido) {
      throw new AppError("Pedido não encontrado", 404);
    }

    const statusAtual = pedido.status;

    const transicoesPermitidas = {
      ABERTO: ["EM_PRODUCAO", "CANCELADO"],
      EM_PRODUCAO: ["FINALIZADO", "CANCELADO"],
      FINALIZADO: [],
      CANCELADO: []
    };

    if (!transicoesPermitidas[statusAtual]?.includes(status)) {
      throw new AppError("Transição de status não permitida", 400);
    }

    const pedidoAtualizado = await Pedido.atualizarStatus(
      id_pedido,
      status
    );

    return pedidoAtualizado;
  }
}

export default PedidoService; */
export { default } from "./pedidoService.ts";
export * from "./pedidoService.ts";


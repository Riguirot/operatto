import PedidoService from "../services/pedidoService";
import {
  atualizarStatusPedidoSchema,
  pedidoIdParamSchema
} from "../schemas/pedido.schema.js";

class PedidoController {
  static async buscarPedido(req, res, next) {
    try {
      const { id } = req.params;

      const pedido = await PedidoService.buscarPorId(Number(id));

      if (!pedido) {
        return res.status(404).json({
          mensagem: "Pedido não encontrado"
        });
      }

      return res.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  static async atualizarStatus(req, res, next) {
    try {
      // validações
      pedidoIdParamSchema.parse(req.params);
      atualizarStatusPedidoSchema.parse(req.body);

      const { id } = req.params;
      const { status } = req.body;

      const pedidoAtualizado =
        await PedidoService.atualizarStatusPedido({
          id_pedido: Number(id),
          status
        });

      return res.status(200).json({
        id: pedidoAtualizado.id_pedido,
        status: pedidoAtualizado.status,
        mensagem: "Status do pedido atualizado com sucesso"
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PedidoController;


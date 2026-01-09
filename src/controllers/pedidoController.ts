import { Request, Response, NextFunction } from "express";

import PedidoService from "../services/pedidoService.js";

import {
  atualizarStatusPedidoSchema,
  pedidoIdParamSchema,
  StatusPedido
} from "../schemas/pedido.schema";

/**
 * Controller de pedidos
 */
class PedidoController {
  static async buscarPedido(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

  static async atualizarStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // validações
      pedidoIdParamSchema.parse(req.params);
      atualizarStatusPedidoSchema.parse(req.body);

      const { id } = req.params;
      const { status } = req.body as { status: StatusPedido };

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

import { Request, Response, NextFunction } from "express";
import { criarPedidoWebSchema } from "./pedido.schema";
import PedidoWebService from "./services/web.service";

class PedidoWebController {
  static async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const { clienteId, itens } = criarPedidoWebSchema.parse(req.body);

      const resultado = await PedidoWebService.criarPedido({
        clienteId,
        itens,
      });

      return res.status(201).json({
        mensagem: "Pedido criado com sucesso",
        pedido: {
          id: resultado.pedidoPersistido.id,
          clienteId,
          itens: resultado.itens,
          status: resultado.estado,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PedidoWebController;

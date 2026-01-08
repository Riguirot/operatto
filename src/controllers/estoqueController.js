import EstoqueService from "../services/estoqueService.js";
import {
  entradaEstoqueSchema,
  reservaEstoqueSchema,
  baixaEstoqueSchema
} from "../schemas/estoque.schema.js";

class EstoqueController {
  /**
   * Entrada manual de estoque
   */
  static async entrada(req, res, next) {
    try {
      entradaEstoqueSchema.parse(req.body);

      const { id_produto, quantidade } = req.body;

      const estoque =
        await EstoqueService.entrada({ id_produto, quantidade });

      return res.status(200).json(estoque);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reserva manual de estoque
   */
  static async reservar(req, res, next) {
    try {
      reservaEstoqueSchema.parse(req.body);

      const { id_produto, quantidade } = req.body;

      const estoque =
        await EstoqueService.reservar({ id_produto, quantidade });

      return res.status(200).json(estoque);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Baixa manual de estoque
   */
  static async baixar(req, res, next) {
    try {
      baixaEstoqueSchema.parse(req.body);

      const { id_produto, quantidade } = req.body;

      const estoque =
        await EstoqueService.baixar({ id_produto, quantidade });

      return res.status(200).json(estoque);
    } catch (error) {
      next(error);
    }
  }
}

export default EstoqueController;

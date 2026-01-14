import type { Request, Response, NextFunction } from "express";
import EstoqueService from "../services/estoqueService";

import {
  entradaEstoqueSchema,
  baixaEstoqueSchema,
} from "../schemas/estoque.schema";

class EstoqueController {
  /**
   * Entrada manual de estoque
   */
  static async entrada(req: Request, res: Response, next: NextFunction) {
    try {
      entradaEstoqueSchema.parse(req.body);

      const { id_produto, quantidade } = req.body;

      const estoque = await EstoqueService.entrada({
        id_produto,
        quantidade,
      });

      return res.status(200).json(estoque);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Baixa manual de estoque
   */
  static async baixar(req: Request, res: Response, next: NextFunction) {
    try {
      baixaEstoqueSchema.parse(req.body);

      const { id_produto, quantidade } = req.body;

      const estoque = await EstoqueService.baixar({
        id_produto,
        quantidade,
      });

      return res.status(200).json(estoque);
    } catch (error) {
      next(error);
    }
  }
}

export default EstoqueController;

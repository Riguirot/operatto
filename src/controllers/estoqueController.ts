import type { Request, Response, NextFunction } from "express";
import EstoqueService from "../services/estoqueService";

class EstoqueController {
  static async entrada(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_produto, quantidade } = req.body;

      const estoque = await EstoqueService.entrada({
        id_produto,
        quantidade,
      });

      return res.status(200).json({ data: estoque });
    } catch (error) {
      return next(error);
    }
  }

  static async baixar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_produto, quantidade } = req.body;

      const estoque = await EstoqueService.baixar({
        id_produto,
        quantidade,
      });

      return res.status(200).json({ data: estoque });
    } catch (error) {
      return next(error);
    }
  }

  static async reservar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_produto, quantidade } = req.body;

      const estoque = await EstoqueService.reservar({
        id_produto,
        quantidade,
      });

      return res.status(200).json({ data: estoque });
    } catch (error) {
      return next(error);
    }
  }

  static async baixarReservado(req: Request, res: Response, next: NextFunction) {
  try {
    const { id_produto, quantidade } = req.body;

    const estoque = await EstoqueService.baixarReservado({
      id_produto,
      quantidade,
    });

    return res.status(200).json({ data: estoque });
  } catch (error) {
    return next(error);
  }
}


  static async liberarReserva(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_produto, quantidade } = req.body;

      const estoque = await EstoqueService.liberarReserva({
        id_produto,
        quantidade,
      });

      return res.status(200).json({ data: estoque });
    } catch (error) {
      return next(error);
    }
  }
}

export default EstoqueController;

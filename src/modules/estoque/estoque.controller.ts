import { Request, Response } from "express";
import EstoqueService from "./estoque.service";

class EstoqueController {
  criar(req: Request, res: Response) {
    const item = EstoqueService.criar(req.body);
    return res.status(201).json(item);
  }

  listar(_req: Request, res: Response) {
    const itens = EstoqueService.listar();
    return res.json(itens);
  }

  buscar(req: Request, res: Response) {
    const item = EstoqueService.buscarPorId(req.params.id);
    return res.json(item);
  }

  atualizar(req: Request, res: Response) {
    const item = EstoqueService.atualizar(
      req.params.id,
      req.body
    );
    return res.json(item);
  }

  movimentar(req: Request, res: Response) {
    const item = EstoqueService.movimentar(
      req.params.id,
      req.body.quantidade
    );
    return res.json(item);
  }
}

export default new EstoqueController();

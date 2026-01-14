import { Request, Response, NextFunction } from "express";

// service ainda em JS
const MovimentacaoEstoque = require(
  "../services/movimentacaoEstoqueService"
);

async function entrada(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const resultado =
      await MovimentacaoEstoque.registrarMovimentacao(req.body);

    return res.status(201).json(resultado);
  } catch (err) {
    return next(err);
  }
}

async function listar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idProduto = Number(req.params.idProduto);

    const movs =
      await MovimentacaoEstoque.listarPorProduto(idProduto);

    return res.json(movs);
  } catch (err) {
    return next(err);
  }
}

export default {
  entrada,
  listar,
};

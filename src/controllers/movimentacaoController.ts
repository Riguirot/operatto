import { Request, Response, NextFunction } from "express";
import {
  registrarMovimentacao,
  listarPorProduto,
} from "../services/movimentacaoEstoqueService";

/**
 * 📥 Registrar movimentação de estoque
 */
async function entrada(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const resultado = await registrarMovimentacao(req.body);

    return res.status(201).json(resultado);
  } catch (err) {
    return next(err);
  }
}

/**
 * 📄 Listar movimentações por produto
 */
async function listar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idProduto = Number(req.params.idProduto);

    const movimentacoes = await listarPorProduto(idProduto);

    return res.json(movimentacoes);
  } catch (err) {
    return next(err);
  }
}

export default {
  entrada,
  listar,
};

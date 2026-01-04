import { registrarMovimentacao } from "../services/movimentacaoEstoqueService.js";

export async function criarMovimentacao(req, res, next) {
  try {
    const dados = req.body;

    const resultado = await registrarMovimentacao(dados);

    return res.status(201).json({
      message: "Movimentação registrada com sucesso",
      movimentacao: resultado
    });
  } catch (error) {
    next(error);
  }
}

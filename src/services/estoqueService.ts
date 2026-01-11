import MovimentacaoEstoque from "../models/movimentacaoEstoque.js";
import Estoque from "../models/Estoque.js"; //allowImportingTsExtensions
import AppError from "../utils/AppError.js";

/**
 * Serviço de estoque
 */
class EstoqueService {
  // Entrada de estoque
  static async entrada({
  id_produto,
  quantidade,
}: {
  id_produto: number;
  quantidade: number;
}) {
  let estoque = await Estoque.buscarPorProduto(id_produto);

  if (!estoque) {
    estoque = await Estoque.criarParaProduto(id_produto);
  }

  if (quantidade <= 0) {
    throw new AppError("Quantidade deve ser maior que zero", 400);
  }

  const estoqueAtualizado = await Estoque.entrada(
    id_produto,
    quantidade
  );

  await MovimentacaoEstoque.registrar({
    id_produto,
    tipo: "ENTRADA",
    quantidade,
    origem: "ESTOQUE",
    observacao: "Entrada manual de estoque",
  });

  return estoqueAtualizado;
}

  // Baixa de estoque
  static async baixar({
  id_produto,
  quantidade,
}: {
  id_produto: number;
  quantidade: number;
}) {
  const estoque = await Estoque.buscarPorProduto(id_produto);

  if (!estoque) {
    throw new AppError("Estoque não encontrado", 404);
  }

  if (quantidade <= 0) {
    throw new AppError("Quantidade deve ser maior que zero", 400);
  }

  if (Number(estoque.quantidade_atual) < quantidade) {
    throw new AppError("Estoque insuficiente", 400);
  }

  const estoqueAtualizado = await Estoque.baixar(
    id_produto,
    quantidade
  );

  await MovimentacaoEstoque.registrar({
    id_produto,
    tipo: "BAIXA",
    quantidade,
    origem: "ESTOQUE",
    observacao: "Baixa manual de estoque",
  });

  return estoqueAtualizado;
}


}

export default EstoqueService;

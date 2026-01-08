import Estoque from "../models/Estoque.js";
import AppError from "../utils/AppError.js";

class EstoqueService {

  // Entrada de estoque
  static async entrada({ id_produto, quantidade }) {
    let estoque = await Estoque.buscarPorProduto(id_produto);

    // cria estoque se não existir
    if (!estoque) {
      await Estoque.criarParaProduto(id_produto);
    }

    return Estoque.entrada(id_produto, quantidade);
  }

  // Baixa de estoque
  static async baixar({ id_produto, quantidade }) {
    const estoque = await Estoque.buscarPorProduto(id_produto);

    if (!estoque) {
      throw new AppError("Estoque não encontrado", 404);
    }

    if (Number(estoque.quantidade_atual) < quantidade) {
      throw new AppError("Estoque insuficiente", 400);
    }

    return Estoque.baixar(id_produto, quantidade);
  }
}

export default EstoqueService;

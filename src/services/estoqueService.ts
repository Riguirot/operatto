import MovimentacaoEstoque from "../models/movimentacaoEstoque";
import Estoque from "../models/Estoque";
import AppError from "../utils/AppError";

/**
 * Serviço de estoque
 * Regra de negócio central do ERP
 */
class EstoqueService {
  /**
   * 📥 Entrada manual de estoque
   * Aumenta o TOTAL
   */
  static async entrada({
    id_produto,
    quantidade,
  }: {
    id_produto: number;
    quantidade: number;
  }) {
    if (quantidade <= 0) {
      throw new AppError("Quantidade deve ser maior que zero", 400);
    }

    let estoque = await Estoque.buscarPorProduto(id_produto);

    if (!estoque) {
      estoque = await Estoque.criarParaProduto(id_produto);
    }

    const atualizado = await Estoque.entrada(id_produto, quantidade);

    await MovimentacaoEstoque.registrar({
      id_produto,
      tipo: "ENTRADA",
      quantidade,
      origem: "ESTOQUE",
      observacao: "Entrada manual de estoque",
    });

    return atualizado;
  }

  /**
   * 📤 Baixa manual de estoque
   * Diminui o TOTAL (não usa reserva)
   */
  static async baixar({
  id_produto,
  quantidade,
}: {
  id_produto: number;
  quantidade: number;
}) {
  if (quantidade <= 0) {
    throw new AppError("Quantidade deve ser maior que zero", 400);
  }

  const estoque = await Estoque.buscarPorProduto(id_produto);
  if (!estoque) {
    throw new AppError("Estoque não encontrado", 404);
  }

  try {
    const atualizado = await Estoque.baixar(id_produto, quantidade);

    await MovimentacaoEstoque.registrar({
      id_produto,
      tipo: "BAIXA",
      quantidade,
      origem: "ESTOQUE",
      observacao: "Baixa manual de estoque",
    });

    return atualizado;
  } catch {
    throw new AppError(
      "Estoque insuficiente para baixa manual",
      409
    );
  }
}

  /**
   * 🔒 Reserva de estoque
   * Usado por pedidos / produção
   */
  static async reservar({
    id_produto,
    quantidade,
  }: {
    id_produto: number;
    quantidade: number;

  }) {
    if (quantidade <= 0) {
      throw new AppError("Quantidade inválida", 400);
    }

    const estoque = await Estoque.buscarPorProduto(id_produto);

    if (!estoque) {
      throw new AppError("Estoque não encontrado", 404);
    }

    const total = Number(estoque.quantidade_total);
    const reservado = Number(estoque.quantidade_reservada);
    const disponivel = total - reservado;

    if (disponivel < quantidade) {
      throw new AppError(
        "Estoque insuficiente para reserva",
        409
      );
    }

    let atualizado;

try {
  atualizado = await Estoque.reservar(id_produto, quantidade);
} catch {
  throw new AppError("Estoque insuficiente para reserva", 409);
}


    await MovimentacaoEstoque.registrar({
      id_produto,
      tipo: "RESERVA",
      quantidade,
      origem: "SISTEMA",
      observacao: "Reserva de estoque",
    });

    return atualizado;
  }

  /**
   * 🔓 Liberação de reserva
   * Pedido cancelado / ajuste
   */
 static async liberarReserva({
  id_produto,
  quantidade,
}: {
  id_produto: number;
  quantidade: number;
}) {
  if (quantidade <= 0) {
    throw new AppError("Quantidade inválida", 400);
  }

  const estoque = await Estoque.buscarPorProduto(id_produto);
  if (!estoque) {
    throw new AppError("Estoque não encontrado", 404);
  }

  try {
    const atualizado = await Estoque.liberarReserva(
      id_produto,
      quantidade
    );

    await MovimentacaoEstoque.registrar({
      id_produto,
      tipo: "LIBERACAO_RESERVA",
      quantidade,
      origem: "SISTEMA",
      observacao: "Liberação de reserva",
    });

    return atualizado;
  } catch {
    throw new AppError(
      "Reserva insuficiente para liberação",
      409
    );
  }
}

  /**
   * ✅ Confirmação de estoque reservado
   * Diminui TOTAL e RESERVADO
   */
  static async baixarReservado({
  id_produto,
  quantidade,
}: {
  id_produto: number;
  quantidade: number;
}) {
  if (quantidade <= 0) {
    throw new AppError("Quantidade inválida", 400);
  }

  const estoque = await Estoque.buscarPorProduto(id_produto);
  if (!estoque) {
    throw new AppError("Estoque não encontrado", 404);
  }

  try {
    const atualizado = await Estoque.baixarReservado(
      id_produto,
      quantidade
    );

    await MovimentacaoEstoque.registrar({
      id_produto,
      tipo: "BAIXA_RESERVADA",
      quantidade,
      origem: "SISTEMA",
      observacao: "Baixa de estoque reservado",
    });

    return atualizado;
  } catch {
    throw new AppError(
      "Reserva insuficiente para baixa",
      409
    );
  }
}
}

export default EstoqueService;

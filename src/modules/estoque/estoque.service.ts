import AppError from "../../utils/AppError";
import {
  CriarEstoqueDTO,
  AtualizarEstoqueDTO,
  EstoqueItem,
} from "./estoque.types";

// simulação de repositório (troca fácil por Prisma depois)
const estoqueDB: EstoqueItem[] = [];

class EstoqueService {
  criar(data: CriarEstoqueDTO): EstoqueItem {
    const existe = estoqueDB.find(
      (item) => item.produtoId === data.produtoId
    );

    if (existe) {
      throw new AppError("Produto já possui estoque cadastrado", 409);
    }

    const novoItem: EstoqueItem = {
      id: crypto.randomUUID(),
      produtoId: data.produtoId,
      quantidade: data.quantidade,
      reservado: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    estoqueDB.push(novoItem);
    return novoItem;
  }

  listar(): EstoqueItem[] {
    return estoqueDB;
  }

  buscarPorId(id: string): EstoqueItem {
    const item = estoqueDB.find((i) => i.id === id);
    if (!item) {
      throw new AppError("Item de estoque não encontrado", 404);
    }
    return item;
  }

  atualizar(id: string, data: AtualizarEstoqueDTO): EstoqueItem {
    const item = this.buscarPorId(id);

    if (data.quantidade !== undefined) {
      if (data.quantidade < item.reservado) {
        throw new AppError(
          "Quantidade menor que o total reservado",
          400
        );
      }
      item.quantidade = data.quantidade;
    }

    item.updatedAt = new Date();
    return item;
  }

  movimentar(id: string, quantidade: number): EstoqueItem {
    const item = this.buscarPorId(id);

    const novaQuantidade = item.quantidade + quantidade;
    if (novaQuantidade < item.reservado) {
      throw new AppError("Movimentação inválida", 400);
    }

    item.quantidade = novaQuantidade;
    item.updatedAt = new Date();
    return item;
  }
}

export default new EstoqueService();

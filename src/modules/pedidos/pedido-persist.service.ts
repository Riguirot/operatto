import PedidoServiceLegado from "../../services/pedidoService";
import AppError from "../../utils/AppError";

interface PersistirPedidoInput {
  clienteId: number;
  itens: {
    produtoId: number;
    quantidade: number;
  }[];
}

class PedidoPersistService {
  static async persistir({ clienteId, itens }: PersistirPedidoInput) {
    try {
      /**
       * Delegate total para o service legado,
       * que já:
       * - cria pedido
       * - cria itens
       * - reserva estoque
       * - valida inconsistências
       */
      const pedido = await PedidoServiceLegado.criarPedido({
        id_cliente: clienteId,
        itens: itens.map((item) => ({
          id_produto: item.produtoId,
          quantidade: item.quantidade,
        })),
      });

      return pedido;
    } catch (error) {
      /**
       * Mantém erro padronizado
       */
      throw new AppError(
        error instanceof Error ? error.message : "Erro ao persistir pedido",
        409
      );
    }
  }
}

export default PedidoPersistService;

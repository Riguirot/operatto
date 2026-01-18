import PedidoService from "./pedido.service";
import PedidoPersistService from "../pedido-persist.service";

interface CriarPedidoWebInput {
  clienteId: number;
  itens: {
    produtoId: number;
    quantidade: number;
  }[];
}

class PedidoWebService {
  static async criarPedido({ clienteId, itens }: CriarPedidoWebInput) {
    // 🧠 FSM
    const pedido = new PedidoService(clienteId);

    pedido.dispatch({ type: "INICIAR" });

    for (const item of itens) {
      pedido.dispatch({
        type: "SELECIONAR_PRODUTO",
        produtoId: item.produtoId,
      });

      pedido.dispatch({
        type: "DEFINIR_QUANTIDADE",
        quantidade: item.quantidade,
      });

      pedido.dispatch({ type: "ADICIONAR_OUTRO" });
    }

    pedido.dispatch({ type: "CONFIRMAR" });

    // 💾 Persistência
    const pedidoPersistido = await PedidoPersistService.persistir({
      clienteId,
      itens: pedido.getContext().itens,
    });

    return {
      pedidoPersistido,
      estado: pedido.getState(),
      itens: pedido.getContext().itens,
    };
  }
}

export default PedidoWebService;

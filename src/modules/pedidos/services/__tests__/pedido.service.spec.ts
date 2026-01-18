import PedidoService from "../pedido.service";
import { PedidoState } from "../../domain/pedido.state";

describe("PedidoService FSM", () => {
  it("deve criar um pedido completo com sucesso", () => {
    const pedido = new PedidoService(1);

    pedido.dispatch({ type: "INICIAR" });
    expect(pedido.getState()).toBe(PedidoState.ESCOLHENDO_PRODUTO);

    pedido.dispatch({ type: "SELECIONAR_PRODUTO", produtoId: 1 });
    expect(pedido.getState()).toBe(PedidoState.DEFININDO_QUANTIDADE);

    pedido.dispatch({ type: "DEFINIR_QUANTIDADE", quantidade: 10 });
    expect(pedido.getState()).toBe(PedidoState.RESUMO);

    pedido.dispatch({ type: "CONFIRMAR" });
    expect(pedido.getState()).toBe(PedidoState.CONFIRMADO);

    expect(pedido.getContext().itens).toEqual([
      { produtoId: 1, quantidade: 10 },
    ]);
  });

  it("deve permitir adicionar múltiplos itens", () => {
    const pedido = new PedidoService(1);

    pedido.dispatch({ type: "INICIAR" });

    pedido.dispatch({ type: "SELECIONAR_PRODUTO", produtoId: 1 });
    pedido.dispatch({ type: "DEFINIR_QUANTIDADE", quantidade: 10 });
    pedido.dispatch({ type: "ADICIONAR_OUTRO" });

    pedido.dispatch({ type: "SELECIONAR_PRODUTO", produtoId: 2 });
    pedido.dispatch({ type: "DEFINIR_QUANTIDADE", quantidade: 5 });
    pedido.dispatch({ type: "CONFIRMAR" });

    expect(pedido.getState()).toBe(PedidoState.CONFIRMADO);
    expect(pedido.getContext().itens).toHaveLength(2);
  });

  it("deve cancelar o pedido corretamente", () => {
    const pedido = new PedidoService(1);

    pedido.dispatch({ type: "INICIAR" });
    pedido.dispatch({ type: "SELECIONAR_PRODUTO", produtoId: 1 });
    pedido.dispatch({ type: "DEFINIR_QUANTIDADE", quantidade: 5 });
    pedido.dispatch({ type: "CANCELAR" });

    expect(pedido.getState()).toBe(PedidoState.CANCELADO);
  });

  it("não deve permitir pular etapas", () => {
    const pedido = new PedidoService(1);

    expect(() => {
      pedido.dispatch({ type: "CONFIRMAR" });
    }).toThrow();
  });

  it("não deve aceitar quantidade inválida", () => {
    const pedido = new PedidoService(1);

    pedido.dispatch({ type: "INICIAR" });
    pedido.dispatch({ type: "SELECIONAR_PRODUTO", produtoId: 1 });

    expect(() => {
      pedido.dispatch({ type: "DEFINIR_QUANTIDADE", quantidade: 0 });
    }).toThrow();
  });
});

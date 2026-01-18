import PedidoService from "../src/services/PedidoService";

describe("Concorrência de pedidos", () => {
  it("não deve permitir duas reservas acima do estoque", async () => {
    const payload = {
      id_cliente: 1,
      itens: [
        {
          id_produto: 1,
          quantidade: 60,
        },
      ],
    };

    // dispara duas promessas ao mesmo tempo
    const resultados = await Promise.allSettled([
      PedidoService.criarPedido(payload),
      PedidoService.criarPedido(payload),
    ]);

    const sucesso = resultados.filter(
      (r) => r.status === "fulfilled"
    );

    const erro = resultados.filter(
      (r) => r.status === "rejected"
    );

    expect(sucesso.length).toBe(1);
    expect(erro.length).toBe(1);
  });
});

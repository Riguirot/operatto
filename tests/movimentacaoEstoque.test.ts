import Produto from "@/models/Produto";
import MovimentacaoEstoque from "@/models/movimentacaoEstoque";

describe("Movimentação de Estoque", () => {
  let produto: any;

  beforeAll(async () => {
    produto = await (Produto as any).create({
      nome: "Produto Movimentação",
      descricao: "Produto para teste de movimentação",
      unidade_medida: "UN",
      preco_venda: 3.0,
    });
  });

  it("deve criar uma movimentação de estoque", async () => {
    const movimentacao = await (MovimentacaoEstoque as any).create({
      id_produto: produto.id_produto,
      tipo: "ENTRADA",
      quantidade: 5,
      origem: "TESTE",
      observacao: "Movimentação de teste",
    });

    expect(movimentacao).toHaveProperty("id_movimentacao");
    expect(movimentacao.quantidade).toBe(5);
  });

  it("deve listar movimentações por produto", async () => {
    const movimentacoes = await (MovimentacaoEstoque as any).findByProduto(
      produto.id_produto
    );

    expect(Array.isArray(movimentacoes)).toBe(true);
    expect(movimentacoes.length).toBeGreaterThan(0);
  });
});

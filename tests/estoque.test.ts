import Produto from "@/models/Produto";
import Estoque from "@/models/Estoque";


describe("Model Estoque", () => {
  let produto: any;

  beforeAll(async () => {
    produto = await (Produto as any).create({
      nome: "Produto Estoque Teste",
      descricao: "Produto para teste de estoque",
      unidade_medida: "UN",
      preco_venda: 1.99,
    });
  });

  it("deve criar estoque para um produto", async () => {
    const estoque = await (Estoque as any).create({
      id_produto: produto.id_produto,
      quantidade_atual: 10,
    });

    expect(estoque).toHaveProperty("id_estoque");
    expect(Number(estoque.quantidade_atual)).toBe(10);
  });

  it("deve buscar estoque pelo id_produto", async () => {
    const estoque = await (Estoque as any).findByProduto(produto.id_produto);

    expect(estoque).not.toBeNull();
    expect(Number(estoque.quantidade_atual)).toBe(10);
  });

  it("deve atualizar a quantidade do estoque", async () => {
    const estoqueAtualizado = await (Estoque as any).updateQuantidade(
      produto.id_produto,
      25
    );

    expect(Number(estoqueAtualizado.quantidade_atual)).toBe(25);
  });
});

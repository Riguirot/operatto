import Produto from "@/models/Produto";
import Estoque from "@/models/Estoque";

describe("Model Estoque", () => {
  let produto: any;

  beforeAll(async () => {
    produto = await Produto.criar({
      nome: "Produto Estoque Teste",
      descricao: "Produto para teste de estoque",
      unidade_medida: "UN",
      preco_venda: 1.99,
    });
  });

  it("deve criar estoque para um produto", async () => {
    const estoque = await Estoque.criarParaProduto(produto.id_produto);

    expect(estoque).toHaveProperty("id_estoque");
    expect(Number(estoque.quantidade_atual)).toBe(0);
  });

  it("deve dar entrada no estoque", async () => {
    const atualizado = await Estoque.entrada(
      produto.id_produto,
      10
    );

    expect(Number(atualizado.quantidade_atual)).toBe(10);
  });

  it("deve buscar estoque pelo id_produto", async () => {
    const estoque = await Estoque.buscarPorProduto(
      produto.id_produto
    );

    expect(estoque).not.toBeNull();
    expect(Number(estoque!.quantidade_atual)).toBe(10);
  });
});

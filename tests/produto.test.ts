import Produto from "@/models/Produto";

describe("Model Produto", () => {
  it("deve criar um produto no banco", async () => {
    const produto = await (Produto as any).create({
      nome: "Bolacha Teste",
      descricao: "Produto de teste",
      unidade_medida: "UN",
      preco_venda: 2.5,
    });

    expect(produto).toHaveProperty("id_produto");
    expect(produto.nome).toBe("Bolacha Teste");
  });

  it("deve listar produtos", async () => {
    const produtos = await (Produto as any).findAll();
    expect(Array.isArray(produtos)).toBe(true);
  });
});

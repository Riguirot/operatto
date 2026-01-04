/*
describe("Produto", () => {
  it("placeholder", () => {
    expect(true).toBe(true);
  });
});
*/
import Produto from "../src/models/Produto.js";

describe("Model Produto", () => {
  it("deve criar um produto no banco", async () => {
    const produto = await Produto.create({
      nome: "Bolacha Teste",
      descricao: "Produto de teste",
      unidade_medida: "UN",
      preco_venda: 2.5
    });

    expect(produto).toHaveProperty("id_produto");
    expect(produto.nome).toBe("Bolacha Teste");
  });

  it("deve listar produtos", async () => {
    const produtos = await Produto.findAll();
    expect(Array.isArray(produtos)).toBe(true);
  });
});

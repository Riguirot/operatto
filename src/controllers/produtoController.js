import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  removerProduto
} from "../services/produtoService.js";

export async function criar(req, res) {
  const produto = await criarProduto(req.body);
  res.status(201).json(produto);
}

export async function listar(req, res) {
  const produtos = await listarProdutos();
  res.json(produtos);
}

export async function buscarPorId(req, res) {
  const produto = await buscarProdutoPorId(req.params.id);

  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  res.json(produto);
}

export async function atualizar(req, res) {
  const produto = await atualizarProduto(req.params.id, req.body);

  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  res.json(produto);
}

export async function remover(req, res) {
  const produto = await removerProduto(req.params.id);

  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  res.json({ mensagem: "Produto removido com sucesso" });
}

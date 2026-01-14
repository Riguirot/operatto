import type { Request, Response } from "express";

import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  removerProduto
} from "../services/produtoService";

import type { ProdutoInput } from "../schemas/produto.schema";

/**
 * POST /produtos
 */
export async function criar(req: Request, res: Response) {
  const dados = req.body as ProdutoInput;

  const produto = await criarProduto(dados);
  return res.status(201).json(produto);
}

/**
 * GET /produtos
 */
export async function listar(req: Request, res: Response) {
  const produtos = await listarProdutos();
  return res.json(produtos);
}

/**
 * GET /produtos/:id
 */
export async function buscarPorId(req: Request, res: Response) {
  const id = Number(req.params.id);

  const produto = await buscarProdutoPorId(id);

  if (!produto) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }

  return res.json(produto);
}

/**
 * PUT /produtos/:id
 */
export async function atualizar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const dados = req.body as ProdutoInput;

  const produto = await atualizarProduto(id, dados);

  if (!produto) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }

  return res.json(produto);
}

/**
 * DELETE /produtos/:id
 */
export async function remover(req: Request, res: Response) {
  const id = Number(req.params.id);

  const produto = await removerProduto(id);

  if (!produto) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }

  return res.json({ mensagem: "Produto removido com sucesso" });
}

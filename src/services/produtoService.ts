import pool from "@/config/database";
import type { ProdutoInput } from "@/schemas/produto.schema";


/**
 * CREATE
 */
export async function criarProduto(
  dados: ProdutoInput
) {
  const { nome, descricao, unidade_medida, preco_venda } = dados;

  const result = await pool.query(
    `
    INSERT INTO produto (nome, descricao, unidade_medida, preco_venda)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [nome, descricao, unidade_medida, preco_venda]
  );

  return result.rows[0];
}

/**
 * READ (todos)
 */
export async function listarProdutos() {
  const result = await pool.query(
    `
    SELECT * 
    FROM produto 
    WHERE ativo = true 
    ORDER BY id_produto
    `
  );

  return result.rows;
}

/**
 * READ (por id)
 */
export async function buscarProdutoPorId(id: number) {
  const result = await pool.query(
    `
    SELECT * 
    FROM produto 
    WHERE id_produto = $1 
      AND ativo = true
    `,
    [id]
  );

  return result.rows[0];
}

/**
 * UPDATE
 */
export async function atualizarProduto(
  id: number,
  dados: ProdutoInput
) {
  const { nome, descricao, unidade_medida, preco_venda } = dados;

  const result = await pool.query(
    `
    UPDATE produto
       SET nome = $1,
           descricao = $2,
           unidade_medida = $3,
           preco_venda = $4,
           updated_at = CURRENT_TIMESTAMP
     WHERE id_produto = $5
     RETURNING *
    `,
    [nome, descricao, unidade_medida, preco_venda, id]
  );

  return result.rows[0];
}

/**
 * DELETE (soft delete)
 */
export async function removerProduto(id: number) {
  const result = await pool.query(
    `
    UPDATE produto
       SET ativo = false,
           updated_at = CURRENT_TIMESTAMP
     WHERE id_produto = $1
     RETURNING *
    `,
    [id]
  );

  return result.rows[0];
}

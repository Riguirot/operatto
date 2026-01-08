import pool from "../config/database.js";

export default class Estoque {

  // Cria estoque para um produto (se não existir)
  static async criarParaProduto(id_produto) {
    const { rows } = await pool.query(
      `
      INSERT INTO estoque (id_produto)
      VALUES ($1)
      RETURNING *
      `,
      [id_produto]
    );

    return rows[0];
  }

  // Busca estoque pelo produto
  static async buscarPorProduto(id_produto) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM estoque
      WHERE id_produto = $1
      `,
      [id_produto]
    );

    return rows[0] || null;
  }

  // Entrada de estoque (principal)
  static async entrada(id_produto, quantidade) {
    const { rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_atual = quantidade_atual + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $2
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    return rows[0];
  }

  // Baixa de estoque
  static async baixar(id_produto, quantidade) {
    const { rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_atual = quantidade_atual - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $2
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    return rows[0];
  }
}

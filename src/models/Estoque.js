import pool from "../config/database.js";

export default class Estoque {
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

  static async buscarPorProduto(id_produto) {
    const { rows } = await pool.query(
      `SELECT * FROM estoque WHERE id_produto = $1`,
      [id_produto]
    );
    return rows[0] || null;
  }

  static async atualizarQuantidade(id_estoque, novaQuantidade) {
    const { rows } = await pool.query(
      `
      UPDATE estoque
      SET quantidade_atual = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_estoque = $2
      RETURNING *
      `,
      [novaQuantidade, id_estoque]
    );
    return rows[0];
  }
}

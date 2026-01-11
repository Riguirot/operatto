import pool from '@/config/database.js';

export default class MovimentacaoEstoque {
  static async create({
    id_produto,
    tipo,
    quantidade,
    origem = null,
    observacao = null
  }) {
    const query = `
      INSERT INTO movimentacao_estoque
        (id_produto, tipo, quantidade, origem, observacao)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [
      id_produto,
      tipo,
      quantidade,
      origem,
      observacao
    ]);

    return rows[0]; // 👈 TEM que ser movimentação
  }

  static async findByProduto(id_produto) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM movimentacao_estoque
      WHERE id_produto = $1
      ORDER BY created_at DESC
      `,
      [id_produto]
    );

    return rows; // 👈 SEMPRE array
  }
}


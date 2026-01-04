import pool from "../config/database.js";

export default class OrdemProducao {
  static async criar({
    id_produto,
    quantidade,
    status = "PLANEJADA"
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO ordem_producao
        (id_produto, quantidade, status)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [id_produto, quantidade, status]
    );

    return rows[0];
  }

  static async buscarPorId(id_ordem) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM ordem_producao
      WHERE id_ordem = $1
      `,
      [id_ordem]
    );

    return rows[0];
  }

  static async listar() {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM ordem_producao
      ORDER BY created_at DESC
      `
    );

    return rows;
  }

  static async atualizarStatus(id_ordem, status) {
    const { rows } = await pool.query(
      `
      UPDATE ordem_producao
      SET status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_ordem = $2
      RETURNING *
      `,
      [status, id_ordem]
    );

    return rows[0];
  }

  static async finalizar(id_ordem) {
    const { rows } = await pool.query(
      `
      UPDATE ordem_producao
      SET status = 'FINALIZADA',
          data_fim = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_ordem = $1
      RETURNING *
      `,
      [id_ordem]
    );

    return rows[0];
  }
}

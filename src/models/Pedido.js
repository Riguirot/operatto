import pool from "../config/database.js";

export default class Pedido {
  static async criar({ id_cliente, status }) {
    const { rows } = await pool.query(
      `
      INSERT INTO pedido (id_cliente, status)
      VALUES ($1, $2)
      RETURNING *
      `,
      [id_cliente, status]
    );

    return rows[0];
  }

  static async buscarPorId(id_pedido) {
    const { rows } = await pool.query(
      `
      SELECT * FROM pedido
      WHERE id_pedido = $1
      `,
      [id_pedido]
    );

    return rows[0];
  }

  static async listar() {
    const { rows } = await pool.query(
      `
      SELECT * FROM pedido
      ORDER BY data_pedido DESC
      `
    );

    return rows;
  }

  static async atualizarStatus(id_pedido, status) {
    const { rows } = await pool.query(
      `
      UPDATE pedido
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id_pedido = $2
      RETURNING *
      `,
      [status, id_pedido]
    );

    return rows[0];
  }
}

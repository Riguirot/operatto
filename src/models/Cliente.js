import pool from "../config/database.js";

export default class Cliente {
  static async criar({ nome, documento, telefone, email }) {
    const { rows } = await pool.query(
      `
      INSERT INTO cliente
        (nome, documento, telefone, email)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [nome, documento, telefone, email]
    );

    return rows[0];
  }

  static async buscarPorId(id_cliente) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM cliente
      WHERE id_cliente = $1
      `,
      [id_cliente]
    );

    return rows[0];
  }

  static async listar() {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM cliente
      WHERE ativo = true
      ORDER BY nome
      `
    );

    return rows;
  }

  static async desativar(id_cliente) {
    const { rowCount } = await pool.query(
      `
      UPDATE cliente
      SET ativo = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_cliente = $1
      `,
      [id_cliente]
    );

    return rowCount > 0;
  }
}

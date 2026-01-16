import pool from "../config/database";

export default class Estoque {
  /**
   * Cria estoque para um produto (se não existir)
   */
  static async criarParaProduto(id_produto: number) {
    const { rows } = await pool.query(
      `
      INSERT INTO estoque (id_produto, quantidade_total, quantidade_reservada)
      VALUES ($1, 0, 0)
      RETURNING *
      `,
      [id_produto]
    );

    return rows[0];
  }

  /**
   * Busca estoque pelo produto
   */
  static async buscarPorProduto(id_produto: number) {
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

  /**
   * Entrada de estoque (aumenta TOTAL)
   */
  static async entrada(id_produto: number, quantidade: number) {
    const { rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_total = quantidade_total + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $2
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    return rows[0];
  }

  /**
   * Baixa manual (diminui TOTAL, respeitando reservado)
   */
  static async baixar(id_produto: number, quantidade: number) {
    const { rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_total = quantidade_total - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $2
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    return rows[0];
  }

  /**
   * Reserva de estoque
   */
  static async reservar(id_produto: number, quantidade: number) {
    const { rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_reservada = quantidade_reservada + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $2
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    return rows[0];
  }

  /**
   * Liberação de reserva
   */
  static async liberarReserva(id_produto: number, quantidade: number) {
    const { rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_reservada = quantidade_reservada - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $2
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    return rows[0];
  }

  /**
   * Baixa de estoque reservado (confirmação)
   */
  static async baixarReservado(id_produto: number, quantidade: number) {
    const { rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_total = quantidade_total - $1,
        quantidade_reservada = quantidade_reservada - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $2
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    return rows[0];
  }
}

import pool from "../config/database";
import AppError from "../utils/AppError";

export default class Estoque {
  /**
   * Cria estoque para um produto (se não existir)
   */
  static async criarParaProduto(id_produto: number) {
    const { rows } = await pool.query(
      `
      INSERT INTO estoque (id_produto, quantidade_atual, quantidade_reservada)
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
   * Entrada de estoque (aumenta quantidade_atual)
   */
  static async entrada(id_produto: number, quantidade: number) {
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

  /**
   * Baixa manual (diminui quantidade_atual)
   * Regras de negócio ficam no Service
   */
  static async baixar(id_produto: number, quantidade: number) {
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

  /**
   * Reserva de estoque (BLINDADA contra concorrência)
   */
  static async reservar(id_produto: number, quantidade: number) {
    const { rowCount, rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_reservada = quantidade_reservada + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id_produto = $2
        AND (quantidade_atual - quantidade_reservada) >= $1
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    if (rowCount === 0) {
      throw new AppError("Estoque insuficiente para reserva", 409);
    }

    return rows[0];
  }

  /**
   * Liberação de reserva (BLINDADA)
   */
  static async liberarReserva(id_produto: number, quantidade: number) {
    const { rowCount, rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_reservada = quantidade_reservada - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id_produto = $2
        AND quantidade_reservada >= $1
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    if (rowCount === 0) {
      throw new AppError("Reserva insuficiente para liberação", 409);
    }

    return rows[0];
  }

  /**
   * Baixa de estoque reservado (confirmação) (BLINDADA)
   */
  static async baixarReservado(id_produto: number, quantidade: number) {
    const { rowCount, rows } = await pool.query(
      `
      UPDATE estoque
      SET
        quantidade_atual = quantidade_atual - $1,
        quantidade_reservada = quantidade_reservada - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id_produto = $2
        AND quantidade_reservada >= $1
      RETURNING *
      `,
      [quantidade, id_produto]
    );

    if (rowCount === 0) {
      throw new AppError("Reserva insuficiente para baixa", 409);
    }

    return rows[0];
  }
}

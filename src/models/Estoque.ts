import pool from "@/config/database";

export interface EstoqueRow {
  id_estoque: number;
  id_produto: number;
  quantidade_atual: number;
  quantidade_reservada: number;
  created_at: Date;
  updated_at: Date;
}

export default class Estoque {
  /**
   * Buscar estoque por produto
   */
  static async buscarPorProduto(
    id_produto: number
  ): Promise<EstoqueRow | null> {
    const { rows } = await pool.query<EstoqueRow>(
      `
      SELECT *
      FROM estoque
      WHERE id_produto = $1
      `,
      [id_produto]
    );

    return rows[0] ?? null;
  }

  /**
   * Criar registro de estoque para produto novo
   */
  static async criarParaProduto(
    id_produto: number
  ): Promise<EstoqueRow> {
    const { rows } = await pool.query<EstoqueRow>(
      `
      INSERT INTO estoque
        (id_produto, quantidade_atual, quantidade_reservada)
      VALUES
        ($1, 0, 0)
      RETURNING *
      `,
      [id_produto]
    );

    return rows[0];
  }

  /**
   * Aumentar o TOTAL do estoque
   */
  static async aumentarTotal(
    id_produto: number,
    quantidade: number
  ): Promise<EstoqueRow> {
    const { rows } = await pool.query<EstoqueRow>(
      `
      UPDATE estoque
      SET quantidade_atual = quantidade_atual + $2,
          updated_at = NOW()
      WHERE id_produto = $1
      RETURNING *
      `,
      [id_produto, quantidade]
    );

    return rows[0];
  }

  /**
   * Diminuir o TOTAL do estoque
   */
  static async diminuirTotal(
    id_produto: number,
    quantidade: number
  ): Promise<EstoqueRow> {
    const { rows, rowCount } = await pool.query<EstoqueRow>(
      `
      UPDATE estoque
      SET quantidade_atual = quantidade_atual - $2,
          updated_at = NOW()
      WHERE id_produto = $1
        AND quantidade_atual >= $2
      RETURNING *
      `,
      [id_produto, quantidade]
    );

    if (!rowCount) {
      throw new Error("Estoque insuficiente");
    }

    return rows[0];
  }

  /**
   * Aumentar reserva
   */
  static async aumentarReserva(
    id_produto: number,
    quantidade: number
  ): Promise<EstoqueRow> {
    const { rows } = await pool.query<EstoqueRow>(
      `
      UPDATE estoque
      SET quantidade_reservada = quantidade_reservada + $2,
          updated_at = NOW()
      WHERE id_produto = $1
      RETURNING *
      `,
      [id_produto, quantidade]
    );

    return rows[0];
  }

  /**
   * Diminuir reserva
   */
  static async diminuirReserva(
    id_produto: number,
    quantidade: number
  ): Promise<EstoqueRow> {
    const { rows, rowCount } = await pool.query<EstoqueRow>(
      `
      UPDATE estoque
      SET quantidade_reservada = quantidade_reservada - $2,
          updated_at = NOW()
      WHERE id_produto = $1
        AND quantidade_reservada >= $2
      RETURNING *
      `,
      [id_produto, quantidade]
    );

    if (!rowCount) {
      throw new Error("Reserva insuficiente");
    }

    return rows[0];
  }

  /**
   * Baixa de estoque reservado
   * (confirmação do pedido)
   */
  static async baixarReservado(
    id_produto: number,
    quantidade: number
  ): Promise<EstoqueRow> {
    const { rows, rowCount } = await pool.query<EstoqueRow>(
      `
      UPDATE estoque
      SET quantidade_atual = quantidade_atual - $2,
          quantidade_reservada = quantidade_reservada - $2,
          updated_at = NOW()
      WHERE id_produto = $1
        AND quantidade_reservada >= $2
      RETURNING *
      `,
      [id_produto, quantidade]
    );

    if (!rowCount) {
      throw new Error("Reserva insuficiente");
    }

    return rows[0];
  }
}

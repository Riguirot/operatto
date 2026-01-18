import pool from "../config/database";

/**
 * Tipos
 */
export type StatusPedido =
  | "ABERTO"
  | "CONFIRMADO"
  | "EM_PRODUCAO"
  | "FINALIZADO"
  | "CANCELADO";

export type EstadoFSM =
  | "ABERTO"
  | "CONFIRMADO"
  | "EM_PRODUCAO"
  | "FINALIZADO"
  | "CANCELADO";

export interface CriarPedidoInput {
  id_cliente?: number | null;
  status?: StatusPedido;
}

export interface PedidoRow {
  id_pedido: number;
  id_cliente: number | null;
  status: StatusPedido;
  created_at: Date;
  updated_at: Date | null;
}

export default class Pedido {
  /**
   * Criar pedido
   */
  static async criar({
    id_cliente = null,
    status = "ABERTO",
  }: CriarPedidoInput): Promise<PedidoRow> {
    const { rows } = await pool.query<PedidoRow>(
      `
      INSERT INTO pedido
        (id_cliente, status)
      VALUES
        ($1, $2)
      RETURNING *
      `,
      [id_cliente, status]
    );

    return rows[0];
  }

  /**
   * Buscar pedido por ID
   */
  static async buscarPorId(
    id_pedido: number
  ): Promise<PedidoRow | undefined> {
    const { rows } = await pool.query<PedidoRow>(
      `
      SELECT *
      FROM pedido
      WHERE id_pedido = $1
      `,
      [id_pedido]
    );

    return rows[0];
  }

  /**
   * Atualizar status do pedido
   */
  static async atualizarStatus(
    id_pedido: number,
    status: StatusPedido
  ): Promise<PedidoRow> {
    const { rows } = await pool.query<PedidoRow>(
      `
      UPDATE pedido
      SET status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_pedido = $2
      RETURNING *
      `,
      [status, id_pedido]
    );

    return rows[0];
  }
}

import pool from "../config/database.js";

export default class ItemPedido {
  static async adicionar({
    id_pedido,
    id_produto,
    quantidade,
    preco_unitario
  }) {
    const subtotal = quantidade * preco_unitario;

    const { rows } = await pool.query(
      `
      INSERT INTO item_pedido
        (id_pedido, id_produto, quantidade, preco_unitario, subtotal)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [id_pedido, id_produto, quantidade, preco_unitario, subtotal]
    );

    // Atualiza o valor total do pedido
    await pool.query(
      `
      UPDATE pedido
      SET valor_total = (
        SELECT SUM(subtotal)
        FROM item_pedido
        WHERE id_pedido = $1
      ),
      updated_at = CURRENT_TIMESTAMP
      WHERE id_pedido = $1
      `,
      [id_pedido]
    );

    return rows[0];
  }

  static async listarPorPedido(id_pedido) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM item_pedido
      WHERE id_pedido = $1
      `,
      [id_pedido]
    );

    return rows;
  }
}

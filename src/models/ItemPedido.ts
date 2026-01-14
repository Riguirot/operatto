import pool from "../config/database";

type ItemPedidoInput = {
  id_pedido: number;
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
};

type ItemPedidoRow = {
  id: number;
  id_pedido: number;
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  created_at: Date;
};

export default class ItemPedido {
  static async adicionar({
    id_pedido,
    id_produto,
    quantidade,
    preco_unitario,
  }: ItemPedidoInput): Promise<ItemPedidoRow> {
    const { rows } = await pool.query<ItemPedidoRow>(
      `
      INSERT INTO item_pedido
        (id_pedido, id_produto, quantidade, preco_unitario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [id_pedido, id_produto, quantidade, preco_unitario]
    );

    // Atualiza o valor total do pedido
    await pool.query(
      `
      UPDATE pedido
      SET valor_total = (
        SELECT SUM(quantidade * preco_unitario)
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

  static async listarPorPedido(id_pedido: number): Promise<ItemPedidoRow[]> {
    const { rows } = await pool.query<ItemPedidoRow>(
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

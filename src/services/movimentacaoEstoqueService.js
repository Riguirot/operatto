import pool from "../config/database.js";

export async function registrarMovimentacao({
  id_produto,
  tipo,
  quantidade,
  origem,
  observacao
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // registra movimentação
    await client.query(
      `
      INSERT INTO movimentacao_estoque
        (id_produto, tipo, quantidade, origem, observacao)
      VALUES
        ($1, $2, $3, $4, $5)
      `,
      [id_produto, tipo, quantidade, origem, observacao]
    );

    // atualiza estoque
    const operador = tipo === "ENTRADA" ? "+" : "-";

    await client.query(
      `
      UPDATE estoque
      SET quantidade_atual = quantidade_atual ${operador} $1
      WHERE id_produto = $2
      `,
      [quantidade, id_produto]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


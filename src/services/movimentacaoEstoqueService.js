import pool from "../config/database.js";

export async function registrarMovimentacao(dados) {
  const { id_produto, tipo, quantidade, origem, observacao } = dados;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertMov = `
      INSERT INTO movimentacao_estoque
      (id_produto, tipo, quantidade, origem, observacao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const movResult = await client.query(insertMov, [
      id_produto,
      tipo,
      quantidade,
      origem,
      observacao
    ]);

    const updateEstoque = `
      UPDATE estoque
      SET quantidade_atual = 
        CASE 
          WHEN $2 = 'ENTRADA' THEN quantidade_atual + $3
          ELSE quantidade_atual - $3
        END
      WHERE id_produto = $1;
    `;

    await client.query(updateEstoque, [id_produto, tipo, quantidade]);

    await client.query("COMMIT");

    return movResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

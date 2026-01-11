import pool from "../config/database.js";

export type TipoMovimentacaoEstoque =
  | "ENTRADA"
  | "BAIXA"
  | "RESERVA"
  | "ESTORNO";

interface RegistrarMovimentacaoInput {
  id_produto: number;
  tipo: TipoMovimentacaoEstoque;
  quantidade: number;
  origem: string;
  observacao?: string | null;
}

class MovimentacaoEstoque {
  static async registrar({
    id_produto,
    tipo,
    quantidade,
    origem,
    observacao = null,
  }: RegistrarMovimentacaoInput) {
    const { rows } = await pool.query(
      `
      INSERT INTO movimentacao_estoque
        (id_produto, tipo, quantidade, origem, observacao)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [id_produto, tipo, quantidade, origem, observacao]
    );

    return rows[0];
  }

  static async listarPorProduto(id_produto: number) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM movimentacao_estoque
      WHERE id_produto = $1
      ORDER BY created_at DESC
      `,
      [id_produto]
    );

    return rows;
  }
}

export default MovimentacaoEstoque;

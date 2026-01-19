import pool from "../config/database";

/**
 * Tipos
 */
export type StatusOrdemProducao =
  | "PLANEJADA"
  | "EM_PRODUCAO"
  | "FINALIZADA"
  | "CANCELADA";

export interface CriarOrdemProducaoInput {
  id_produto: number;
  quantidade: number;
  status?: StatusOrdemProducao;
}

export interface OrdemProducaoRow {
  id_ordem_producao: number;
  id_produto: number;
  quantidade: number;
  status: StatusOrdemProducao;
  created_at: Date;
  updated_at: Date | null;
}

export default class OrdemProducao {
  /**
   * Criar ordem de produção
   */
  static async criar({
    id_produto,
    quantidade,
    status = "PLANEJADA",
  }: CriarOrdemProducaoInput): Promise<OrdemProducaoRow> {
    const { rows } = await pool.query<OrdemProducaoRow>(
      `
      INSERT INTO ordem_producao
        (id_produto, quantidade, status)
      VALUES
        ($1, $2, $3)
      RETURNING *
      `,
      [id_produto, quantidade, status]
    );

    return rows[0];
  }

  /**
   * Buscar ordem por ID
   */
  static async buscarPorId(
    id_ordem_producao: number
  ): Promise<OrdemProducaoRow | undefined> {
    const { rows } = await pool.query<OrdemProducaoRow>(
      `
      SELECT *
      FROM ordem_producao
      WHERE id_ordem_producao = $1
      `,
      [id_ordem_producao]
    );

    return rows[0];
  }

  /**
   * Listar ordens de produção
   */
  static async listar(): Promise<OrdemProducaoRow[]> {
    const { rows } = await pool.query<OrdemProducaoRow>(
      `
      SELECT *
      FROM ordem_producao
      ORDER BY created_at DESC
      `
    );

    return rows;
  }

  /**
   * Atualizar status da ordem
   */
  static async atualizarStatus(
    id_ordem_producao: number,
    status: StatusOrdemProducao
  ): Promise<OrdemProducaoRow> {
    const { rows } = await pool.query<OrdemProducaoRow>(
      `
      UPDATE ordem_producao
      SET status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_ordem_producao = $2
      RETURNING *
      `,
      [status, id_ordem_producao]
    );

    return rows[0];
  }
}

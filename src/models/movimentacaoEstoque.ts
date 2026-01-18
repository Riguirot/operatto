import pool from "../config/database";

/**
 * Tipos de movimentação de estoque
 */
export type TipoMovimentacao =
  | "ENTRADA"
  | "BAIXA"
  | "RESERVA"
  | "LIBERACAO_RESERVA"
  | "BAIXA_RESERVADA";

/**
 * Input para criar movimentação
 */
export interface CriarMovimentacaoInput {
  id_produto: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  origem: string | null;
  observacao?: string | null;
}

/**
 * Row retornada do banco
 */
export interface MovimentacaoEstoqueRow {
  id_movimentacao: number;
  id_produto: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  origem: string | null;
  observacao: string | null;
  created_at: Date;
}

export default class MovimentacaoEstoque {
  /**
   * Criar movimentação de estoque (método base)
   */
  static async create({
    id_produto,
    tipo,
    quantidade,
    origem = null,
    observacao = null,
  }: CriarMovimentacaoInput): Promise<MovimentacaoEstoqueRow> {
    const { rows } = await pool.query<MovimentacaoEstoqueRow>(
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

  /**
   * Alias semântico usado pelo Service
   * (regra de negócio chama "registrar")
   */
  static async registrar(
    dados: CriarMovimentacaoInput
  ): Promise<MovimentacaoEstoqueRow> {
    return this.create(dados);
  }

  /**
   * Listar movimentações por produto
   */
  static async findByProduto(
    id_produto: number
  ): Promise<MovimentacaoEstoqueRow[]> {
    const { rows } = await pool.query<MovimentacaoEstoqueRow>(
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

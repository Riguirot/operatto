import pool from "../config/database";

/**
 * Tipos
 */
export interface CriarProdutoInput {
  nome: string;
  descricao: string;
  unidade_medida: string;
  preco_venda: number;
}

export interface ProdutoRow {
  id_produto: number;
  nome: string;
  descricao: string;
  unidade_medida: string;
  preco_venda: number;
  ativo: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export default class Produto {
  /**
   * Criar produto
   */
  static async criar({
    nome,
    descricao,
    unidade_medida,
    preco_venda,
  }: CriarProdutoInput): Promise<ProdutoRow> {
    const { rows } = await pool.query<ProdutoRow>(
      `
      INSERT INTO produto
        (nome, descricao, unidade_medida, preco_venda)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [nome, descricao, unidade_medida, preco_venda]
    );

    return rows[0];
  }

  /**
   * Buscar produto por ID
   */
  static async buscarPorId(
    id_produto: number
  ): Promise<ProdutoRow | undefined> {
    const { rows } = await pool.query<ProdutoRow>(
      `
      SELECT *
      FROM produto
      WHERE id_produto = $1
      `,
      [id_produto]
    );

    return rows[0];
  }

  /**
   * Listar produtos ativos
   */
  static async listar(): Promise<ProdutoRow[]> {
    const { rows } = await pool.query<ProdutoRow>(
      `
      SELECT *
      FROM produto
      WHERE ativo = true
      ORDER BY nome
      `
    );

    return rows;
  }

  /**
   * Atualizar produto (parcial)
   */
  static async atualizar(
    id_produto: number,
    dados: Partial<Omit<CriarProdutoInput, "nome"> & { nome: string }>
  ): Promise<ProdutoRow> {
    const campos: string[] = [];
    const valores: any[] = [];
    let index = 1;

    for (const campo in dados) {
      campos.push(`${campo} = $${index}`);
      valores.push((dados as any)[campo]);
      index++;
    }

    valores.push(id_produto);

    const { rows } = await pool.query<ProdutoRow>(
      `
      UPDATE produto
      SET ${campos.join(", ")},
          updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $${index}
      RETURNING *
      `,
      valores
    );

    return rows[0];
  }

  /**
   * Desativar produto
   */
  static async desativar(id_produto: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      `
      UPDATE produto
      SET ativo = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $1
      `,
      [id_produto]
    );

    return (rowCount ?? 0) > 0;
  }
}

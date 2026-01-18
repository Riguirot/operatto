import pool from "../config/database.js";

/**
 * Tipos
 */
export interface CriarClienteInput {
  nome: string;
  documento: string;
  telefone: string;
  email: string;
}

export interface ClienteRow {
  id_cliente: number;
  nome: string;
  documento: string;
  telefone: string;
  email: string;
  ativo: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export default class Cliente {
  /**
   * Criar cliente
   */
  static async criar({
    nome,
    documento,
    telefone,
    email,
  }: CriarClienteInput): Promise<ClienteRow> {
    const { rows } = await pool.query<ClienteRow>(
      `
      INSERT INTO cliente
        (nome, documento, telefone, email)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [nome, documento, telefone, email]
    );

    return rows[0];
  }

  /**
   * Buscar cliente por ID
   */
  static async buscarPorId(
    id_cliente: number
  ): Promise<ClienteRow | undefined> {
    const { rows } = await pool.query<ClienteRow>(
      `
      SELECT *
      FROM cliente
      WHERE id_cliente = $1
      `,
      [id_cliente]
    );

    return rows[0];
  }

  /**
   * Listar clientes ativos
   */
  static async listar(): Promise<ClienteRow[]> {
    const { rows } = await pool.query<ClienteRow>(
      `
      SELECT *
      FROM cliente
      WHERE ativo = true
      ORDER BY nome
      `
    );

    return rows;
  }

  /**
   * Desativar cliente
   */
  static async desativar(id_cliente: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      `
      UPDATE cliente
      SET ativo = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_cliente = $1
      `,
      [id_cliente]
    );

    return (rowCount ?? 0) > 0;
  }
}

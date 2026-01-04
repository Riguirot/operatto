import pool from "../config/database.js";

export default class Produto {
  static async criar({
    nome,
    descricao,
    unidade_medida,
    preco_venda
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO produto
        (nome, descricao, unidade_medida, preco_venda)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [nome, descricao, unidade_medida, preco_venda]
    );

    return rows[0];
  }

  static async buscarPorId(id_produto) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM produto
      WHERE id_produto = $1
      `,
      [id_produto]
    );

    return rows[0];
  }

  static async listar() {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM produto
      WHERE ativo = true
      ORDER BY nome
      `
    );

    return rows;
  }

  static async atualizar(id_produto, dados) {
    const campos = [];
    const valores = [];
    let index = 1;

    for (const campo in dados) {
      campos.push(`${campo} = $${index}`);
      valores.push(dados[campo]);
      index++;
    }

    valores.push(id_produto);

    const { rows } = await pool.query(
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

  static async desativar(id_produto) {
    const { rowCount } = await pool.query(
      `
      UPDATE produto
      SET ativo = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE id_produto = $1
      `,
      [id_produto]
    );

    return rowCount > 0;
  }
}

import pool from "../config/database";
import Pedido from "../models/Pedido";
import AppError from "../utils/AppError";

import type {
  StatusPedido,
  AtualizarStatusPedidoInput,
} from "../schemas/pedido.schema";

class PedidoService {
  static async buscarPorId(id_pedido: number) {
    return Pedido.buscarPorId(id_pedido);
  }
  static async criarPedido({
    cliente_id,
    itens,
  }: {
    cliente_id: number;
    itens: {
      id_produto: number;
      quantidade: number;
    }[];
  }) {
    if (!itens || itens.length === 0) {
      throw new AppError("Pedido sem itens", 400);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1️⃣ cria o pedido
      const { rows: pedidoRows } = await client.query(
        `
        INSERT INTO pedidos (cliente_id, status)
        VALUES ($1, 'ABERTO')
        RETURNING *
        `,
        [cliente_id]
      );

      const pedido = pedidoRows[0];

      // 2️⃣ processa itens + reserva estoque
      for (const item of itens) {
        if (item.quantidade <= 0) {
          throw new AppError("Quantidade inválida no pedido", 400);
        }

        // cria item do pedido
        await client.query(
          `
          INSERT INTO pedido_itens (id_pedido, id_produto, quantidade)
          VALUES ($1, $2, $3)
          `,
          [pedido.id, item.id_produto, item.quantidade]
        );

        // 🔒 reserva estoque (SQL blindado)
        const { rowCount } = await client.query(
          `
          UPDATE estoque
          SET
            quantidade_reservada = quantidade_reservada + $1,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id_produto = $2
            AND (quantidade_total - quantidade_reservada) >= $1
          `,
          [item.quantidade, item.id_produto]
        );

        if (rowCount === 0) {
          throw new AppError(
            `Estoque insuficiente para o produto ${item.id_produto}`,
            409
          );
        }

        // movimentação
        await client.query(
          `
          INSERT INTO movimentacao_estoque
          (id_produto, tipo, quantidade, origem, observacao)
          VALUES ($1, 'RESERVA', $2, 'PEDIDO', 'Reserva ao criar pedido')
          `,
          [item.id_produto, item.quantidade]
        );
      }

      await client.query("COMMIT");

      return pedido;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async atualizarStatusPedido({
    id_pedido,
    status,
  }: AtualizarStatusPedidoInput & { id_pedido: number }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const pedido = await Pedido.buscarPorId(id_pedido);

      if (!pedido) {
        throw new AppError("Pedido não encontrado", 404);
      }

      const statusAtual: StatusPedido = pedido.status;

      const transicoesPermitidas: Record<
        StatusPedido,
        StatusPedido[]
      > = {
        ABERTO: ["EM_PRODUCAO", "CANCELADO"],
        EM_PRODUCAO: ["FINALIZADO", "CANCELADO"],
        FINALIZADO: [],
        CANCELADO: [],
      };

      if (
        !transicoesPermitidas[statusAtual].includes(status)
      ) {
        throw new AppError(
          "Transição de status não permitida",
          400
        );
      }

      /**
       * 🔒 REGRAS DE NEGÓCIO COM ESTOQUE
       */
      if (statusAtual === "ABERTO" && status === "EM_PRODUCAO") {
        // 👉 reserva de estoque já deve existir
        // aqui só garantimos coerência
      }

      if (status === "FINALIZADO") {
        // 🔥 CONFIRMA BAIXA DO ESTOQUE RESERVADO
        const { rows: itens } = await client.query(
          `
          SELECT id_produto, quantidade
          FROM pedido_itens
          WHERE id_pedido = $1
          `,
          [id_pedido]
        );

        for (const item of itens) {
          const { rowCount } = await client.query(
            `
            UPDATE estoque
            SET
              quantidade_total = quantidade_total - $1,
              quantidade_reservada = quantidade_reservada - $1,
              updated_at = CURRENT_TIMESTAMP
            WHERE
              id_produto = $2
              AND quantidade_reservada >= $1
            `,
            [item.quantidade, item.id_produto]
          );

          if (rowCount === 0) {
            throw new AppError(
              "Erro ao confirmar estoque reservado",
              409
            );
          }

          await client.query(
            `
            INSERT INTO movimentacao_estoque
            (id_produto, tipo, quantidade, origem, observacao)
            VALUES ($1, 'BAIXA_RESERVADA', $2, 'PEDIDO', 'Finalização de pedido')
            `,
            [item.id_produto, item.quantidade]
          );
        }
      }

      if (status === "CANCELADO") {
        // 🔓 LIBERA RESERVA
        const { rows: itens } = await client.query(
          `
          SELECT id_produto, quantidade
          FROM pedido_itens
          WHERE id_pedido = $1
          `,
          [id_pedido]
        );

        for (const item of itens) {
          const { rowCount } = await client.query(
            `
            UPDATE estoque
            SET
              quantidade_reservada = quantidade_reservada - $1,
              updated_at = CURRENT_TIMESTAMP
            WHERE
              id_produto = $2
              AND quantidade_reservada >= $1
            `,
            [item.quantidade, item.id_produto]
          );

          if (rowCount === 0) {
            throw new AppError(
              "Erro ao liberar reserva de estoque",
              409
            );
          }

          await client.query(
            `
            INSERT INTO movimentacao_estoque
            (id_produto, tipo, quantidade, origem, observacao)
            VALUES ($1, 'LIBERACAO_RESERVA', $2, 'PEDIDO', 'Cancelamento de pedido')
            `,
            [item.id_produto, item.quantidade]
          );
        }
      }

      const pedidoAtualizado = await Pedido.atualizarStatus(
        id_pedido,
        status
      );

      await client.query("COMMIT");

      return pedidoAtualizado;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default PedidoService;
import pool from "@/config/database";
import Pedido, { EstadoFSM } from "@/models/Pedido";
import AppError from "@/utils/AppError";

import type {
  StatusPedido,
  AtualizarStatusPedidoInput,
} from "@/schemas/pedido.schema";

class PedidoService {
  /* ===========================
   * BUSCAR PEDIDO
   * =========================== */
  static async buscarPorId(id_pedido: number) {
    return Pedido.buscarPorId(id_pedido);
  }

  /* ===========================
   * CRIAR PEDIDO
   * =========================== */
  static async criarPedido({
    id_cliente,
    itens,
  }: {
    id_cliente: number;
    itens: {
      id_produto: number;
      quantidade: number;
    }[];
  }) {
    console.log("[PedidoService] criarPedido chamado");
    console.log("id_cliente:", id_cliente);
    console.log("itens:", itens);

    if (!id_cliente) {
      throw new AppError("id_cliente é obrigatório", 400);
    }

    if (!itens || itens.length === 0) {
      throw new AppError("Pedido sem itens", 400);
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      console.log("BEGIN transaction");

      /* 1️⃣ Criar pedido */
      const { rows: pedidoRows } = await client.query(
        `
        INSERT INTO pedido (id_cliente, status, valor_total)
        VALUES ($1, 'ABERTO', 0)
        RETURNING *
        `,
        [id_cliente]
      );

      const pedido = pedidoRows[0];
      console.log("Pedido criado:", pedido);

      let valorTotal = 0;

      /* 2️⃣ Criar itens + reservar estoque */
      for (const item of itens) {
        if (item.quantidade <= 0) {
          throw new AppError("Quantidade inválida no pedido", 400);
        }

        /* 🔎 Buscar preço do produto */
        const { rows: produtoRows } = await client.query(
          `
          SELECT id_produto, preco_venda
          FROM produto
          WHERE id_produto = $1
          `,
          [item.id_produto]
        );

        if (produtoRows.length === 0) {
          throw new AppError(
            `Produto ${item.id_produto} não encontrado`,
            404
          );
        }

        const precoUnitario = produtoRows[0].preco_venda;
        const valorItem = precoUnitario * item.quantidade;
        valorTotal += valorItem;

        /* 📦 Criar item do pedido */
        await client.query(
          `
          INSERT INTO item_pedido
            (id_pedido, id_produto, quantidade, preco_unitario)
          VALUES
            ($1, $2, $3, $4)
          `,
          [
            pedido.id_pedido,
            item.id_produto,
            item.quantidade,
            precoUnitario,
          ]
        );

        /* 🔒 Reservar estoque (blindado) */
        const { rowCount } = await client.query(
          `
          UPDATE estoque
          SET
            quantidade_reservada = quantidade_reservada + $1,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id_produto = $2
            AND (quantidade_atual - quantidade_reservada) >= $1
          `,
          [item.quantidade, item.id_produto]
        );

        if (rowCount === 0) {
          throw new AppError(
            `Estoque insuficiente para o produto ${item.id_produto}`,
            409
          );
        }

        /* 🧾 Movimentação */
        await client.query(
          `
          INSERT INTO movimentacao_estoque
            (id_produto, tipo, quantidade, origem, observacao)
          VALUES
            ($1, 'RESERVA', $2, 'PEDIDO', 'Reserva ao criar pedido')
          `,
          [item.id_produto, item.quantidade]
        );
      }

      /* 💰 Atualizar valor total do pedido */
      await client.query(
        `
        UPDATE pedido
        SET valor_total = $1
        WHERE id_pedido = $2
        `,
        [valorTotal, pedido.id_pedido]
      );

      await client.query("COMMIT");
      console.log("COMMIT transaction");

      return {
        ...pedido,
        valor_total: valorTotal,
      };
    } catch (error) {
      console.error("🔥 ERRO AO CRIAR PEDIDO");
      console.error(error);

      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /* ===========================
   * ATUALIZAR STATUS DO PEDIDO
   * =========================== */
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

      const statusAtual = pedido.status as EstadoFSM;

      const transicoesPermitidas: Record<EstadoFSM, EstadoFSM[]> = {
          ABERTO: ["CONFIRMADO", "CANCELADO"],

          CONFIRMADO: ["EM_PRODUCAO", "CANCELADO"],

          EM_PRODUCAO: ["FINALIZADO", "CANCELADO"],

          FINALIZADO: [],

          CANCELADO: [],
      };


      if (!transicoesPermitidas[statusAtual].includes(status)) {
        throw new AppError("Transição de status não permitida", 400);
      }

      /* FINALIZAR → BAIXAR ESTOQUE */
      if (status === "FINALIZADO") {
        const { rows: itens } = await client.query(
          `
          SELECT id_produto, quantidade
          FROM item_pedido
          WHERE id_pedido = $1
          `,
          [id_pedido]
        );

        for (const item of itens) {
          const { rowCount } = await client.query(
            `
            UPDATE estoque
            SET
              quantidade_atual = quantidade_atual - $1,
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
            VALUES
              ($1, 'BAIXA_RESERVADA', $2, 'PEDIDO', 'Finalização do pedido')
            `,
            [item.id_produto, item.quantidade]
          );
        }
      }

      /* CANCELAR → LIBERAR ESTOQUE */
      if (status === "CANCELADO") {
        const { rows: itens } = await client.query(
          `
          SELECT id_produto, quantidade
          FROM item_pedido
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
            VALUES
              ($1, 'LIBERACAO_RESERVA', $2, 'PEDIDO', 'Cancelamento do pedido')
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

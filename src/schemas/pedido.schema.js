import { z } from "zod";

/**
 * Status permitidos para o pedido
 */
export const statusPedidoEnum = z.enum([
  "ABERTO",
  "EM_PRODUCAO",
  "FINALIZADO",
  "CANCELADO"
]);

/**
 * Schema para criação de pedido
 * (POST /pedidos)
 */
export const criarPedidoSchema = z.object({
  id_cliente: z
    .number({
      required_error: "id_cliente é obrigatório",
      invalid_type_error: "id_cliente deve ser um número"
    })
    .int()
    .positive(),

  itens: z
    .array(
      z.object({
        id_produto: z.number().int().positive(),
        quantidade: z.number().int().positive()
      })
    )
    .min(1, "O pedido deve conter ao menos um item")
});


export const atualizarStatusPedidoSchema = z.object({
  status: statusPedidoEnum
});


export const pedidoIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID do pedido deve ser numérico")
});

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
 * Tipo inferido do enum de status
 */
export type StatusPedido = z.infer<typeof statusPedidoEnum>;

/**
 * Schema para criação de pedido
 * (POST /pedidos)
 */
export const criarPedidoSchema = z.object({
  id_cliente: z
  .number()
  .int("id_cliente deve ser um número inteiro")
  .positive("id_cliente deve ser positivo"),

  items: z
    .array(
      z.object({
        id_produto: z.number().int().positive(),
        quantidade: z.number().int().positive()
      })
    )
    .min(1, "O pedido deve conter ao menos um item")
});

/**
 * Tipo inferido para criação de pedido
 */
export type CriarPedidoInput = z.infer<typeof criarPedidoSchema>;

/**
 * Schema para atualização de status do pedido
 */
export const atualizarStatusPedidoSchema = z.object({
  status: statusPedidoEnum
});

/**
 * Tipo inferido para atualização de status
 */
export type AtualizarStatusPedidoInput = z.infer<
  typeof atualizarStatusPedidoSchema
>;

/**
 * Schema para parâmetros de rota
 */
export const pedidoIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID do pedido deve ser numérico")
});

/**
 * Tipo inferido para parâmetro de rota
 */
export type PedidoIdParam = z.infer<typeof pedidoIdParamSchema>;

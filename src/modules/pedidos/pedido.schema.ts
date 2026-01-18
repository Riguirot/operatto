import { z } from "zod";

export const criarPedidoWebSchema = z.object({
  clienteId: z.number().int().positive(),
  itens: z.array(
    z.object({
      produtoId: z.number().int().positive(),
      quantidade: z.number().int().positive(),
    })
  ).min(1),
});

import { z } from "zod";

export const criarEstoqueSchema = z.object({
  body: z.object({
    produtoId: z.string().uuid(),
    quantidade: z.number().int().min(0),
  }),
});

export const atualizarEstoqueSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    quantidade: z.number().int().min(0),
  }),
});

export const movimentarEstoqueSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    quantidade: z.number().int(),
  }),
});

import { z } from "zod";

export const movimentacaoSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().positive(),
  origem: z.string().min(1),
  observacao: z.string().optional()
});

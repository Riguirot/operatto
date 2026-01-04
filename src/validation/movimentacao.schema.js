import { z } from "zod";

export const movimentacaoSchema = z.object({
  id_produto: z.number().int().positive(),
  tipo: z.enum(["ENTRADA", "SAIDA"]),
  quantidade: z.number().positive(),
  origem: z.string().max(50).optional(),
  observacao: z.string().optional()
});

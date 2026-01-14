import { z } from "zod";

export const movimentacaoSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().positive(),
  origem: z.enum(["ENTRADA", "SAIDA"]),
  observacao: z.string().optional(),
});

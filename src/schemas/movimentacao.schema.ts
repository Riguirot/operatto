import { z } from "zod";

export const movimentacaoSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().int().positive(),
  origem: z.enum(["ENTRADA", "SAIDA"]),
  observacao: z.string().optional(),
});

export type MovimentacaoDTO = z.infer<typeof movimentacaoSchema>;

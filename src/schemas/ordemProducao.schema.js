import { z } from "zod";

export const ordemProducaoSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().positive()
});

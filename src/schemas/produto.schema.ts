import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().min(3),
  descricao: z.string().optional(),
  unidade_medida: z.string().min(1),
  preco_venda: z.number().positive()
});

/**
 * Tipo inferido automaticamente a partir do schema
 * Usado em services e controllers
 */
export type ProdutoInput = z.infer<typeof produtoSchema>;

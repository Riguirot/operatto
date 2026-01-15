import { z } from "zod";

export const estoqueBaseSchema = z.object({
  id_produto: z
    .number()
    .int("id_produto deve ser um número inteiro")
    .positive("id_produto deve ser positivo"),

  quantidade_disponivel: z
    .number()
    .int("Quantidade disponível deve ser inteiro")
    .min(0, "Quantidade disponível não pode ser negativa"),

  quantidade_reservada: z
    .number()
    .int("Quantidade reservada deve ser inteiro")
    .min(0, "Quantidade reservada não pode ser negativa"),
});


export const entradaEstoqueSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().int().positive(),
});

export const reservaEstoqueSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().int().positive(),
});

export const baixaEstoqueSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().int().positive(),
});

/** Tipos inferidos (opcional, mas recomendado) */
export type EstoqueBaseDTO = z.infer<typeof estoqueBaseSchema>;
export type EntradaEstoqueDTO = z.infer<typeof entradaEstoqueSchema>;
export type ReservaEstoqueDTO = z.infer<typeof reservaEstoqueSchema>;
export type BaixaEstoqueDTO = z.infer<typeof baixaEstoqueSchema>;

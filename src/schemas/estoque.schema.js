import { z } from "zod";


export const estoqueBaseSchema = z.object({
  id_produto: z
    .number({
      required_error: "id_produto é obrigatório",
      invalid_type_error: "id_produto deve ser numérico"
    })
    .int()
    .positive(),

  quantidade_disponivel: z
    .number()
    .int()
    .min(0, "Quantidade disponível não pode ser negativa"),

  quantidade_reservada: z
    .number()
    .int()
    .min(0, "Quantidade reservada não pode ser negativa")
});


export const entradaEstoqueSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().int().positive()
});


export const reservaEstoqueSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().int().positive()
});


export const baixaEstoqueSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade: z.number().int().positive()
});

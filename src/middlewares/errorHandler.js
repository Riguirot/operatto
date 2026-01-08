
// errorHandler
import { ZodError } from "zod";

export function errorHandler(err, req, res, next) {
  // Erros de validação
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      detalhes: err.errors
    });
  }

  // Erros do Postgres
  if (err.code) {
    return res.status(400).json({
      error: "Erro de banco de dados",
      detalhe: err.message
    });
  }

  // Erro genérico
  console.error(err);
  return res.status(500).json({
    error: "Erro interno do servidor"
  });
}

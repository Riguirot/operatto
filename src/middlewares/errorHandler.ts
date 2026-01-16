import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  /**
   * 🧪 Erros de validação (Zod)
   */
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos",
        details: err.issues,
      },
    });
  }

  /**
   * 🚨 Erros operacionais controlados (AppError)
   */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
      },
    });
  }

  /**
   * 💥 Erro inesperado (500)
   * Nunca vazar detalhes para o cliente
   */
  if (process.env.NODE_ENV !== "test") {
    console.error("Erro inesperado:", err);
  }

  return res.status(500).json({
    error: {
      message: "Erro interno do servidor",
    },
  });
}

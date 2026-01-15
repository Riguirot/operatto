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
   * 🔎 Erros de validação (Zod)
   */
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: err.issues, // 👈 correto no Zod
    });
  }

  /**
   * 🚨 Erros operacionais controlados
   */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  /**
   * 🧯 Erro inesperado (500)
   * Nunca vazar stack trace para o cliente
   */
  console.error("Erro inesperado:", err);

  return res.status(500).json({
    error: "Erro interno do servidor",
  });
}

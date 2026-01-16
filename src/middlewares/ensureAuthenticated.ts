import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export function ensureAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  /**
   * 🔒 FUTURO:
   * - validar JWT
   * - extrair usuário
   * - setar req.user
   */

  if (!req.user) {
    throw new AppError("Usuário não autenticado", 401);
  }

  return next();
}

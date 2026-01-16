import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export function ensureRole(role: "ADMIN" | "USER") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      throw new AppError("Acesso não autorizado", 403);
    }

    return next();
  };
}

import { Response } from "express";

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ data });
}

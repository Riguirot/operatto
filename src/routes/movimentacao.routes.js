import { Router } from "express";
import { criarMovimentacao } from "../controllers/movimentacaoController.js";
import { validate } from "../middlewares/validate.js";
import { movimentacaoSchema } from "../validation/movimentacao.schema.js";

const router = Router();

router.post(
  "/",
  validate(movimentacaoSchema),
  criarMovimentacao
);

export default router;



import { Router } from "express";
import MovimentacaoController from "../controllers/movimentacaoController";
import { validate } from "../middlewares/validate";
import { movimentacaoSchema } from "../schemas/movimentacao.schema";

const router = Router();

// POST /movimentacoes/entrada
router.post(
  "/entrada",
  validate(movimentacaoSchema),
  MovimentacaoController.entrada
);

// GET /movimentacoes/:idProduto
router.get(
  "/:idProduto",
  MovimentacaoController.listar
);

export default router;

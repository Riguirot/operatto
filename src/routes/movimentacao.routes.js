import { Router } from "express";
import MovimentacaoController from "../controllers/movimentacaoController.js";
import { validate } from "../middlewares/validate.js";
import { movimentacaoSchema } from "../validation/movimentacao.schema.js";

const router = Router();

router.post(
  "/entrada",
  validate(movimentacaoSchema), // 👈 AQUI É O PONTO-CHAVE
  MovimentacaoController.entrada // 👈 FUNÇÃO REAL
);

router.get(
  "/produto/:idProduto",
  MovimentacaoController.listar
);

export default router;

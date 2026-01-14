import { Router } from "express";
import MovimentacaoController from "../controllers/movimentacaoController";
import { validate } from "../middlewares/validate";
import { movimentacaoSchema } from "../schemas/movimentacao.schema";

const router = Router();

router.post(
  "/entrada",
  validate(movimentacaoSchema), 
  MovimentacaoController.entrada 
);

router.get(
  "/produto/:idProduto",
  MovimentacaoController.listar
);

export default router;

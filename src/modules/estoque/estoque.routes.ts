import { Router } from "express";
import EstoqueController from "./estoque.controller";
import { validate } from "../../middlewares/validate";
import {
  criarEstoqueSchema,
  atualizarEstoqueSchema,
  movimentarEstoqueSchema,
} from "./estoque.schema";

const router = Router();

router.post(
  "/",
  validate(criarEstoqueSchema),
  EstoqueController.criar
);

router.get("/", EstoqueController.listar);

router.get("/:id", EstoqueController.buscar);

router.put(
  "/:id",
  validate(atualizarEstoqueSchema),
  EstoqueController.atualizar
);

router.patch(
  "/:id/movimentar",
  validate(movimentarEstoqueSchema),
  EstoqueController.movimentar
);

export default router;

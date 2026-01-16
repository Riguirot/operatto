import { Router } from "express";
import EstoqueController from "../controllers/estoqueController";
import { validate } from "../middlewares/validate";

import {
  entradaEstoqueSchema,
  baixaEstoqueSchema,
  reservaEstoqueSchema,
} from "../schemas/estoque.schema";

const router = Router();

// 📥 Entrada manual
router.post(
  "/entrada",
  validate(entradaEstoqueSchema),
  EstoqueController.entrada
);

// 📤 Baixa manual
router.post(
  "/baixa",
  validate(baixaEstoqueSchema),
  EstoqueController.baixar
);

// 🔒 Fluxo ERP
router.post(
  "/reservar",
  validate(reservaEstoqueSchema),
  EstoqueController.reservar
);

router.post(
  "/liberar-reserva",
  validate(reservaEstoqueSchema),
  EstoqueController.liberarReserva
);

router.post(
  "/baixar-reservado",
  validate(reservaEstoqueSchema),
  EstoqueController.baixarReservado
);

export default router;

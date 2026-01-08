import { Router } from "express";
import PedidoController from "../controllers/pedidoController.js";

const router = Router();

router.get("/:id", PedidoController.buscarPedido);
router.patch("/:id/status", PedidoController.atualizarStatus);

export default router;

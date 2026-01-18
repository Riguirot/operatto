import { Router } from "express";
import PedidoController from "../controllers/pedidoController";

const router = Router();

router.post("/", PedidoController.criar);          // 👈 NOVO
router.get("/:id", PedidoController.buscarPedido);
router.patch("/:id/status", PedidoController.atualizarStatus);

export default router;

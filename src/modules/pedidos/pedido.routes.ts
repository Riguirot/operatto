import { Router } from "express";
import PedidoWebController from "./pedido.controller";

const router = Router();

/**
 * Pedido via Web
 */
router.post("/web", PedidoWebController.criar);

export default router;

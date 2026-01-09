import { Router } from "express";
import EstoqueController from "../controllers/estoqueController.js";

const router = Router();

router.post("/entrada", EstoqueController.entrada);
router.post("/baixa", EstoqueController.baixar);

export default router;

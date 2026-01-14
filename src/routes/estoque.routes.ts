import { Router } from "express";
import EstoqueController from "../controllers/estoqueController";

const router = Router();

router.post("/entrada", EstoqueController.entrada);
router.post("/baixa", EstoqueController.baixar);

export default router;

import { Router } from "express";
import produtosRoutes from "./produtos.routes.js";
import movimentacaoEstoqueRoutes from "./movimentacao_routes.routes.js"

const router = Router();

router.use("/produtos", produtosRoutes);

export default router;

import { Router } from "express";

import healthRoutes from "./health.routes.js";
import produtosRoutes from "./produtos.routes.js";
import pedidosRoutes from "./pedidos.routes.js";
import estoqueRoutes from "./estoque.routes.js";
import movimentacaoRoutes from "./movimentacao.routes.js";

const routes = Router();

// ⚠️ HEALTH SEMPRE PRIMEIRO
routes.use("/", healthRoutes);

routes.use("/produtos", produtosRoutes);
routes.use("/pedidos", pedidosRoutes);
routes.use("/estoque", estoqueRoutes);
routes.use("/movimentacoes", movimentacaoRoutes);

export default routes;

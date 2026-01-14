import { Router } from "express";

import healthRoutes from "./health.routes";
import produtosRoutes from "./produtos.routes";
import pedidosRoutes from "./pedidos.routes";
import estoqueRoutes from "./estoque.routes";
import movimentacaoRoutes from "./movimentacao.routes";

const routes = Router();

routes.use("/", healthRoutes);
routes.use("/produtos", produtosRoutes);
routes.use("/pedidos", pedidosRoutes);
routes.use("/estoque", estoqueRoutes);
routes.use("/movimentacoes", movimentacaoRoutes);

export default routes;

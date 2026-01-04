import { Router } from "express";
import produtosRoutes from "./produtos.routes.js";

const router = Router();

router.use("/produtos", produtosRoutes);

export default router;

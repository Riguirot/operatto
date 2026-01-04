import { Router } from "express";

const router = Router();

// placeholder
router.get("/", (req, res) => {
  res.json({ message: "Pedidos route OK (em construção)" });
});

export default router;

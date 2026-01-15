import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { apiLimiter } from "./middlewares/rateLimit";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();

const swaggerDocument = YAML.load(
  path.resolve("src/docs/swagger.yaml")
);

// 🔒 Segurança primeiro
app.use(helmet());
app.use(apiLimiter);
app.use(
  cors({
    origin: ["http://localhost:5173"], // depois trocar por domínio real
  })
);

// 📦 Parsing
app.use(express.json());

// 🚦 Rotas
app.use(routes);

// 📘 Docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ❌ Erros SEMPRE por último
app.use(errorHandler);

export default app;

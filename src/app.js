import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();

const swaggerDocument = YAML.load(
  path.resolve("src/docs/swagger.yaml")
);



app.use(express.json());
app.use(routes);
app.use(errorHandler);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;

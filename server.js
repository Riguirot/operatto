import app from "./src/app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Operatto API rodando 🚀 na porta ${PORT}`);
  console.log(`📘 Swagger disponível em http://localhost:${PORT}/docs`);
});

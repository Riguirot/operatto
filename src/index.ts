import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Operatto API rodando na porta ${PORT}`);
  console.log(`📄 Swagger disponível em http://localhost:${PORT}/docs`);
  console.log(`🔐 Auth login: POST http://localhost:${PORT}/auth/login`);
});

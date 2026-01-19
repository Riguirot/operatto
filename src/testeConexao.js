import pool from "./config/database";

async function testar() {
  const result = await pool.query("SELECT NOW()");
  console.log("Conectado ao PostgreSQL:", result.rows[0]);
  process.exit();
}

testar();

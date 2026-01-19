declare module "*/config/database" {
  import { Pool } from "pg";
  const pool: Pool;
  export default pool;
}

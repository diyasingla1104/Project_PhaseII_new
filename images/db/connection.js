// db/connection.js
import pkg from "pg";
const { Pool } = pkg;

function createPool() {
  // Prefer a full DATABASE_URL (Neon gives this). Fallback to individual PG env vars.
  const connectionString = process.env.DATABASE_URL ||
    process.env.PG_CONNECTION_STRING || null;

  const poolConfig = connectionString
    ? { connectionString }
    : {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      };

  // If using Neon (DATABASE_URL typically contains sslmode=require) or PGSSLMODE is set,
  // enable SSL with rejectUnauthorized: false
  const needSsl =
    !!process.env.PGSSLMODE ||
    (connectionString && connectionString.includes("sslmode"));

  if (needSsl) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  return new Pool(poolConfig);
}

/**
 * On serverless platforms (Vercel) it's important to reuse the Pool across
 * invocations when possible. We store it on global to avoid creating many pools.
 */
let pool;
if (!global._pgPool) {
  global._pgPool = createPool();
}
pool = global._pgPool;

pool.on && pool.on("error", (err) => {
  // optional: log unexpected errors. In production, forward to your logger.
  console.error("Unexpected idle client error", err);
});

export default pool;

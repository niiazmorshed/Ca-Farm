import { Pool } from "pg";

// Supabase requires SSL. The transaction pooler (port 6543) presents a cert
// that isn't in Node's default trust store, so we skip strict verification.
// The connection is still encrypted in transit.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local");
}

// Reuse one Pool across hot reloads in dev so we don't leak connections.
const globalForDb = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

// Small helper so callers don't import `pool` directly everywhere.
export function query<T extends import("pg").QueryResultRow = import("pg").QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params as never);
}

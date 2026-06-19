// Apply db/schema.sql to Supabase: node scripts/db-migrate.mjs
import { readFileSync } from "node:fs";
import { Pool } from "pg";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const sql = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await pool.query(sql);
  const { rows } = await pool.query(`
    select column_name, data_type
    from information_schema.columns
    where table_name = 'enquiries'
    order by ordinal_position
  `);
  console.log("Migration applied. enquiries columns:");
  console.table(rows);
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}

/**
 * Restore one table from a JSON backup made by scripts/db-backup.mjs.
 *
 *   node scripts/db-restore.mjs backups/<timestamp> Product
 *
 * Deletes the table's current rows and inserts the backed-up rows inside one
 * transaction. Only columns that still exist in the table are written, so a
 * backup taken before a migration can be restored after it.
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

const [dir, table] = process.argv.slice(2);
if (!dir || !table) {
  console.error("Usage: node scripts/db-restore.mjs <backup-dir> <Table>");
  process.exit(1);
}

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString: url });
const client = await pool.connect();
try {
  const rows = JSON.parse(await readFile(path.join(dir, `${table}.json`), "utf8"));
  const { rows: cols } = await client.query(
    `select column_name from information_schema.columns where table_schema = 'public' and table_name = $1`,
    [table],
  );
  const existing = new Set(cols.map((c) => c.column_name));

  await client.query("begin");
  await client.query(`delete from "${table}"`);
  let n = 0;
  for (const row of rows) {
    const keys = Object.keys(row).filter((k) => existing.has(k));
    const values = keys.map((k) => (row[k] !== null && typeof row[k] === "object" ? JSON.stringify(row[k]) : row[k]));
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    await client.query(`insert into "${table}" (${keys.map((k) => `"${k}"`).join(", ")}) values (${placeholders})`, values);
    n++;
  }
  await client.query("commit");
  console.log(`Restored ${n} rows into ${table}`);
} catch (err) {
  await client.query("rollback");
  throw err;
} finally {
  client.release();
  await pool.end();
}

/**
 * Export every table in the public schema to JSON.
 *
 *   node scripts/db-backup.mjs
 *
 * Writes backups/<timestamp>/<Table>.json plus _schema.json (columns and
 * types) and _summary.json (row counts). Uses DIRECT_URL when set, otherwise
 * DATABASE_URL. The backups/ folder is git-ignored.
 *
 * Restore a table with scripts/db-restore.mjs <backup-dir> <Table>.
 */
import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("Set DIRECT_URL or DATABASE_URL");
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const dir = path.join("backups", stamp);
await mkdir(dir, { recursive: true });

const pool = new Pool({ connectionString: url });
try {
  const { rows: tables } = await pool.query(
    `select table_name from information_schema.tables
     where table_schema = 'public' and table_type = 'BASE TABLE'
     order by table_name`,
  );

  const { rows: columns } = await pool.query(
    `select table_name, column_name, data_type, udt_name, is_nullable, column_default
     from information_schema.columns where table_schema = 'public'
     order by table_name, ordinal_position`,
  );
  await writeFile(path.join(dir, "_schema.json"), JSON.stringify(columns, null, 2));

  const summary = {};
  for (const { table_name } of tables) {
    const { rows } = await pool.query(`select * from "${table_name}"`);
    await writeFile(path.join(dir, `${table_name}.json`), JSON.stringify(rows, null, 2));
    summary[table_name] = rows.length;
    console.log(`${table_name.padEnd(24)} ${rows.length} rows`);
  }
  await writeFile(path.join(dir, "_summary.json"), JSON.stringify({ url: new URL(url).host, at: stamp, tables: summary }, null, 2));
  console.log(`\nBackup written to ${dir}`);
} finally {
  await pool.end();
}

import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma CLI configuration (migrate, db seed, migrate diff).
 *
 * The CLI talks to the database through DIRECT_URL, the Supabase session
 * pooler on port 5432, because migrations need a direct session. The app at
 * runtime uses DATABASE_URL (transaction pooler, port 6543) via the pg
 * driver adapter in src/lib/prisma.ts.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --env-file=.env prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});

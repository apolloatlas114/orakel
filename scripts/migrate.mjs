import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;
if (!url) {
  console.log("[migrate] No database URL configured; skipping migrations.");
  process.exit(0);
}

function shouldUseSsl(dbUrl) {
  try {
    const u = new URL(dbUrl);
    const host = (u.hostname || "").toLowerCase();
    // Supabase direct DB is often *.supabase.co; pooler is often *.pooler.supabase.com
    if (host.endsWith(".supabase.co") || host.endsWith(".supabase.com")) return true;
    if (u.searchParams.get("sslmode") === "require") return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Parse a Postgres URL into individual connection parameters.
 * This fixes an issue where postgres-js doesn't correctly parse usernames
 * containing dots (e.g., Supabase pooler usernames like "postgres.projectref").
 */
function parsePostgresUrl(dbUrl) {
  const parsed = new URL(dbUrl);
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 5432,
    database: parsed.pathname.slice(1) || "postgres",
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
  };
}

const params = parsePostgresUrl(url);
const client = postgres({
  host: params.host,
  port: params.port,
  database: params.database,
  username: params.username,
  password: params.password,
  max: 1,
  prepare: false,
  ssl: shouldUseSsl(url) ? "require" : undefined,
});
const db = drizzle(client);

// Supabase can drop connections on DDL that creates new schemas depending on the role/pgbouncer mode.
// Store drizzle migration bookkeeping in `public` to avoid `CREATE SCHEMA drizzle`.
await migrate(db, {
  migrationsFolder: "drizzle",
  migrationsSchema: "public",
  migrationsTable: "orakel_drizzle_migrations",
});
await client.end();

console.log("[migrate] OK");



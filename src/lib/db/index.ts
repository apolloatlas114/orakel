import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

function resolveDatabaseUrl() {
  // Prefer explicit DATABASE_URL.
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // Vercel Postgres provides multiple env vars. Prefer NON_POOLING for serverless
  // to avoid transaction pooler limitations around prepared statements.
  if (process.env.POSTGRES_URL_NON_POOLING) return process.env.POSTGRES_URL_NON_POOLING;
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;
  if (process.env.POSTGRES_PRISMA_URL) return process.env.POSTGRES_PRISMA_URL;

  return undefined;
}

const databaseUrl = resolveDatabaseUrl();

function shouldUseSsl(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    // Supabase Postgres typically requires SSL.
    if (host.endsWith(".supabase.co") || host.endsWith(".supabase.com")) return true;
    // Some providers include sslmode=require in the connection string.
    if (u.searchParams.get("sslmode") === "require") return true;
    return false;
  } catch {
    return false;
  }
}

// For `next build` and UI-only deploys, we allow running without a DB.
// Any DB-backed route should gracefully fallback to mock data or throw a clear error.
if (!databaseUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "[db] No database URL configured (DATABASE_URL / POSTGRES_URL*). DB-backed features will be unavailable until configured.",
  );
}

/**
 * Parse a Postgres URL into individual connection parameters.
 * This fixes an issue where postgres-js doesn't correctly parse usernames
 * containing dots (e.g., Supabase pooler usernames like "postgres.projectref").
 */
function parsePostgresUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 5432,
    database: parsed.pathname.slice(1) || "postgres",
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
  };
}

function createPostgresClient(url: string) {
  const params = parsePostgresUrl(url);
  const useSsl = shouldUseSsl(url);

  // Session Pooler (*.pooler.supabase.com) is IPv4-compatible, no socket override needed.
  return postgres({
    host: params.host,
    port: params.port,
    database: params.database,
    username: params.username,
    password: params.password,
    prepare: false,
    max: 5,
    idle_timeout: 20,
    ssl: useSsl ? ("require" as const) : undefined,
  });
}

const client = databaseUrl ? createPostgresClient(databaseUrl) : null;

export const db = client ? drizzle(client, { schema }) : null;

export { schema };



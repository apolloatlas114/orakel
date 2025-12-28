import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

function shouldUseSsl(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    // Supabase Postgres typically requires SSL.
    if (host.endsWith(".supabase.co")) return true;
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
    "[db] DATABASE_URL is not set. DB-backed features will be unavailable until configured.",
  );
}

const client = databaseUrl
  ? postgres(databaseUrl, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: true } : undefined,
    })
  : null;

export const db = client ? drizzle(client, { schema }) : null;

export { schema };



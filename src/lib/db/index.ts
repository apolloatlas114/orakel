import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

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
    })
  : null;

export const db = client ? drizzle(client, { schema }) : null;

export { schema };



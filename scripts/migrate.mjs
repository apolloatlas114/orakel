import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DATABASE_URL not set; skipping migrations.");
  process.exit(0);
}

function shouldUseSsl(url) {
  try {
    const u = new URL(url);
    const host = (u.hostname || "").toLowerCase();
    if (host.endsWith(".supabase.co")) return true;
    if (u.searchParams.get("sslmode") === "require") return true;
    return false;
  } catch {
    return false;
  }
}

const client = postgres(url, {
  max: 1,
  prepare: false,
  ssl: shouldUseSsl(url) ? { rejectUnauthorized: true } : undefined,
});
const db = drizzle(client);

await migrate(db, { migrationsFolder: "drizzle" });
await client.end();

console.log("[migrate] OK");



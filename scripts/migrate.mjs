import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import dns from "node:dns";
import net from "node:net";

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

function shouldForceIpv4(url) {
  try {
    const u = new URL(url);
    const host = (u.hostname || "").toLowerCase();
    return host.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function ipv4OnlySocket() {
  const s = new net.Socket();
  const originalConnect = s.connect.bind(s);
  s.connect = (...args) => {
    if (typeof args[0] === "number" && typeof args[1] === "string") {
      return originalConnect({
        port: args[0],
        host: args[1],
        lookup: (hostname, _options, cb) =>
          dns.lookup(hostname, { family: 4 }, cb),
      });
    }
    return originalConnect(...args);
  };
  return s;
}

const client = postgres(url, {
  max: 1,
  prepare: false,
  ssl: shouldUseSsl(url) ? "require" : undefined,
  socket: shouldForceIpv4(url) ? ipv4OnlySocket : undefined,
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



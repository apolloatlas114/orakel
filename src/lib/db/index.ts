import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import dns from "node:dns";
import net from "node:net";

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

function shouldForceIpv4(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    // Vercel build/runtime may not have IPv6 egress; force IPv4 for Supabase hosts.
    return host.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function ipv4OnlySocket() {
  // postgres-js calls `socket.connect(port, host)` (positional args).
  // We override to force DNS lookup with family=4, so Node won't choose an IPv6 AAAA record.
  const s = new net.Socket();
  const originalConnect = s.connect.bind(s) as unknown as (
    ...args: unknown[]
  ) => unknown;

  (s as unknown as { connect: (...args: unknown[]) => unknown }).connect = (
    ...args: unknown[]
  ) => {
    if (typeof args[0] === "number" && typeof args[1] === "string") {
      return originalConnect({
        port: args[0],
        host: args[1],
        lookup: (
          hostname: string,
          _options: unknown,
          cb: (err: NodeJS.ErrnoException | null, address: string, family: number) => void,
        ) => dns.lookup(hostname, { family: 4 }, cb),
      });
    }
    return originalConnect.apply(s, args);
  };

  return s;
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
  ? postgres(
      databaseUrl,
      ({
        prepare: false,
        max: 5,
        idle_timeout: 20,
        ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: true } : undefined,
        socket: shouldForceIpv4(databaseUrl) ? ipv4OnlySocket : undefined,
      } as unknown as Parameters<typeof postgres>[1]),
    )
  : null;

export const db = client ? drizzle(client, { schema }) : null;

export { schema };



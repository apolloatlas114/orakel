import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL not configured" },
      { status: 500 },
    );
  }

  try {
    // Lightweight connectivity test
    const result = await db.execute(sql`select 1 as ok`);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const err = e instanceof Error ? e : new Error("DB error");
    const url =
      process.env.DATABASE_URL ??
      process.env.POSTGRES_URL_NON_POOLING ??
      process.env.POSTGRES_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      "";
    let host: string | undefined;
    let port: number | undefined;
    let username: string | undefined;
    try {
      const u = new URL(url);
      host = u.hostname;
      port = u.port ? Number(u.port) : undefined;
      username = u.username || undefined;
    } catch {
      // ignore
    }
    const cause = (err as unknown as { cause?: unknown }).cause;
    const causeObj = (() => {
      if (!cause || typeof cause !== "object") return undefined;

      const c = cause as Partial<
        Record<
          "name" | "message" | "code" | "errno" | "syscall" | "address" | "port",
          unknown
        >
      >;

      // best-effort extraction; do not include connection strings
      return {
        name: typeof c.name === "string" ? c.name : undefined,
        message: typeof c.message === "string" ? c.message : undefined,
        code: typeof c.code === "string" ? c.code : undefined,
        errno: typeof c.errno === "number" ? c.errno : undefined,
        syscall: typeof c.syscall === "string" ? c.syscall : undefined,
        address: typeof c.address === "string" ? c.address : undefined,
        port: typeof c.port === "number" ? c.port : undefined,
      };
    })();

    return NextResponse.json(
      {
        ok: false,
        error: err.message,
        host,
        port,
        hint:
          host && host.endsWith(".pooler.supabase.com") && port === 6543
            ? {
                issue:
                  "Du nutzt die Supabase Connection Pooler-URL (pgbouncer) auf Port 6543. Wenn TLS/Netzwerk/Username nicht passt, wird die Verbindung oft sofort geschlossen.",
                tryNext: [
                  "Teste alternativ die Direct-Connection-URL (Port 5432) aus Supabase Dashboard → Settings → Database → Connection string (URI).",
                  username && !username.includes(".")
                    ? "Für den Pooler ist der Username oft im Format `postgres.<project-ref>` (nicht nur `postgres`). Prüfe die Pooler-Connection-String im Supabase Dashboard."
                    : "Prüfe, ob dein Pooler-Connection-String (inkl. Username) exakt aus Supabase kopiert ist.",
                  "Wenn du in einem restriktiven Netzwerk bist: Port 6543 kann geblockt sein – Port 5432 funktioniert häufig eher.",
                ],
              }
            : undefined,
        cause: causeObj,
      },
      { status: 500 },
    );
  }
}



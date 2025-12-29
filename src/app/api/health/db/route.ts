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
    const url = process.env.DATABASE_URL ?? "";
    let host: string | undefined;
    let port: number | undefined;
    try {
      const u = new URL(url);
      host = u.hostname;
      port = u.port ? Number(u.port) : undefined;
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
        cause: causeObj,
      },
      { status: 500 },
    );
  }
}



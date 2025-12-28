import { NextResponse } from "next/server";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (db as any).execute("select 1 as ok");
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "DB error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}



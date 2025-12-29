import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ tier: "free" }, { status: 200 });
  }
  
  return NextResponse.json({ tier: session.tier });
}


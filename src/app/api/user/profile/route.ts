import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!db) {
      throw new Error("Database not available");
    }

    const userData = await db
      .select({
        email: users.email,
        tier: profiles.tier,
        referralCode: profiles.referralCode,
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!userData[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      email: userData[0].email,
      tier: userData[0].tier || "free",
      referralCode: userData[0].referralCode || "",
      createdAt: userData[0].createdAt,
    });
  } catch (error) {
    console.error("[User Profile API] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


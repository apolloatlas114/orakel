import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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

    // Get or create profile with referral code
    let profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.userId),
    });

    if (!profile) {
      // Create profile with referral code
      const referralCode = nanoid(8).toUpperCase();
      await db.insert(profiles).values({
        userId: session.userId,
        referralCode,
        tier: "free",
      });
      profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, session.userId),
      });
    }

    return NextResponse.json({
      code: profile?.referralCode || "",
    });
  } catch (error) {
    console.error("[Referral API] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


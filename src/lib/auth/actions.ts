 "use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

import { db, schema } from "@/lib/db";
import { setSession, clearSession } from "@/lib/auth/session";
import { loginSchema, registerSchema } from "@/lib/auth/validators";

function monthKey(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function errorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Registration failed";
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    referralCode: formData.get("referralCode") || undefined,
  });
  if (!parsed.success)
    redirect(
      `/auth/register?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid input",
      )}`,
    );

  if (!db)
    redirect(
      `/auth/register?error=${encodeURIComponent(
        "DATABASE_URL is not configured",
      )}`,
    );

  const email = parsed.data.email.toLowerCase();
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const myReferralCode = nanoid(10);

  try {
    const [user] = await db
      .insert(schema.users)
      .values({ email, passwordHash })
      .returning({ id: schema.users.id });

    await db.insert(schema.profiles).values({
      userId: user.id,
      tier: "free",
      referralCode: myReferralCode,
      referralDiscountActive: false,
    });

    await db.insert(schema.usageLimits).values({
      userId: user.id,
      month: monthKey(),
      executionsCount: 0,
      executionsLimit: 10,
    });

    // If referral code provided, link referral if exists.
    if (parsed.data.referralCode) {
      const ref = await db
        .select({ userId: schema.profiles.userId })
        .from(schema.profiles)
        .where(eq(schema.profiles.referralCode, parsed.data.referralCode!))
        .limit(1);

      if (ref[0]) {
        await db.insert(schema.referrals).values({
          referrerUserId: ref[0].userId,
          referredUserId: user.id,
          code: parsed.data.referralCode,
        });
      }
    }

    await setSession({ userId: user.id, tier: "free" });
  } catch (e: unknown) {
    redirect(`/auth/register?error=${encodeURIComponent(errorMessage(e))}`);
  }

  redirect("/demo");
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success)
    redirect(
      `/auth/login?error=${encodeURIComponent("Invalid email or password")}`,
    );
  if (!db)
    redirect(
      `/auth/login?error=${encodeURIComponent(
        "DATABASE_URL is not configured",
      )}`,
    );

  const email = parsed.data.email.toLowerCase();
  const rows = await db
    .select({
      id: schema.users.id,
      passwordHash: schema.users.passwordHash,
      tier: schema.profiles.tier,
    })
    .from(schema.users)
    .leftJoin(schema.profiles, eq(schema.profiles.userId, schema.users.id))
    .where(eq(schema.users.email, email))
    .limit(1);

  const user = rows[0];
  if (!user)
    redirect(
      `/auth/login?error=${encodeURIComponent("Invalid email or password")}`,
    );

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok)
    redirect(
      `/auth/login?error=${encodeURIComponent("Invalid email or password")}`,
    );

  await setSession({
    userId: user.id,
    tier: (user.tier ?? "free") as "free" | "pro",
  });
  const next = formData.get("next");
  const target =
    typeof next === "string" && next.startsWith("/") ? next : "/demo";
  redirect(target);
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}



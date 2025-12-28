import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const cookieName = "orakel_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required");
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  tier: "free" | "pro";
};

export async function setSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(cookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId;
    const tier = payload.tier;
    if (typeof userId !== "string") return null;
    if (tier !== "free" && tier !== "pro") return null;
    return { userId, tier };
  } catch {
    return null;
  }
}



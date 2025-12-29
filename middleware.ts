import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const cookieName = "orakel_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  // Middleware runs in Vercel edge runtime; if secret is missing we treat as logged out.
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function hasValidSession(req: NextRequest) {
  const token = req.cookies.get(cookieName)?.value;
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.userId === "string";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/predictions") ||
    pathname.startsWith("/bot") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/referral") ||
    pathname.startsWith("/settings");

  if (!isAppRoute) return NextResponse.next();

  const ok = await hasValidSession(req);
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};




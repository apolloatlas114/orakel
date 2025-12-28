import Link from "next/link";

import { registerAction } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 orakel-grid opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-8">
          <div className="text-xs tracking-[0.2em] text-[var(--muted)]">
            ORAKEL
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Create your free account
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Free tier includes full dashboard visibility and{" "}
            <span className="text-[var(--accent-2)]">10 executions / month</span>
            .
          </p>
        </div>

        <div className="orakel-glow rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
          {sp.error ? (
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <span className="font-semibold text-[var(--accent-2)]">
                Registration failed:
              </span>{" "}
              {sp.error}
            </div>
          ) : null}
          <form action={registerAction} className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-medium text-[var(--muted)]">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 text-sm outline-none focus:border-[rgba(255,106,0,0.35)]"
                placeholder="you@domain.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-medium text-[var(--muted)]">
                Password (min 8 chars)
              </span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 text-sm outline-none focus:border-[rgba(255,106,0,0.35)]"
                placeholder="••••••••"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-medium text-[var(--muted)]">
                Referral code (optional)
              </span>
              <input
                name="referralCode"
                type="text"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 text-sm outline-none focus:border-[rgba(255,106,0,0.35)]"
                placeholder="e.g. ORAKEL123"
              />
            </label>

            <button className="mt-2 h-11 rounded-xl bg-[var(--accent)] text-sm font-semibold text-black transition hover:brightness-110">
              Create account
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-[var(--muted)]">
            <span>Already have an account?</span>
            <Link
              href="/auth/login"
              className="font-medium text-[var(--accent-2)] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



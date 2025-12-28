import { type ReactNode } from "react";

export function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "orakel-glow rounded-2xl border border-[var(--border)] bg-[var(--panel)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function GlowButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-black hover:brightness-110"
      : variant === "secondary"
        ? "border border-[var(--border)] bg-[var(--panel-2)] hover:border-[rgba(255,106,0,0.25)]"
        : "hover:bg-white/[0.04]";

  return (
    <button
      {...props}
      className={[
        "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition",
        styles,
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}



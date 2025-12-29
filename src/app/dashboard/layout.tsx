import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 orakel-grid opacity-40" />

      {/* Sidebar */}
      <DashboardSidebar tier={session.tier} />

      {/* Main Content */}
      <main className="pl-64">
        {children}
      </main>
    </div>
  );
}


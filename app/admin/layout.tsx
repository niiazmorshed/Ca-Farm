import type { Metadata } from "next";
import { requireAdmin } from "../lib/supabase/guards";
import { DashboardShell } from "../components/dashboard-ui";
import type { DashNavItem } from "../components/dashboard-nav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const navItems: DashNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/mortgage-rates", label: "Mortgage rates", icon: "banknotes", prefix: true },
  { href: "/admin/tax-rates", label: "Tax rates", icon: "receiptPercent", prefix: true },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();

  return (
    <DashboardShell
      title="Admin console"
      areaLabel="Admin"
      badge="admin"
      navItems={navItems}
      user={{
        email: user.email ?? "",
        name: (user.user_metadata?.full_name as string | undefined) ?? null,
      }}
    >
      {children}
    </DashboardShell>
  );
}

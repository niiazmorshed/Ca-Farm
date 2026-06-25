import type { Metadata } from "next";
import Link from "next/link";
import { requireClient } from "../lib/supabase/guards";
import { signOutAction } from "../auth/actions";
import { LogoutButton } from "../components/logout-button";
import { PortalNav } from "./portal-nav";

export const metadata: Metadata = {
  title: "Client portal",
  description: "Your CA Farm client area.",
};

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireClient();

  return (
    <div className="flex min-h-screen bg-surface-muted">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-navy-900 text-white md:flex">
        <Link
          href="/"
          className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5 transition-colors duration-200 hover:bg-white/5"
        >
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-primary-500 font-display text-sm font-semibold text-white">
            CA
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            CA Farm
          </span>
        </Link>
        <PortalNav />
        <div className="mt-auto border-t border-white/10 p-3">
          <Link
            href="/"
            className="block rounded-sm px-3 py-2 text-sm text-white/60 transition-colors duration-200 hover:bg-white/5 hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-line bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-sm bg-navy-900 font-display text-sm font-semibold text-primary-400 md:hidden">
              CA
            </span>
            <h1 className="font-display text-lg font-semibold text-ink">
              Client portal
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-muted">Signed in as</p>
              <p className="text-sm font-medium text-ink">{user.email}</p>
            </div>
            <span className="hidden rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-semibold text-secondary-500 sm:inline">
              Client
            </span>
            <form action={signOutAction}>
              <LogoutButton />
            </form>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-8">{children}</div>
      </div>
    </div>
  );
}

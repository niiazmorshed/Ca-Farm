"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./dashboard-icons";

export interface DashNavItem {
  href: string;
  label: string;
  icon: IconName;
  /** Match nested routes too (e.g. /admin/tax-rates/edit). */
  prefix?: boolean;
}

/**
 * Sidebar navigation shared by the admin console and the client portal.
 * Active item gets a signal-green left indicator, matching the brand accent
 * used across the marketing site.
 */
export function DashNav({
  items,
  ariaLabel,
}: {
  items: DashNavItem[];
  ariaLabel: string;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-3" aria-label={ariaLabel}>
      <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
        Menu
      </p>
      {items.map((item) => {
        const active = item.prefix
          ? pathname === item.href || pathname.startsWith(`${item.href}/`)
          : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
              active
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-0.5 transition-colors duration-200 ${
                active ? "bg-primary-400" : "bg-transparent"
              }`}
            />
            <Icon
              name={item.icon}
              className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                active ? "text-primary-300" : "text-white/40 group-hover:text-white/70"
              }`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

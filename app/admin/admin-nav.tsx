"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/mortgage-rates", label: "Mortgage rates" },
  { href: "/admin/tax-rates", label: "Tax rates" },
  { href: "/admin/cgt-rates", label: "CGT rates" },
];

export function AdminNav({ reviewDue = false }: { reviewDue?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Admin">
      {items.map((item) => {
        const active = pathname === item.href;
        const showBadge = reviewDue && item.href === "/admin/cgt-rates";
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-2 rounded-none px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              active
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {showBadge && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400"
                title="Review due"
                aria-label="Review due"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

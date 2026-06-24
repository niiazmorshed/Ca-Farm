"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [{ href: "/portal", label: "Dashboard" }];

export function PortalNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Client portal">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              active
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

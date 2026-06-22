"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceCategories, site } from "../lib/content";

const secondaryLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SoonTag() {
  return (
    <span className="rounded-sm bg-secondary-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-500">
      Soon
    </span>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" onClick={onClick}>
      <span className="grid h-9 w-9 place-items-center rounded-sm bg-navy-900 font-display text-sm font-semibold text-primary-400">
        CA
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          CA Farm
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
          Chartered Accountants
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();
  const servicesActive = isActive(pathname, "/services");

  // Auto-hide: slide the header away on scroll-down, reveal it on scroll-up.
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const goingDown = y > lastY.current;
      // ignore tiny jitter; never hide near the very top or while the menu is open
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(goingDown && y > 120 && !menuOpen);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  function closeMobile() {
    setMenuOpen(false);
    setMobileServicesOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-300 ease-snappy ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* utility bar */}
      <div className="hidden bg-navy-900 text-white/70 md:block">
        <div className="mx-auto flex h-10 w-full max-w-6xl items-center justify-between px-5 text-xs sm:px-8">
          <div className="flex items-center gap-6">
            <a
              href={site.phoneHref}
              className="font-medium transition-colors duration-200 hover:text-white"
            >
              {site.phone}
            </a>
            <span className="text-white/40">{site.hours}</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${site.email}`}
              className="transition-colors duration-200 hover:text-white"
            >
              {site.email}
            </a>
            <Link
              href="/contact"
              className="font-medium text-primary-300 transition-colors duration-200 hover:text-primary-400"
            >
              Client login
            </Link>
          </div>
        </div>
      </div>

      {/* main nav */}
      <div
        className={`border-b border-line bg-white/95 backdrop-blur-md transition-shadow duration-300 ease-snappy ${
          scrolled ? "shadow-lg shadow-navy-900/10" : ""
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between px-5 sm:px-8"
        >
          <Logo onClick={closeMobile} />

          <div className="hidden items-center gap-8 lg:flex">
            {/* Services mega-menu (CSS hover + focus-within) */}
            <div className="group relative">
              <Link
                href="/services"
                aria-current={servicesActive ? "page" : undefined}
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                  servicesActive
                    ? "font-semibold text-primary-500"
                    : "text-ink-body hover:text-primary-500"
                }`}
              >
                Services
                <Chevron className="text-muted transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
              </Link>

              <div className="invisible absolute left-1/2 top-full z-50 w-[min(64rem,calc(100vw-2rem))] -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-sm border border-line bg-white p-6 shadow-2xl shadow-navy-900/15">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
                    {serviceCategories.map((category) => (
                      <div key={category.slug}>
                        <Link
                          href={`/services/${category.slug}`}
                          className="flex items-center gap-2 font-display text-sm font-semibold text-ink transition-colors duration-200 hover:text-primary-500"
                        >
                          {category.title}
                          {category.status === "coming-soon" && <SoonTag />}
                        </Link>
                        {category.items.length > 0 ? (
                          <ul className="mt-2.5 flex flex-col gap-1.5">
                            {category.items.map((item) => (
                              <li key={item.slug}>
                                <Link
                                  href={`/services/${category.slug}/${item.slug}`}
                                  className="text-[13px] leading-5 text-muted transition-colors duration-200 hover:text-primary-500"
                                >
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1.5 text-[13px] leading-5 text-muted">
                            {category.blurb}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-line pt-4">
                    <Link
                      href="/services"
                      className="text-sm font-semibold text-primary-500 transition-colors duration-200 hover:text-primary-600"
                    >
                      View all services <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {secondaryLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "font-semibold text-primary-500"
                      : "text-ink-body hover:text-primary-500"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden h-10 cursor-pointer items-center rounded-md bg-primary-500 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:inline-flex"
            >
              Book a consultation
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-sm border border-line text-ink transition-colors duration-200 hover:bg-secondary-50 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path
                    d="M3 3l12 12M15 3L3 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M2 4.5h14M2 9h14M2 13.5h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-line bg-white px-5 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {/* Services accordion */}
              <button
                type="button"
                aria-expanded={mobileServicesOpen}
                onClick={() => setMobileServicesOpen((open) => !open)}
                className={`flex items-center justify-between rounded-sm px-3 py-2.5 text-[15px] font-medium transition-colors duration-200 ${
                  servicesActive
                    ? "bg-secondary-50 font-semibold text-primary-500"
                    : "text-ink-body hover:bg-secondary-50"
                }`}
              >
                Services
                <Chevron
                  className={`text-muted transition-transform duration-200 ${
                    mobileServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileServicesOpen && (
                <div className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-line pl-3">
                  <Link
                    href="/services"
                    onClick={closeMobile}
                    className="rounded-sm px-3 py-2 text-sm font-medium text-ink-body transition-colors duration-200 hover:bg-secondary-50"
                  >
                    All services
                  </Link>
                  {serviceCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/services/${category.slug}`}
                      onClick={closeMobile}
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-muted transition-colors duration-200 hover:bg-secondary-50 hover:text-primary-500"
                    >
                      {category.title}
                      {category.status === "coming-soon" && <SoonTag />}
                    </Link>
                  ))}
                </div>
              )}

              {secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={`rounded-sm px-3 py-2.5 text-[15px] font-medium transition-colors duration-200 ${
                    isActive(pathname, link.href)
                      ? "bg-secondary-50 font-semibold text-primary-500"
                      : "text-ink-body hover:bg-secondary-50"
                  }`}
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={site.phoneHref}
                className="rounded-sm px-3 py-2.5 text-[15px] font-medium text-ink-body transition-colors duration-200 hover:bg-secondary-50"
                onClick={closeMobile}
              >
                {site.phone}
              </a>
              <Link
                href="/contact"
                className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-primary-500 px-5 text-sm font-semibold text-white"
                onClick={closeMobile}
              >
                Book a consultation
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

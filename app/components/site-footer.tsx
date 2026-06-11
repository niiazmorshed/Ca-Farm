import Link from "next/link";
import { services, site } from "../lib/content";

const firmLinks = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About the firm", href: "/about" },
  { label: "Client stories", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-parchment">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest-950 font-display text-sm font-semibold text-brass-300">
                CA
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                CA Farm
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-sage-600">
              A partner-led chartered accountancy practice helping founders and
              family businesses grow on solid financial ground.
            </p>
          </div>

          <nav aria-label="Services">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
              Services
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-sage-700">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="transition-colors duration-200 hover:text-forest-700"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Firm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
              Firm
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-sage-700">
              {firmLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-forest-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
              Visit or write
            </h3>
            <address className="mt-4 text-sm not-italic leading-6 text-sage-700">
              {site.address[0]}
              <br />
              {site.address[1]}
              <br />
              <a
                href={`mailto:${site.email}`}
                className="mt-3 block transition-colors duration-200 hover:text-forest-700"
              >
                {site.email}
              </a>
              <a
                href={site.phoneHref}
                className="transition-colors duration-200 hover:text-forest-700"
              >
                {site.phone}
              </a>
            </address>
            <p className="mt-3 text-sm text-sage-600">{site.hours}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-sage-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CA Farm Chartered Accountants. All
            rights reserved.
          </p>
          <p>Registered to carry on audit work by the ICAEW.</p>
        </div>
      </div>
    </footer>
  );
}

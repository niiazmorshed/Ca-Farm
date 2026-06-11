const serviceLinks = [
  "Audit & Assurance",
  "Tax Planning & Compliance",
  "Bookkeeping & Cloud Accounting",
  "Payroll & Pensions",
  "Advisory & Virtual CFO",
  "Company Formation",
];

const firmLinks = [
  { label: "Services", href: "#services" },
  { label: "How we work", href: "#process" },
  { label: "Client stories", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-parchment">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest-950 font-display text-sm font-semibold text-brass-300">
                CA
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                CA Farm
              </span>
            </a>
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
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="transition-colors duration-200 hover:text-forest-700"
                  >
                    {service}
                  </a>
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
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:text-forest-700"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-500">
              Visit or write
            </h3>
            <address className="mt-4 text-sm not-italic leading-6 text-sage-700">
              12 Harvest Lane
              <br />
              York, YO1 7AB
              <br />
              <a
                href="mailto:hello@cafarm.co"
                className="mt-3 block transition-colors duration-200 hover:text-forest-700"
              >
                hello@cafarm.co
              </a>
              <a
                href="tel:+441234567890"
                className="transition-colors duration-200 hover:text-forest-700"
              >
                +44 (0)1234 567 890
              </a>
            </address>
            <p className="mt-3 text-sm text-sage-600">Mon–Fri, 9:00–17:30</p>
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

import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero, CheckIcon } from "../components/ui";
import { ContactCta } from "../components/sections";
import { services } from "../lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Audit, tax, bookkeeping, payroll, advisory and company secretarial — full-service accounting from a partner-led chartered practice.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your finance function needs."
        lede="Six practice areas, one dedicated accountant. Take one service or the whole stack — every engagement is scoped upfront on a fixed fee."
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <article
              key={service.slug}
              className="flex flex-col rounded-2xl border border-line bg-surface p-8"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-display text-sm font-semibold text-brass-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm font-semibold text-forest-700 transition-colors duration-200 hover:text-forest-600"
                >
                  Details <span aria-hidden="true">→</span>
                </Link>
              </div>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight">
                <Link
                  href={`/services/${service.slug}`}
                  className="transition-colors duration-200 hover:text-forest-700"
                >
                  {service.title}
                </Link>
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-sage-600">
                {service.blurb}
              </p>
              <ul className="mt-5 grid gap-2.5 border-t border-line pt-5 sm:grid-cols-2">
                {service.included.slice(0, 4).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-sage-700"
                  >
                    <span className="mt-1 text-brass-600">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-8 py-10 text-center">
          <h2 className="font-display text-2xl font-medium tracking-tight">
            Not sure what you need?
          </h2>
          <p className="max-w-md text-[15px] leading-7 text-sage-600">
            Start with a free discovery call. We’ll look at where things stand
            and recommend only what earns its fee.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-forest-950 px-6 text-sm font-medium text-parchment transition-colors duration-200 hover:bg-forest-800"
          >
            Book a discovery call
          </Link>
        </div>
      </Container>

      <ContactCta />
    </>
  );
}

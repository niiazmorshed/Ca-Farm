import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero, CheckIcon } from "../components/ui";
import { ContactCta } from "../components/sections";
import { serviceCategories } from "../lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Accounting, tax, business consulting, digital transformation, AI and fractional CFO services for businesses across the UK and Ireland.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your finance function needs."
        lede="From day-to-day bookkeeping to AI and international expansion — built for businesses across the UK and Ireland. Take one service or the whole stack, scoped upfront."
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          {serviceCategories.map((category, index) => {
            const comingSoon = category.status === "coming-soon";
            const previews =
              category.items.length > 0
                ? category.items.slice(0, 4).map((item) => item.title)
                : (category.included ?? []).slice(0, 4);
            return (
              <article
                key={category.slug}
                className="flex flex-col rounded-2xl border border-line bg-surface p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-sm font-semibold text-primary-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`/services/${category.slug}`}
                    className="text-sm font-semibold text-secondary-500 transition-colors duration-200 hover:text-secondary-400"
                  >
                    {comingSoon ? "Learn more" : "Explore"}{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <h2 className="mt-3 flex flex-wrap items-center gap-2.5 font-display text-2xl font-medium tracking-tight text-ink">
                  <Link
                    href={`/services/${category.slug}`}
                    className="transition-colors duration-200 hover:text-secondary-500"
                  >
                    {category.title}
                  </Link>
                  {comingSoon && (
                    <span className="rounded-full bg-secondary-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-500">
                      Soon
                    </span>
                  )}
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-muted">
                  {category.blurb}
                </p>
                {previews.length > 0 && (
                  <ul className="mt-5 grid gap-2.5 border-t border-line pt-5 sm:grid-cols-2">
                    {previews.map((title) => (
                      <li
                        key={title}
                        className="flex items-start gap-2.5 text-sm text-ink-body"
                      >
                        <span className="mt-1 text-primary-500">
                          <CheckIcon className="h-3.5 w-3.5" />
                        </span>
                        {title}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-8 py-10 text-center">
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
            Not sure what you need?
          </h2>
          <p className="max-w-md text-[15px] leading-7 text-muted">
            Start with a free discovery call. We’ll look at where things stand
            and recommend only what earns its fee.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-primary-400 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-500"
          >
            Book a discovery call
          </Link>
        </div>
      </Container>

      <ContactCta />
    </>
  );
}

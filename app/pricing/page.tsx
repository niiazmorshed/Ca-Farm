import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "../components/ui";
import { ContactCta } from "../components/sections";
import { PricingTable } from "../components/pricing-table";
import { pricingAddons, pricingTiers } from "../lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fixed monthly fees for accounting, tax and payroll. Three plans, no hourly billing, no surprise invoices.",
};

const pricingFaqs = [
  {
    question: "Can I change plan later?",
    answer:
      "Yes — plans flex with your business. Most clients start on Limited Company and move up when monthly numbers start driving decisions.",
  },
  {
    question: "Are there setup or onboarding fees?",
    answer:
      "No setup fee on annual billing. If your books need a cleanup before we take over, we quote that separately and fix the price before starting.",
  },
  {
    question: "What does “from” mean in the price?",
    answer:
      "The listed price covers a typical business at that stage. High transaction volumes, multiple entities or complex VAT push the quote up — but it is fixed before you sign and reviewed once a year.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Fixed fees. No surprises."
        lede="One monthly price agreed upfront, reviewed once a year. The meter never runs — call us as often as you like."
      />

      <Container className="py-16 sm:py-20">
        <PricingTable tiers={pricingTiers} />

        <div className="mt-16 rounded-2xl border border-line bg-surface p-8">
          <h2 className="font-display text-xl font-medium tracking-tight text-ink">
            Add-ons and one-off work
          </h2>
          <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {pricingAddons.map((addon) => (
              <div
                key={addon.name}
                className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
              >
                <dt className="text-sm font-medium text-ink">{addon.name}</dt>
                <dd className="text-sm whitespace-nowrap text-muted">
                  {addon.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
            Pricing questions
          </h2>
          <div className="mt-6">
            {pricingFaqs.map((faq) => (
              <details key={faq.question} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-ink">
                  {faq.question}
                  <svg
                    className="h-4 w-4 shrink-0 text-primary-500 transition-transform duration-300 group-open:rotate-45"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 2v12M2 8h12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </summary>
                <p className="mt-3 max-w-[60ch] text-[15px] leading-7 text-muted">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            More questions? See the{" "}
            <Link
              href="/#faq"
              className="font-medium text-secondary-500 transition-colors duration-200 hover:text-secondary-400"
            >
              full FAQ
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="font-medium text-secondary-500 transition-colors duration-200 hover:text-secondary-400"
            >
              ask us directly
            </Link>
            .
          </p>
        </div>
      </Container>

      <ContactCta />
    </>
  );
}

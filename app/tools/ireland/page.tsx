import type { Metadata } from "next";
import { Breadcrumbs, Container, PageHero } from "../../components/ui";
import { ContactCta } from "../../components/sections";
import { IrelandCalculator } from "../../components/ireland-calculator";
import { TAX_YEAR } from "../../lib/ireland-tax";

export const metadata: Metadata = {
  title: "Ireland Tax & Mortgage Calculator",
  description:
    "Free Ireland income tax, USC and PRSI take-home calculator plus a Central Bank mortgage borrowing and repayment estimator. 2025 rates.",
};

const notes = [
  {
    title: "Income tax, USC & PRSI",
    body: "Estimates your annual and monthly take-home pay across all three Irish deductions, with the standard-rate band and tax credits applied for your filing status.",
  },
  {
    title: "Central Bank mortgage rules",
    body: "Checks your borrowing against the loan-to-income and loan-to-value limits, flags the binding constraint, and works out the monthly repayment.",
  },
  {
    title: "Built for Irish clients",
    body: "Figures track Budget 2025 policy for the Republic of Ireland. For a precise position — pension relief, reliefs, exemptions — speak to our team.",
  },
];

export default function IrelandToolsPage() {
  return (
    <>
      <PageHero
        image="deskFinance"
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools" },
              { label: "Ireland calculator" },
            ]}
          />
        }
        title="Ireland tax & mortgage calculator"
        lede={`Estimate your Irish take-home pay and what you can borrow — ${TAX_YEAR} rates and Central Bank lending rules, in one place.`}
      />

      <Container className="py-16 sm:py-20">
        <div className="rounded-none border border-line bg-canvas p-6 sm:p-8 lg:p-10">
          <IrelandCalculator />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.title}
              className="rounded-none border border-line bg-surface p-6"
            >
              <h2 className="font-display text-base font-medium tracking-tight text-ink">
                {note.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{note.body}</p>
            </div>
          ))}
        </div>
      </Container>

      <ContactCta />
    </>
  );
}

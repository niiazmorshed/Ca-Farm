import type { Metadata } from "next";
import { Breadcrumbs, Container, PageHero } from "../../components/ui";
import { ContactCta } from "../../components/sections";
import { CalculatorTabs } from "../../components/calculator-tabs";
import { IrelandVatCalculator } from "../../components/ireland-vat-calculator";
import { VAT_LAST_REVIEWED } from "../../lib/ireland-vat";

export const metadata: Metadata = {
  title: "Ireland VAT Calculator — Add or Remove VAT (23%, 13.5%, 9%)",
  description:
    "Add VAT to a net price or strip VAT from a gross price at Irish rates — 23% standard, 13.5% and 9% reduced, 4.8% livestock and 0% zero — with registration thresholds. Republic of Ireland.",
};

const notes = [
  {
    title: "Add or remove VAT",
    body: "Go net-to-gross to price a job, or gross-to-net to back out the VAT on a receipt. Net, VAT and gross always reconcile to the cent.",
  },
  {
    title: "Every Irish rate",
    body: "Standard 23%, reduced 13.5%, second reduced 9% (food, catering and hairdressing since 1 July 2026), 4.8% livestock and 0% zero — each with what it covers.",
  },
  {
    title: "Registration thresholds",
    body: "The €85,000 goods and €42,500 services turnover limits shown alongside, so you can see where a growing business needs to register.",
  },
];

export default function IrelandVatPage() {
  return (
    <>
      <PageHero
        image="deskFinance"
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Tools" },
              { label: "Ireland VAT" },
            ]}
          />
        }
        title="Ireland VAT calculator"
        lede={`Add VAT to a net amount or remove it from a gross amount, at every Irish rate — figures current as of ${VAT_LAST_REVIEWED}.`}
      />

      <Container className="py-16 sm:py-20">
        <CalculatorTabs current="/tools/ireland-vat" />

        <div className="rounded-none border border-line bg-canvas p-6 sm:p-8 lg:p-10">
          <IrelandVatCalculator />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {notes.map((note) => (
            <div key={note.title} className="rounded-none border border-line bg-surface p-6">
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

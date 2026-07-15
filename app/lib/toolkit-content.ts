/* Static starter catalogue for the Entrepreneur Toolkits page — the resources
   we are preparing, shown as "in preparation" cards with a request-a-copy CTA.
   FRONTEND ONLY by design: nothing here touches the database. When a real
   file is uploaded in /admin/toolkits, the live card appears alongside (and
   the matching starter entry should be removed from this list). */

import type { ToolkitCategory } from "./toolkit-data";

export type ResourceFormat = "PDF" | "DOCX" | "XLSX";

export interface StarterResource {
  title: string;
  description: string;
  format: ResourceFormat;
  category: ToolkitCategory;
}

export const STARTER_RESOURCES: StarterResource[] = [
  // ── Memos ──────────────────────────────────────────────────────────────
  {
    category: "memo",
    format: "PDF",
    title: "Salary vs dividends — director remuneration memo",
    description:
      "How to structure director pay between salary, pension and dividends tax-efficiently, for Irish and UK owner-managed companies.",
  },
  {
    category: "memo",
    format: "PDF",
    title: "Preliminary tax & filing deadlines memo",
    description:
      "The key Revenue dates for the year — Form 11 preliminary tax, CT1 filing windows and what happens if you miss them.",
  },
  {
    category: "memo",
    format: "PDF",
    title: "Director's loan account memo",
    description:
      "Borrowing from your own company: close-company loan rules, benefit-in-kind exposure and how to clear a loan account cleanly.",
  },
  {
    category: "memo",
    format: "PDF",
    title: "Small benefit exemption memo",
    description:
      "Tax-free vouchers and non-cash benefits for staff — current limits, what qualifies and the payroll treatment.",
  },

  // ── Templates ──────────────────────────────────────────────────────────
  {
    category: "template",
    format: "DOCX",
    title: "VAT-ready sales invoice template",
    description:
      "Invoice layout with every field an Irish VAT invoice must carry — VAT number, rate breakdown and reverse-charge wording.",
  },
  {
    category: "template",
    format: "XLSX",
    title: "12-month cash-flow forecast template",
    description:
      "A working spreadsheet for monthly cash planning: receipts, payments, VAT set-aside and a running bank balance.",
  },
  {
    category: "template",
    format: "DOCX",
    title: "Board minutes & company resolutions pack",
    description:
      "First board meeting minutes, dividend declaration and standard resolutions, ready to adapt for an Irish limited company.",
  },
  {
    category: "template",
    format: "XLSX",
    title: "Expense claim form",
    description:
      "Staff and director expense claims with mileage and subsistence at civil-service rates, ready for payroll.",
  },

  // ── Tax forms ──────────────────────────────────────────────────────────
  {
    category: "tax-form",
    format: "PDF",
    title: "TR1 — registering as a sole trader or partnership",
    description:
      "Walkthrough of Revenue's TR1 registration: which taxes to tick, common errors and what to have ready before you start.",
  },
  {
    category: "tax-form",
    format: "PDF",
    title: "TR2 — company tax registration walkthrough",
    description:
      "Registering a new company for corporation tax, VAT and PAYE with the TR2 — section by section.",
  },
  {
    category: "tax-form",
    format: "PDF",
    title: "Form 11 preparation checklist",
    description:
      "Everything to gather before the income tax return: income sources, reliefs, health expenses and pension certificates.",
  },
  {
    category: "tax-form",
    format: "PDF",
    title: "CT1 preparation checklist",
    description:
      "The corporation tax return, demystified — accounts adjustments, losses, close-company surcharge and iXBRL requirements.",
  },

  // ── VAT forms ──────────────────────────────────────────────────────────
  {
    category: "vat-form",
    format: "PDF",
    title: "VAT3 return — completion walkthrough",
    description:
      "Box-by-box guide to the bi-monthly VAT3: T1, T2, postponed accounting and intra-EU boxes explained with examples.",
  },
  {
    category: "vat-form",
    format: "PDF",
    title: "Annual Return of Trading Details (RTD) checklist",
    description:
      "How to reconcile the year's VAT rates for the RTD without a last-minute scramble.",
  },
  {
    category: "vat-form",
    format: "PDF",
    title: "VAT registration checklist — Ireland & UK",
    description:
      "Current registration thresholds, voluntary registration trade-offs and the evidence Revenue and HMRC ask for.",
  },

  // ── Business setup guides ──────────────────────────────────────────────
  {
    category: "guide",
    format: "PDF",
    title: "Setting up a limited company in Ireland — step by step",
    description:
      "CRO incorporation, constitution, beneficial ownership (RBO) filing, tax registration and your first compliance calendar.",
  },
  {
    category: "guide",
    format: "PDF",
    title: "Sole trader vs limited company — decision guide",
    description:
      "Tax, liability, pension and admin compared side by side, with worked examples at different profit levels.",
  },
  {
    category: "guide",
    format: "PDF",
    title: "Setting up a UK limited company from Ireland",
    description:
      "Companies House incorporation, UK corporation tax and VAT registration, and the cross-border points Irish founders miss.",
  },
  {
    category: "guide",
    format: "PDF",
    title: "New business bank account & startup checklist",
    description:
      "Documents banks ask for, plus the first-90-days checklist: insurance, payroll, bookkeeping software and Revenue access.",
  },
];

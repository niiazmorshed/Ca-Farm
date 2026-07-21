/* Curated "coming soon" catalogue for the Founders Hub. These render as
   in-preparation cards (with a Request-a-copy CTA) ALONGSIDE the real files
   uploaded in /admin/toolkits — so every category reads as a full, professional
   library even before a file is attached. FRONTEND ONLY: nothing here touches
   the database. As a real file is uploaded for one of these, remove its entry
   here so it isn't duplicated. */

import type { ToolkitCategory, ToolkitFramework } from "./toolkit-types";

export type ResourceFormat = "PDF" | "DOCX" | "XLSX";

export interface StarterResource {
  title: string;
  description: string;
  format: ResourceFormat;
  category: ToolkitCategory;
  /** Accounting-framework badge, matching the uploaded-card badge. */
  framework?: ToolkitFramework;
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
    format: "XLSX",
    framework: "FRS 102",
    title: "Balance sheet template",
    description:
      "Statement of financial position laid out to FRS 102, ready to drop your trial-balance figures into.",
  },
  {
    category: "template",
    format: "XLSX",
    framework: "FRS 102",
    title: "Profit & loss statement template",
    description:
      "Income statement structured to FRS 102, with the standard expense analysis and prior-year column.",
  },
  {
    category: "template",
    format: "XLSX",
    framework: "FRS 102",
    title: "Cashflow statement template",
    description:
      "Cashflow statement under FRS 102 — operating, investing and financing sections with the reconciliation built in.",
  },
  {
    category: "template",
    format: "XLSX",
    framework: "FRS 102",
    title: "Management accounts template",
    description:
      "Monthly management pack — P&L, balance sheet and KPIs — for board and lender reporting.",
  },
  {
    category: "template",
    format: "DOCX",
    framework: "FRS 101",
    title: "Financial statements template (Word)",
    description:
      "Full statutory financial statements shell under FRS 101, formatted and ready for the year's numbers.",
  },
  {
    category: "template",
    format: "XLSX",
    framework: "FRS 101",
    title: "Financial statements workings (Excel)",
    description:
      "The supporting workbook for the FRS 101 statements — all calculations live here and feed the Word document.",
  },
  {
    category: "template",
    format: "XLSX",
    framework: "FRS 102",
    title: "Trial balance template",
    description:
      "Clean trial-balance workbook to build the year-end file from, formatted for FRS 102 mapping.",
  },
  {
    category: "template",
    format: "XLSX",
    framework: "FRS 102",
    title: "Trial balance with GL mapping — primary",
    description:
      "Trial balance mapped to the primary general-ledger structure, ready to roll into the financial statements.",
  },
  {
    category: "template",
    format: "XLSX",
    framework: "FRS 102",
    title: "Trial balance with GL mapping — secondary",
    description:
      "Secondary GL mapping layer for sub-analysis and consolidation on top of the primary mapping.",
  },
  {
    category: "template",
    format: "PDF",
    framework: "IFRS",
    title: "IFRS disclosure checklist",
    description:
      "Disclosure checklist for IFRS financial statements — work through it to make sure nothing's missed.",
  },
  {
    category: "template",
    format: "PDF",
    framework: "FRS 102",
    title: "FRS 102 disclosure checklist",
    description:
      "Disclosure checklist for FRS 102 accounts, including the reduced-disclosure options for qualifying entities.",
  },

  // ── Tax forms ──────────────────────────────────────────────────────────
  {
    category: "tax-form",
    format: "PDF",
    title: "TR1 — registering as a sole trader or partnership",
    description:
      "Walkthrough of Revenue's TR1 registration: which taxes to tick, common errors and what to have ready.",
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
      "Everything to gather before the income tax return: income sources, reliefs, health expenses and pension certs.",
  },
  {
    category: "tax-form",
    format: "PDF",
    title: "CT1 preparation checklist",
    description:
      "The corporation tax return demystified — accounts adjustments, losses, close-company surcharge and iXBRL.",
  },

  // ── VAT forms ──────────────────────────────────────────────────────────
  {
    category: "vat-form",
    format: "PDF",
    title: "VAT3 return — completion walkthrough",
    description:
      "Box-by-box guide to the bi-monthly VAT3: T1, T2, postponed accounting and intra-EU boxes with examples.",
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
      "Current registration thresholds, voluntary-registration trade-offs and the evidence Revenue and HMRC ask for.",
  },

  // ── Setup guides ───────────────────────────────────────────────────────
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
    format: "DOCX",
    title: "Articles & Memorandum of Association — company setup",
    description:
      "The constitutional documents for a new Irish company, with the standard clauses and where to tailor them.",
  },
  {
    category: "guide",
    format: "PDF",
    title: "Company dissolution — closing a company",
    description:
      "Winding a company down cleanly: voluntary strike-off vs liquidation, final returns and the Revenue steps.",
  },
  {
    category: "guide",
    format: "PDF",
    title: "Accountant's year-end closing checklist",
    description:
      "The year-end close, step by step — accruals, reconciliations and the file every set of accounts should carry.",
  },
];

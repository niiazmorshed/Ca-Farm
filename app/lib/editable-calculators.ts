/* Registry of admin-editable calculators that surface in the dashboard review
   reminder + nav badges.

   This is NOT "all calculators": income tax and mortgage have their own mature
   editors and are intentionally excluded from the reminder.

   Two-table reality — CGT stores reviewed_at in `cgt_settings` (its own loader);
   the Project-B calculators store it in `calculator_settings`. So each entry
   carries its OWN getReviewedAt loader rather than one unified query. Each phase
   appends its entry when that calculator ships, so P1 shows only CGT (parity
   with today) and the reminder grows per phase.

   `key` doubles as the audit-area prefix (`<key>-settings`). */

import { getCgtData } from "./cgt-data";
import { getCorporationTaxData } from "./corporation-tax-data";
import { getVatData } from "./vat-data";
import { getRdData } from "./rd-data";
import { isReviewDue } from "./ireland-cgt";

export interface EditableCalculator {
  key: string;
  label: string;
  adminHref: string;
  /** Loads this calculator's last-reviewed timestamp from its own table. */
  getReviewedAt: () => Promise<string | null>;
}

export const EDITABLE_CALCULATORS: EditableCalculator[] = [
  {
    key: "cgt",
    label: "CGT rates",
    adminHref: "/admin/cgt-rates",
    getReviewedAt: async () => (await getCgtData()).reviewedAt,
  },
  {
    key: "corporation-tax",
    label: "Corporation tax rates",
    adminHref: "/admin/ct-rates",
    getReviewedAt: async () => (await getCorporationTaxData()).reviewedAt,
  },
  {
    key: "vat",
    label: "VAT rates",
    adminHref: "/admin/vat-rates",
    getReviewedAt: async () => (await getVatData()).reviewedAt,
  },
  {
    key: "rd-credit",
    label: "R&D tax credit rates",
    adminHref: "/admin/rd-rates",
    getReviewedAt: async () => (await getRdData()).reviewedAt,
  },
];

export interface CalculatorReviewStatus {
  key: string;
  label: string;
  adminHref: string;
  reviewedAt: string | null;
  due: boolean;
}

/** Review status for every editable calculator (each loads from its own table). */
export async function loadReviewStatus(): Promise<CalculatorReviewStatus[]> {
  return Promise.all(
    EDITABLE_CALCULATORS.map(async (c) => {
      const reviewedAt = await c.getReviewedAt();
      return {
        key: c.key,
        label: c.label,
        adminHref: c.adminHref,
        reviewedAt,
        due: isReviewDue(reviewedAt),
      };
    }),
  );
}

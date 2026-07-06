/* ──────────────────────────────────────────────────────────────────────────
   Ireland VAT calculator — Add VAT (net → gross) and Remove VAT (gross → net).

   PURE FUNCTIONS ONLY — no React, no I/O — so every figure is unit-testable.
   All rates and thresholds live in the config block below: this file is the
   SINGLE SOURCE OF TRUTH. Every number the UI shows reads from here, so a
   Budget change is a one-line data edit, not a code hunt.

   Sources (verified per line):
   - VAT rates:      revenue.ie/en/vat/vat-rates
   - Registration thresholds:
                     revenue.ie/en/vat/who-must-register-for-vat/vat-thresholds

   Figures are ESTIMATES for guidance only — not tax advice. Confirm with a
   qualified adviser or revenue.ie before acting on any number.
   ────────────────────────────────────────────────────────────────────────── */

/** When the rates/thresholds below were last checked against Revenue. */
export const VAT_LAST_REVIEWED = "July 2026";
export const VAT_SOURCE_URL = "https://www.revenue.ie/en/vat/vat-rates/index.aspx";

/* ---------- rates ---------- */

export type VatRateKey =
  | "standard"
  | "reduced"
  | "second-reduced"
  | "livestock"
  | "zero";

export interface VatRate {
  key: VatRateKey;
  /** Nominal percentage, e.g. 23 for 23%. */
  percent: number;
  /** Human label for the selector. */
  label: string;
  /** What this rate applies to. */
  applies: string;
  /** Optional footnote shown beside the rate. */
  note?: string;
}

/* One source of truth for the rate table. Order = selector order. */
export const VAT_RATES: VatRate[] = [
  {
    key: "standard",
    percent: 23,
    label: "Standard — 23%",
    applies: "Most goods and services",
  },
  {
    key: "reduced",
    percent: 13.5,
    label: "Reduced — 13.5%",
    applies: "Fuel, electricity, construction, general repairs",
  },
  {
    key: "second-reduced",
    percent: 9,
    label: "Second reduced — 9%",
    applies: "Food & catering, hairdressing, newspapers, sporting facilities",
    note: "Food & catering and hairdressing moved from 13.5% to 9% on 1 July 2026.",
  },
  {
    key: "livestock",
    percent: 4.8,
    label: "Livestock — 4.8%",
    applies: "Livestock, greyhounds and the hire of horses",
  },
  {
    key: "zero",
    percent: 0,
    label: "Zero — 0%",
    applies: "Most food, children's clothing/footwear, oral medicines, exports",
  },
];

export function getVatRate(key: VatRateKey): VatRate {
  const rate = VAT_RATES.find((r) => r.key === key);
  if (!rate) throw new Error(`Unknown VAT rate: ${key}`);
  return rate;
}

/* ---------- goods/service categories → rate ----------
   So the user picks WHAT they're selling and the correct rate resolves
   automatically, instead of having to know the percentage. Grouped by rate in
   the UI. Classification can be nuanced — the on-result disclaimer covers the
   edge cases. Source: revenue.ie/en/vat/vat-rates (rate database). */

export interface VatCategory {
  label: string;
  rateKey: VatRateKey;
}

export const VAT_CATEGORIES: VatCategory[] = [
  // Standard — 23%
  { label: "General goods & services (standard rate)", rateKey: "standard" },
  { label: "Adult clothing & footwear", rateKey: "standard" },
  { label: "Electrical goods & appliances", rateKey: "standard" },
  { label: "Alcohol, soft drinks & bottled water", rateKey: "standard" },
  { label: "Professional services (legal, accountancy, consultancy)", rateKey: "standard" },
  { label: "Furniture, cosmetics & most retail goods", rateKey: "standard" },
  // Reduced — 13.5%
  { label: "Electricity & gas (domestic energy)", rateKey: "reduced" },
  { label: "Home heating oil & solid fuel", rateKey: "reduced" },
  { label: "Building & construction services", rateKey: "reduced" },
  { label: "General repairs & maintenance", rateKey: "reduced" },
  { label: "Hotel & holiday accommodation", rateKey: "reduced" },
  // Second reduced — 9%
  { label: "Restaurant & catering meals", rateKey: "second-reduced" },
  { label: "Hot takeaway food & hot drinks", rateKey: "second-reduced" },
  { label: "Hairdressing", rateKey: "second-reduced" },
  { label: "Newspapers, periodicals & e-books", rateKey: "second-reduced" },
  { label: "Sporting facilities & gym membership", rateKey: "second-reduced" },
  { label: "Cinema, theatre & concert admission", rateKey: "second-reduced" },
  // Livestock — 4.8%
  { label: "Livestock (cattle, sheep, pigs)", rateKey: "livestock" },
  { label: "Greyhounds & hire of horses", rateKey: "livestock" },
  // Zero — 0%
  { label: "Groceries & most food and drink", rateKey: "zero" },
  { label: "Children's clothing & footwear", rateKey: "zero" },
  { label: "Oral medicines", rateKey: "zero" },
  { label: "Printed books", rateKey: "zero" },
  { label: "Exports outside the EU", rateKey: "zero" },
];

/* ---------- registration thresholds (since 1 Jan 2025) ---------- */

/* A rise to €100k / €50k has been discussed but is NOT law — do not use it. */
export const VAT_THRESHOLDS = {
  goods: 85_000,
  services: 42_500,
  since: "1 January 2025",
} as const;

/* ---------- maths ---------- */

/** Round to 2 decimal places, absorbing binary-float error (e.g. 1.005 → 1.01). */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export interface VatBreakdown {
  /** Amount excluding VAT. */
  net: number;
  /** VAT amount. */
  vat: number;
  /** Amount including VAT. */
  gross: number;
  /** Rate used, e.g. 23. */
  percent: number;
}

/**
 * Add VAT to a net (VAT-exclusive) amount.
 *   vat   = net × rate
 *   gross = net + vat   ← derived by addition so the three always reconcile.
 */
export function addVat(net: number, percent: number): VatBreakdown {
  const n = round2(Math.max(0, net));
  const vat = round2(n * (percent / 100));
  const gross = round2(n + vat);
  return { net: n, vat, gross, percent };
}

/**
 * Remove VAT from a gross (VAT-inclusive) amount.
 *   net = gross ÷ (1 + rate)
 *   vat = gross − net   ← derived by subtraction so net + vat === gross exactly.
 */
export function removeVat(gross: number, percent: number): VatBreakdown {
  const g = round2(Math.max(0, gross));
  const net = round2(g / (1 + percent / 100));
  const vat = round2(g - net);
  return { net, vat, gross: g, percent };
}

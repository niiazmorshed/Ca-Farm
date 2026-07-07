/* ──────────────────────────────────────────────────────────────────────────
   Ireland Corporation Tax calculator — trading (12.5%) and passive (25%).

   PURE FUNCTIONS ONLY — no React, no I/O — so every figure is unit-testable.
   All rates live in the CT_RATES config below: this file is the SINGLE SOURCE
   OF TRUTH. Every number the UI shows reads from here.

   The USER classifies which income is trading or passive — this engine never
   guesses. Trading = active business profits. Passive = rental income,
   interest, and most foreign dividends (Case III/IV/V).

   Sources (verified per line):
   - 12.5% / 25% basis of charge:
       revenue.ie/en/companies-and-charities/corporation-tax-for-companies/corporation-tax/basis-of-charge.aspx
   - 15% Pillar Two (large groups only):
       revenue.ie/en/companies-and-charities/corporation-tax-for-companies/pillar-two

   Figures are ESTIMATES for guidance only — not tax advice. Confirm with a
   qualified adviser or revenue.ie before acting on any number.

   ── NOT MODELLED (deliberate TODO hooks — do NOT build in Phase 1) ──
   These each change the final liability and must be added as explicit,
   sourced steps, not silently folded into the headline rates:
   - TODO: R&D tax credit (35% — now a standalone calculator, ireland-rd-tax-credit.ts)
   - TODO: Knowledge Development Box (10% effective rate since 1 Oct 2023)
   - TODO: close company surcharge on undistributed investment/professional income
   - TODO: Section 486C start-up relief (first-3-years relief capped by employer PRSI)
   - TODO: chargeable gains (effective 33%; no annual exemption for companies;
           participation exemption on qualifying share disposals, development-land CGT)
   ────────────────────────────────────────────────────────────────────────── */

/** When the rates below were last checked against Revenue. */
export const CT_LAST_REVIEWED = "July 2026";
export const CT_SOURCE_URL =
  "https://www.revenue.ie/en/companies-and-charities/corporation-tax-for-companies/corporation-tax/basis-of-charge.aspx";

/* ---------- rates (single source of truth) ---------- */

export const CT_RATES = {
  /** Trading (active business) income. */
  tradingPercent: 12.5,
  /** Passive / non-trading income: rent, interest, most foreign dividends. */
  passivePercent: 25,
} as const;

/* 15% minimum applies ONLY to groups with €750M+ consolidated revenue — shown
   as an info note in the UI, never as a live input on this calculator. */
export const PILLAR_TWO = {
  percent: 15,
  revenueThresholdEur: 750_000_000,
  note: "A 15% minimum effective rate (Pillar Two) applies only to groups with consolidated annual revenue of €750 million or more. It does not affect the standard rates below.",
} as const;

/* ---------- maths ---------- */

/** Round to 2 decimal places, absorbing binary-float error. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export interface CorporationTaxInput {
  /** Active trading profit (taxed at 12.5%). */
  tradingProfit: number;
  /** Passive / non-trading income — rent, interest, most foreign dividends (25%). */
  passiveIncome: number;
}

export interface CorporationTaxResult {
  tradingProfit: number;
  passiveIncome: number;
  /** Combined taxable base: trading + passive. */
  totalProfit: number;
  tradingTax: number;
  passiveTax: number;
  totalTax: number;
  /** Blended effective rate as a fraction (0.14 = 14%); 0 when there is no base. */
  effectiveRate: number;
}

export function computeCorporationTax(
  input: CorporationTaxInput,
): CorporationTaxResult {
  const tradingProfit = round2(Math.max(0, input.tradingProfit));
  const passiveIncome = round2(Math.max(0, input.passiveIncome));
  const totalProfit = round2(tradingProfit + passiveIncome);

  const tradingTax = round2(tradingProfit * (CT_RATES.tradingPercent / 100));
  const passiveTax = round2(passiveIncome * (CT_RATES.passivePercent / 100));
  const totalTax = round2(tradingTax + passiveTax);

  const effectiveRate = totalProfit > 0 ? totalTax / totalProfit : 0;

  return {
    tradingProfit,
    passiveIncome,
    totalProfit,
    tradingTax,
    passiveTax,
    totalTax,
    effectiveRate,
  };
}

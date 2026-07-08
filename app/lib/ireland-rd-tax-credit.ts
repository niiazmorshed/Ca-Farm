/* ──────────────────────────────────────────────────────────────────────────
   Ireland R&D (Research & Development) Corporation Tax Credit calculator.

   PURE FUNCTIONS ONLY — no React, no I/O — so every figure is unit-testable.
   All rates/thresholds live in the RD_CREDIT config below: this file is the
   SINGLE SOURCE OF TRUTH. Every number the UI shows reads from here.

   HOW THE CREDIT WORKS
   - A company gets a credit of 35% of its qualifying R&D expenditure. This is
     ON TOP of the normal deduction for the same spend, so combined with the
     12.5% trading deduction the effective benefit is ~47.5% of qualifying spend.
   - The credit is paid in THREE annual instalments (it is NOT netted against
     the CT liability first — the company elects offset or cash repayment):
       1st instalment = the GREATER of (a) 50% of the credit, or
                        (b) the first-year threshold (€87,500), capped at the
                        credit. → a claim ≤ €87,500 is paid in full in year one.
       2nd instalment = 3/5 (60%) of the balance after the first instalment.
       3rd instalment = the remaining balance.
     For large claims this resolves to a fixed 50% / 30% / 20% split.

   Sources (verified July 2026):
   - Rate 35% + €87,500 first-year threshold (Budget 2026 / Finance Act 2025,
     accounting periods commencing on or after 1 January 2026):
       revenue.ie/en/companies-and-charities/reliefs-and-exemptions/research-and-development-rd-tax-credit
       taxsummaries.pwc.com/ireland/corporate/tax-credits-and-incentives
   - Three-instalment mechanism (greater of 50% / threshold; 3/5 of balance):
       revenue.ie R&D Corporation Tax Credit guidelines (Part 29-02-03)

   Figures are ESTIMATES for guidance only — not tax advice. Whether spend
   qualifies (the science test, eligible cost categories) is the hard part and
   must be assessed case by case. Confirm with a qualified adviser or revenue.ie.

   ── NOT MODELLED (deliberate — do NOT silently fold in) ──
   - The science/qualification test (what actually counts as R&D).
   - Subcontractor / third-level outsourcing limits (own R&D + up to 15% / €100k).
   - Capital vs revenue split, plant & equipment apportionment, grants netting.
   - Key Employee Reward (surrendering credit to staff).
   ────────────────────────────────────────────────────────────────────────── */

/** When the rate/threshold below were last checked against Revenue. */
export const RD_LAST_REVIEWED = "July 2026";
export const RD_SOURCE_URL =
  "https://www.revenue.ie/en/companies-and-charities/reliefs-and-exemptions/research-and-development-rd-tax-credit/index.aspx";

/* ---------- config (single source of truth) ---------- */

export const RD_CREDIT = {
  /** Credit as a % of qualifying R&D expenditure. */
  ratePercent: 35,
  /** Standard trading deduction the same spend also attracts (context only). */
  tradingDeductionPercent: 12.5,
  /** Credit + deduction headline: ~47.5% effective benefit. */
  effectiveBenefitPercent: 47.5,
  /** Max of the credit payable in year one before the instalment split kicks in. */
  firstYearThresholdEur: 87_500,
  /** Fraction of the post-first-instalment balance paid as the 2nd instalment. */
  secondInstalmentFraction: 0.6,
  /** When these figures take effect. */
  effectiveFrom: "accounting periods commencing on or after 1 January 2026",
} as const;

/** Shown beside the qualifying-spend input. */
export const RD_QUALIFYING_NOTE =
  "Qualifying cost for one accounting period, net of any grant funding: science-tested staff, materials, overheads and plant apportioned to the work, plus outsourced R&D within limits. Grant-aided spend doesn't qualify. Eligibility is assessed case by case — enter only spend you're confident is eligible.";

/* ---------- maths ---------- */

/** Round to 2 decimal places, absorbing binary-float error. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export interface RdInstalments {
  /** Paid in year one — greater of 50% or the threshold (capped at the credit). */
  year1: number;
  /** Paid in year two — 3/5 of the balance after year one. */
  year2: number;
  /** Paid in year three — the remaining balance. */
  year3: number;
}

export interface RdCreditResult {
  /** Gross R&D expenditure entered (clamped ≥ 0, rounded). */
  grossExpenditure: number;
  /** Grant funding entered, clamped to 0…grossExpenditure — grant-aided spend
      doesn't qualify, so it's netted off. */
  grantFunding: number;
  /** Qualifying (net) spend the credit is based on = gross − grant. */
  qualifyingSpend: number;
  /** Rate applied, e.g. 35. */
  ratePercent: number;
  /** The R&D tax credit = spend × rate. */
  credit: number;
  /** Value of the separate 12.5% trading deduction on the same spend (context). */
  tradingDeductionValue: number;
  /** Credit + trading deduction ≈ 47.5% of spend (context). */
  combinedBenefit: number;
  /** How the credit is paid out over three years. */
  instalments: RdInstalments;
  /** True when the whole credit is payable in year one (claim ≤ threshold). */
  paidInFullYearOne: boolean;
}

/**
 * Compute the R&D credit and its three-year instalment profile.
 *
 *   qualifying = max(0, grossExpenditure − grantFunding)   ← grants netted off
 *   credit     = qualifying × 35%
 *   i1         = max(50% × credit, min(€87,500, credit))
 *   i2         = 3/5 × (credit − i1)
 *   i3         = credit − i1 − i2          ← derived so i1 + i2 + i3 === credit.
 */
export function computeRdCredit(
  grossExpenditure: number,
  grantFunding = 0,
): RdCreditResult {
  const gross = round2(Math.max(0, grossExpenditure));
  // Grant can't exceed the spend it funds.
  const grant = round2(Math.min(Math.max(0, grantFunding), gross));
  const spend = round2(gross - grant);
  const credit = round2(spend * (RD_CREDIT.ratePercent / 100));

  const firstCap = Math.min(RD_CREDIT.firstYearThresholdEur, credit);
  const year1 = round2(Math.max(credit * 0.5, firstCap));
  const balance = round2(credit - year1);
  const year2 = round2(balance * RD_CREDIT.secondInstalmentFraction);
  const year3 = round2(balance - year2); // remainder — keeps the sum exact

  const tradingDeductionValue = round2(
    spend * (RD_CREDIT.tradingDeductionPercent / 100),
  );

  return {
    grossExpenditure: gross,
    grantFunding: grant,
    qualifyingSpend: spend,
    ratePercent: RD_CREDIT.ratePercent,
    credit,
    tradingDeductionValue,
    combinedBenefit: round2(credit + tradingDeductionValue),
    instalments: { year1, year2, year3 },
    paidInFullYearOne: credit > 0 && year1 === credit,
  };
}

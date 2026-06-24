/* ──────────────────────────────────────────────────────────────────────────
   Ireland tax & mortgage engine — 2025 policy (Republic of Ireland).
   Pure functions only: no React, no I/O. The UI (ireland-calculator.tsx)
   imports these so the figures stay in one auditable place.

   Figures are 2025 (Budget 2025) and are ESTIMATES for guidance only — they
   ignore many edge cases (age/medical-card USC relief, PRSI tapered credit,
   pension/AVC relief, BIK, etc.). Always verify at the point of advice.
   ────────────────────────────────────────────────────────────────────────── */

export const TAX_YEAR = 2025 as const;

export type FilingStatus = "single" | "married-one" | "married-two";
export type EmploymentType = "employee" | "self-employed";

/* ---------- Income tax bands & credits (2025) ---------- */

const INCOME_TAX = {
  standardRate: 0.2,
  higherRate: 0.4,
  // Standard-rate cut-off points (the slice taxed at 20%).
  srcop: {
    single: 44_000,
    marriedOne: 53_000,
    // Two-income couples: €53,000 increased by the lower of €35,000 or the
    // lower earner's income.
    marriedTwoBase: 53_000,
    marriedTwoMaxIncrease: 35_000,
  },
  credits: {
    personalSingle: 2_000,
    personalMarried: 4_000,
    employeePaye: 2_000, // PAYE (employee) tax credit
    earnedIncome: 2_000, // self-employed earned-income credit
  },
} as const;

/* ---------- USC bands (2025) ---------- */

const USC = {
  exemptionThreshold: 13_000, // total income at/below this is fully exempt
  bands: [
    { upTo: 12_012, rate: 0.005 },
    { upTo: 27_382, rate: 0.02 },
    { upTo: 70_044, rate: 0.03 },
    { upTo: Infinity, rate: 0.08 },
  ],
  // Self-employed pay an extra 3% on the slice of income above €100,000.
  selfEmployedSurchargeThreshold: 100_000,
  selfEmployedSurchargeRate: 0.03,
} as const;

/* ---------- PRSI (2025) ---------- */

const PRSI = {
  // Employee Class A / self-employed Class S both 4.2% from October 2025.
  rate: 0.042,
  // Self-employed Class S minimum annual contribution.
  selfEmployedMinimum: 500,
} as const;

/* ---------- Central Bank of Ireland mortgage rules ---------- */

export type BuyerType = "first-time" | "mover" | "btl";

export const MORTGAGE_RULES: Record<
  BuyerType,
  { label: string; ltiMultiple: number | null; maxLtv: number }
> = {
  "first-time": { label: "First-time buyer", ltiMultiple: 4, maxLtv: 0.9 },
  mover: { label: "Second / subsequent buyer", ltiMultiple: 3.5, maxLtv: 0.9 },
  // Buy-to-let isn't bound by the income (LTI) limit; 70% max LTV applies.
  btl: { label: "Buy-to-let", ltiMultiple: null, maxLtv: 0.7 },
};

/* ========================================================================== */
/* Helpers                                                                     */
/* ========================================================================== */

export const eur = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

export const pct = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(n);

const clampMin0 = (n: number) => (n > 0 ? n : 0);

/* ========================================================================== */
/* USC                                                                         */
/* ========================================================================== */

export function computeUSC(income: number, employment: EmploymentType): number {
  if (income <= USC.exemptionThreshold) return 0;

  let usc = 0;
  let lower = 0;
  for (const band of USC.bands) {
    if (income <= lower) break;
    const slice = Math.min(income, band.upTo) - lower;
    usc += slice * band.rate;
    lower = band.upTo;
  }

  if (
    employment === "self-employed" &&
    income > USC.selfEmployedSurchargeThreshold
  ) {
    usc +=
      (income - USC.selfEmployedSurchargeThreshold) *
      USC.selfEmployedSurchargeRate;
  }

  return usc;
}

/* ========================================================================== */
/* PRSI                                                                         */
/* ========================================================================== */

export function computePRSI(
  income: number,
  employment: EmploymentType,
): number {
  const prsi = income * PRSI.rate;
  if (employment === "self-employed") {
    return income > 0 ? Math.max(prsi, PRSI.selfEmployedMinimum) : 0;
  }
  return prsi;
}

/* ========================================================================== */
/* Income tax (PAYE) + full take-home breakdown                                */
/* ========================================================================== */

export interface TaxInput {
  income: number;
  status: FilingStatus;
  employment: EmploymentType;
  /** Partner's gross annual income — only used when status is "married-two". */
  partnerIncome?: number;
}

export interface TaxResult {
  grossIncome: number; // household gross (both incomes when married-two)
  standardRateCutOff: number;
  taxAtStandard: number;
  taxAtHigher: number;
  grossTax: number;
  taxCredits: number;
  incomeTax: number; // after non-refundable credits
  usc: number;
  prsi: number;
  totalDeductions: number;
  netIncome: number;
  effectiveRate: number; // total deductions / gross
}

export function computeTax(input: TaxInput): TaxResult {
  const income = clampMin0(input.income);
  const partnerIncome =
    input.status === "married-two" ? clampMin0(input.partnerIncome ?? 0) : 0;
  const grossIncome = income + partnerIncome;

  // Standard-rate cut-off point.
  let srcop: number;
  if (input.status === "single") {
    srcop = INCOME_TAX.srcop.single;
  } else if (input.status === "married-one") {
    srcop = INCOME_TAX.srcop.marriedOne;
  } else {
    const lowerEarner = Math.min(income, partnerIncome);
    const increase = Math.min(
      INCOME_TAX.srcop.marriedTwoMaxIncrease,
      lowerEarner,
    );
    srcop = INCOME_TAX.srcop.marriedTwoBase + increase;
  }

  const standardPortion = Math.min(grossIncome, srcop);
  const higherPortion = clampMin0(grossIncome - srcop);
  const taxAtStandard = standardPortion * INCOME_TAX.standardRate;
  const taxAtHigher = higherPortion * INCOME_TAX.higherRate;
  const grossTax = taxAtStandard + taxAtHigher;

  // Tax credits (non-refundable — can't reduce tax below zero).
  const personal =
    input.status === "single"
      ? INCOME_TAX.credits.personalSingle
      : INCOME_TAX.credits.personalMarried;
  const employmentCredit =
    input.employment === "employee"
      ? INCOME_TAX.credits.employeePaye
      : INCOME_TAX.credits.earnedIncome;
  // Two-income couples get an employment credit for each earner.
  const earnerCount = input.status === "married-two" ? 2 : 1;
  const taxCredits = personal + employmentCredit * earnerCount;

  const incomeTax = clampMin0(grossTax - taxCredits);

  // USC and PRSI are individualised — compute per person and sum.
  const usc =
    computeUSC(income, input.employment) +
    (partnerIncome > 0
      ? computeUSC(partnerIncome, input.employment)
      : 0);
  const prsi =
    computePRSI(income, input.employment) +
    (partnerIncome > 0
      ? computePRSI(partnerIncome, input.employment)
      : 0);

  const totalDeductions = incomeTax + usc + prsi;
  const netIncome = grossIncome - totalDeductions;
  const effectiveRate = grossIncome > 0 ? totalDeductions / grossIncome : 0;

  return {
    grossIncome,
    standardRateCutOff: srcop,
    taxAtStandard,
    taxAtHigher,
    grossTax,
    taxCredits,
    incomeTax,
    usc,
    prsi,
    totalDeductions,
    netIncome,
    effectiveRate,
  };
}

/* ========================================================================== */
/* Mortgage                                                                     */
/* ========================================================================== */

export interface MortgageInput {
  /** Gross annual income used for the loan-to-income test (household). */
  income: number;
  buyerType: BuyerType;
  propertyPrice: number;
  deposit: number;
  /** Annual interest rate as a percentage, e.g. 3.8 */
  ratePercent: number;
  termYears: number;
}

export interface MortgageResult {
  requestedLoan: number;
  maxByLti: number | null;
  maxByLtv: number;
  maxLoan: number;
  bindingConstraint: "income" | "deposit" | "within-limits";
  minDeposit: number;
  depositShortfall: number;
  depositPercent: number;
  monthlyRepayment: number;
  totalRepayable: number;
  totalInterest: number;
  withinLimits: boolean;
}

export function computeMortgage(input: MortgageInput): MortgageResult {
  const rules = MORTGAGE_RULES[input.buyerType];
  const price = clampMin0(input.propertyPrice);
  const deposit = clampMin0(input.deposit);
  const requestedLoan = clampMin0(price - deposit);

  const maxByLti =
    rules.ltiMultiple === null ? null : clampMin0(input.income) * rules.ltiMultiple;
  const maxByLtv = price * rules.maxLtv;

  const maxLoan =
    maxByLti === null ? maxByLtv : Math.min(maxByLti, maxByLtv);

  const minDeposit = price * (1 - rules.maxLtv);
  const depositShortfall = clampMin0(minDeposit - deposit);
  const depositPercent = price > 0 ? deposit / price : 0;

  const withinLimits = requestedLoan <= maxLoan + 0.5;
  let bindingConstraint: MortgageResult["bindingConstraint"];
  if (withinLimits) {
    bindingConstraint = "within-limits";
  } else if (maxByLti !== null && maxByLti < maxByLtv) {
    bindingConstraint = "income";
  } else {
    bindingConstraint = "deposit";
  }

  // Standard amortising repayment: M = P·r(1+r)^n / ((1+r)^n − 1)
  const n = Math.max(1, Math.round(input.termYears * 12));
  const r = input.ratePercent / 100 / 12;
  let monthlyRepayment: number;
  if (r === 0) {
    monthlyRepayment = requestedLoan / n;
  } else {
    const factor = Math.pow(1 + r, n);
    monthlyRepayment = (requestedLoan * r * factor) / (factor - 1);
  }
  const totalRepayable = monthlyRepayment * n;
  const totalInterest = clampMin0(totalRepayable - requestedLoan);

  return {
    requestedLoan,
    maxByLti,
    maxByLtv,
    maxLoan,
    bindingConstraint,
    minDeposit,
    depositShortfall,
    depositPercent,
    monthlyRepayment,
    totalRepayable,
    totalInterest,
    withinLimits,
  };
}

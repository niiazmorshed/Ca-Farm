/* ──────────────────────────────────────────────────────────────────────────
   Irish personal income tax engine — Income Tax + USC + PRSI.
   Mirrors the public Deloitte Ireland "Income Tax Calculator"
   (https://services.deloitte.ie) input/output model for the 2026 tax year,
   with a 2025 comparison.

   PURE FUNCTIONS ONLY — no React, no I/O — so every figure is unit-testable
   and traceable back to a specific Revenue.ie / gov.ie rule. This is a
   CA-facing tool: nothing here is a black box.

   All rates/bands/credits live in the versioned RATES_<year> config objects
   below, kept separate from the calculation functions, so a future Budget
   change is a DATA update, not a rewrite.

   Sources (verified per line in the config):
   - Income tax bands & credits:
       revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/tax-relief-charts
   - USC rates & thresholds:
       revenue.ie/en/jobs-and-pensions/usc/standard-rates-thresholds
   - PRSI Class A / Class S:
       gov.ie/en/department-of-social-protection/publications/prsi-class-a-rates
   - Pension contribution relief age bands & €115,000 earnings cap:
       revenue.ie/en/jobs-and-pensions/pensions/tax-relief-for-pension-contributions

   These figures are ESTIMATES for guidance only. Known limitations are marked
   `TODO` inline and MUST stay TODOs until checked against the live Revenue
   guidance page — do not silently resolve them.
   ────────────────────────────────────────────────────────────────────────── */

/* Currency / percent formatters (local so this module has no dependencies). */
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

/* ========================================================================== */
/* Inputs (mirror the fields the Deloitte public calculator collects)          */
/* ========================================================================== */

export type MaritalStatus = "single" | "married" | "widowed";

export interface IncomeTaxInput {
  maritalStatus: MaritalStatus;
  /** "Do you have a child(ren) in respect of whom you are in receipt of child benefit?" */
  hasChildOnChildBenefit: boolean;
  /** "Do you have any dependent child(ren) of which you are the principal carer?" */
  isPrincipalCarerOfDependentChild: boolean;
  /** Age attained during the tax year. */
  age: number;
  employmentIncome: number;
  selfEmploymentOrOtherIncome: number;
  pensionContribution: number;
}

/* ========================================================================== */
/* Versioned rate config                                                       */
/* ========================================================================== */

export interface UscBand {
  /** Cumulative upper bound of this band (income up to here). */
  upTo: number;
  rate: number;
}

export interface PensionAgeBand {
  /** Inclusive upper age for this relief band. */
  maxAge: number;
  rate: number;
}

export interface YearRates {
  year: number;

  incomeTax: {
    standardRate: number;
    higherRate: number;
    srcop: {
      /** Single / widowed, no SPCCC. */
      single: number;
      /** Single / widowed WITH the Single Person Child Carer Credit. */
      singleWithSpccc: number;
      /** Married, one income (the form has no second-earner field — see TODO). */
      marriedOneIncome: number;
    };
    credits: {
      personalSingle: number;
      personalMarried: number;
      /** Employee (PAYE) credit — applies when employmentIncome > 0. */
      employeePaye: number;
      /** Earned Income credit — applies when self-employment income > 0. */
      earnedIncome: number;
      /**
       * Combined ceiling for the Employee PAYE + Earned Income credits. They do
       * NOT stack: someone with both income types gets this once, not twice.
       */
      employmentCombinedCap: number;
      /** Single Person Child Carer Credit. */
      spccc: number;
      ageSingle: number;
      ageMarried: number;
    };
    /** Age at/above which the Age Tax Credit applies. */
    ageCreditThreshold: number;
  };

  usc: {
    /** Total income at/below this is fully exempt (cliff edge — see computeUSC). */
    exemptionThreshold: number;
    bands: UscBand[];
    reduced: {
      /** Reduced bands apply when age >= this AND total income <= incomeCeiling. */
      ageThreshold: number;
      incomeCeiling: number;
      bands: UscBand[];
    };
    /** Extra USC on self-employment income above this threshold. */
    selfEmployedSurchargeThreshold: number;
    selfEmployedSurchargeRate: number;
  };

  prsi: {
    /**
     * Employee (Class A) / self-employed (Class S) rate.
     * DECISION: a single FLAT rate per year — the rate in effect at the START
     * of the tax year — to match the reference calculator exactly (4.2% for
     * 2026, 4.1% for 2025). The employee rate actually rises to 4.35% from
     * 1 Oct 2026, so a full-year "blended" estimate would use ~4.2375%. To
     * switch to blended, change THIS ONE value.
     */
    rate: number;
    /** Class S (self-employed) minimum annual contribution. */
    selfEmployedMinimum: number;
    /** Weekly income at/below this is PRSI-exempt (Class A). */
    weeklyExemptionThreshold: number;
    /** Max weekly PRSI Credit (Class A), tapered above the exemption. */
    weeklyCreditMax: number;
    /** Upper weekly income at which the tapered PRSI Credit reaches zero. */
    weeklyCreditTaperUpper: number;
    /** Divisor for the taper: credit reduced by (excess / this). */
    weeklyCreditTaperDivisor: number;
  };

  pension: {
    /** Net relevant earnings are capped at this for relief purposes. */
    earningsCap: number;
    /** Age-banded maximum relief as a % of capped earnings. */
    ageBands: PensionAgeBand[];
  };
}

/* Age-banded pension relief % — identical across years.
   revenue.ie/en/jobs-and-pensions/pensions/tax-relief-for-pension-contributions
   <30: 15%, 30–39: 20%, 40–49: 25%, 50–54: 30%, 55–59: 35%, 60+: 40%. */
const PENSION_AGE_BANDS: PensionAgeBand[] = [
  { maxAge: 29, rate: 0.15 },
  { maxAge: 39, rate: 0.2 },
  { maxAge: 49, rate: 0.25 },
  { maxAge: 54, rate: 0.3 },
  { maxAge: 59, rate: 0.35 },
  { maxAge: Infinity, rate: 0.4 },
];

export const RATES_2026: YearRates = {
  year: 2026,
  incomeTax: {
    standardRate: 0.2,
    higherRate: 0.4,
    srcop: {
      single: 44_000, // revenue.ie tax-relief-charts (unchanged 2025→2026)
      singleWithSpccc: 48_000, // €44,000 + €4,000 SPCCC band increase
      marriedOneIncome: 53_000,
    },
    credits: {
      personalSingle: 2_000,
      personalMarried: 4_000,
      employeePaye: 2_000,
      earnedIncome: 2_000,
      employmentCombinedCap: 2_000, // PAYE + Earned Income share ONE €2,000 ceiling
      spccc: 1_900,
      ageSingle: 245,
      ageMarried: 490,
    },
    ageCreditThreshold: 65,
  },
  usc: {
    exemptionThreshold: 13_000,
    // revenue.ie usc/standard-rates-thresholds (2026):
    // 0.5% on first €12,012; 2% on next €16,688; 3% on next €41,344; 8% balance.
    bands: [
      { upTo: 12_012, rate: 0.005 },
      { upTo: 28_700, rate: 0.02 }, // 12,012 + 16,688
      { upTo: 70_044, rate: 0.03 }, // 28,700 + 41,344
      { upTo: Infinity, rate: 0.08 },
    ],
    reduced: {
      ageThreshold: 70,
      incomeCeiling: 60_000,
      // TODO: also applies to full medical-card holders — there is no medical-card
      // input in this form, so this can only be triggered by age here.
      bands: [
        { upTo: 12_012, rate: 0.005 },
        { upTo: Infinity, rate: 0.02 },
      ],
    },
    selfEmployedSurchargeThreshold: 100_000,
    selfEmployedSurchargeRate: 0.03,
  },
  prsi: {
    rate: 0.042, // FLAT 4.2% (rate at start of 2026). See note on the field.
    selfEmployedMinimum: 650,
    weeklyExemptionThreshold: 352,
    weeklyCreditMax: 12,
    weeklyCreditTaperUpper: 424,
    weeklyCreditTaperDivisor: 6,
  },
  pension: {
    earningsCap: 115_000,
    ageBands: PENSION_AGE_BANDS,
  },
};

export const RATES_2025: YearRates = {
  year: 2025,
  incomeTax: {
    standardRate: 0.2,
    higherRate: 0.4,
    // Income tax bands and the main credits were unchanged 2025 → 2026.
    srcop: { single: 44_000, singleWithSpccc: 48_000, marriedOneIncome: 53_000 },
    credits: {
      personalSingle: 2_000,
      personalMarried: 4_000,
      employeePaye: 2_000,
      earnedIncome: 2_000,
      employmentCombinedCap: 2_000,
      spccc: 1_900,
      ageSingle: 245,
      ageMarried: 490,
    },
    ageCreditThreshold: 65,
  },
  usc: {
    exemptionThreshold: 13_000,
    // 2025 bands: 0.5% first €12,012; 2% next €15,370; 3% next €42,662; 8% balance.
    bands: [
      { upTo: 12_012, rate: 0.005 },
      { upTo: 27_382, rate: 0.02 }, // 12,012 + 15,370
      { upTo: 70_044, rate: 0.03 }, // 27,382 + 42,662
      { upTo: Infinity, rate: 0.08 },
    ],
    reduced: {
      ageThreshold: 70,
      incomeCeiling: 60_000,
      bands: [
        { upTo: 12_012, rate: 0.005 },
        { upTo: Infinity, rate: 0.02 },
      ],
    },
    selfEmployedSurchargeThreshold: 100_000,
    selfEmployedSurchargeRate: 0.03,
  },
  prsi: {
    rate: 0.041, // FLAT 4.1% (rate at start of 2025).
    selfEmployedMinimum: 650,
    weeklyExemptionThreshold: 352,
    weeklyCreditMax: 12,
    weeklyCreditTaperUpper: 424,
    weeklyCreditTaperDivisor: 6,
  },
  pension: {
    earningsCap: 115_000,
    ageBands: PENSION_AGE_BANDS,
  },
};

export const RATES_BY_YEAR: Record<number, YearRates> = {
  2026: RATES_2026,
  2025: RATES_2025,
};

/* ========================================================================== */
/* Result shape (fully audited — every number carries its reason)              */
/* ========================================================================== */

export interface AppliedCredit {
  name: string;
  amount: number;
  reason: string;
}

export interface UscBandLine {
  rate: number;
  slice: number;
  amount: number;
}

export interface IncomeTaxResult {
  year: number;
  grossIncome: number;

  pension: {
    entered: number;
    reliefRate: number;
    /** Amount that actually qualifies for relief (deducted for income tax). */
    qualifying: number;
    /** Contribution above the qualifying cap — gets NO relief. */
    nonQualifyingExcess: number;
  };

  incomeTax: {
    taxableIncome: number;
    standardRateCutOff: number;
    standardPortion: number;
    taxAtStandard: number;
    higherPortion: number;
    taxAtHigher: number;
    grossTax: number;
    credits: AppliedCredit[];
    totalCredits: number;
    netTax: number;
  };

  usc: {
    exempt: boolean;
    reducedBandsApplied: boolean;
    bandBreakdown: UscBandLine[];
    standardUsc: number;
    selfEmployedSurcharge: number;
    total: number;
  };

  prsi: {
    classA: number;
    classS: number;
    total: number;
  };

  netIncomeBeforePrsi: number;
  netIncome: number;
  monthlyNetIncome: number;
  weeklyNetIncome: number;
  effectiveRate: number;
}

/* ========================================================================== */
/* Helpers                                                                     */
/* ========================================================================== */

const clampMin0 = (n: number) => (n > 0 ? n : 0);
const sanitize = (n: number) => (Number.isFinite(n) ? clampMin0(n) : 0);

/* ========================================================================== */
/* Pension relief                                                              */
/* ========================================================================== */

export function pensionReliefRate(age: number, rates: YearRates): number {
  const band = rates.pension.ageBands.find((b) => age <= b.maxAge);
  return band ? band.rate : rates.pension.ageBands[rates.pension.ageBands.length - 1].rate;
}

/**
 * Qualifying pension contribution (the slice that gets income-tax relief).
 *   relief cap = age-band % × min(net relevant earnings, €115,000)
 * Only the QUALIFYING amount reduces taxable income (and later take-home);
 * any excess above the cap gets no relief and is NOT subtracted from net pay.
 */
export function computeQualifyingPension(
  input: IncomeTaxInput,
  rates: YearRates,
): { reliefRate: number; qualifying: number; nonQualifyingExcess: number } {
  const entered = sanitize(input.pensionContribution);
  const relevantEarnings =
    sanitize(input.employmentIncome) + sanitize(input.selfEmploymentOrOtherIncome);
  const reliefRate = pensionReliefRate(input.age, rates);
  const cap = reliefRate * Math.min(relevantEarnings, rates.pension.earningsCap);
  const qualifying = Math.min(entered, cap);
  return {
    reliefRate,
    qualifying,
    nonQualifyingExcess: clampMin0(entered - qualifying),
  };
}

/* ========================================================================== */
/* Income tax                                                                  */
/* ========================================================================== */

function spcccEligible(input: IncomeTaxInput): boolean {
  return (
    input.hasChildOnChildBenefit &&
    input.isPrincipalCarerOfDependentChild &&
    (input.maritalStatus === "single" || input.maritalStatus === "widowed")
  );
}

export function computeIncomeTax(
  input: IncomeTaxInput,
  rates: YearRates,
  qualifyingPension: number,
): IncomeTaxResult["incomeTax"] {
  const it = rates.incomeTax;
  const employment = sanitize(input.employmentIncome);
  const selfEmp = sanitize(input.selfEmploymentOrOtherIncome);
  const grossIncome = employment + selfEmp;

  // Pension relief reduces taxable income for INCOME TAX ONLY.
  const taxableIncome = clampMin0(grossIncome - qualifyingPension);
  const married = input.maritalStatus === "married";
  const spccc = spcccEligible(input);

  // Standard-rate cut-off point (SRCOP).
  let srcop: number;
  if (married) {
    // TODO: two-income married couples get €53,000 + the lower of €35,000 or
    // the second earner's income (capped €88,000). The Deloitte form has no
    // second-earner field, so we use single-income married logic. Known gap.
    srcop = it.srcop.marriedOneIncome;
  } else {
    srcop = spccc ? it.srcop.singleWithSpccc : it.srcop.single;
  }

  const standardPortion = Math.min(taxableIncome, srcop);
  const higherPortion = clampMin0(taxableIncome - srcop);
  const taxAtStandard = standardPortion * it.standardRate;
  const taxAtHigher = higherPortion * it.higherRate;
  const grossTax = taxAtStandard + taxAtHigher;

  // ---- Credits (non-refundable: cannot push tax below zero) ----
  const credits: AppliedCredit[] = [];

  // Personal credit.
  if (married) {
    credits.push({
      name: "Personal Tax Credit",
      amount: it.credits.personalMarried,
      reason: "Married",
    });
  } else {
    // TODO: a widowed person's credit varies by years since bereavement
    // (1st yr €4,000 … reverting to €2,540). The form has no year-of-bereavement
    // field, so we apply the standard single credit and flag this as an
    // estimate that excludes bereavement-year uplifts.
    credits.push({
      name: "Personal Tax Credit",
      amount: it.credits.personalSingle,
      reason:
        input.maritalStatus === "widowed"
          ? "Widowed — standard credit (excludes bereavement-year uplift, see TODO)"
          : "Single",
    });
  }

  // Employee PAYE + Earned Income credits share ONE combined ceiling.
  const hasEmployment = employment > 0;
  const hasSelfEmp = selfEmp > 0;
  const rawEmploymentCredit =
    (hasEmployment ? it.credits.employeePaye : 0) +
    (hasSelfEmp ? it.credits.earnedIncome : 0);
  const employmentCredit = Math.min(rawEmploymentCredit, it.credits.employmentCombinedCap);
  if (employmentCredit > 0) {
    const capped = rawEmploymentCredit > employmentCredit;
    const label =
      hasEmployment && hasSelfEmp
        ? "Employee PAYE + Earned Income Credit"
        : hasEmployment
          ? "Employee PAYE Credit"
          : "Earned Income Credit";
    credits.push({
      name: label,
      amount: employmentCredit,
      reason: capped
        ? "Both employment and self-employment income — shared €2,000 ceiling, does not stack"
        : hasEmployment
          ? "Has employment income"
          : "Has self-employment income",
    });
  }

  // Single Person Child Carer Credit.
  if (spccc) {
    credits.push({
      name: "Single Person Child Carer Credit",
      amount: it.credits.spccc,
      reason: "Single/widowed principal carer in receipt of child benefit",
    });
  }

  // Age Tax Credit.
  if (input.age >= it.ageCreditThreshold) {
    credits.push({
      name: "Age Tax Credit",
      amount: married ? it.credits.ageMarried : it.credits.ageSingle,
      reason: `Age ${input.age} ≥ ${it.ageCreditThreshold}`,
    });
  }

  const totalCredits = credits.reduce((s, c) => s + c.amount, 0);
  const netTax = clampMin0(grossTax - totalCredits);

  return {
    taxableIncome,
    standardRateCutOff: srcop,
    standardPortion,
    taxAtStandard,
    higherPortion,
    taxAtHigher,
    grossTax,
    credits,
    totalCredits,
    netTax,
  };
}

/* ========================================================================== */
/* USC — charged on GROSS income; pension does NOT reduce it                    */
/* ========================================================================== */

export function computeUSC(input: IncomeTaxInput, rates: YearRates): IncomeTaxResult["usc"] {
  const u = rates.usc;
  const employment = sanitize(input.employmentIncome);
  const selfEmp = sanitize(input.selfEmploymentOrOtherIncome);
  const income = employment + selfEmp;

  // Cliff edge: at/below the exemption threshold, NOTHING is charged. One euro
  // over and the full income is taxed through the bands from zero.
  if (income <= u.exemptionThreshold) {
    return {
      exempt: true,
      reducedBandsApplied: false,
      bandBreakdown: [],
      standardUsc: 0,
      selfEmployedSurcharge: 0,
      total: 0,
    };
  }

  const reducedBandsApplied =
    input.age >= u.reduced.ageThreshold && income <= u.reduced.incomeCeiling;
  const bands = reducedBandsApplied ? u.reduced.bands : u.bands;

  const bandBreakdown: UscBandLine[] = [];
  let lower = 0;
  let standardUsc = 0;
  for (const band of bands) {
    if (income <= lower) break;
    const slice = Math.min(income, band.upTo) - lower;
    const amount = slice * band.rate;
    bandBreakdown.push({ rate: band.rate, slice, amount });
    standardUsc += amount;
    lower = band.upTo;
  }

  // Self-employed surcharge: +3% on self-employment income above €100,000.
  const selfEmployedSurcharge =
    selfEmp > u.selfEmployedSurchargeThreshold
      ? (selfEmp - u.selfEmployedSurchargeThreshold) * u.selfEmployedSurchargeRate
      : 0;

  return {
    exempt: false,
    reducedBandsApplied,
    bandBreakdown,
    standardUsc,
    selfEmployedSurcharge,
    total: standardUsc + selfEmployedSurcharge,
  };
}

/* ========================================================================== */
/* PRSI — charged on GROSS income at the flat rate; pension does NOT reduce it  */
/* ========================================================================== */

/** Class A (employment income). */
function computePrsiClassA(employment: number, rates: YearRates): number {
  const p = rates.prsi;
  if (employment <= 0) return 0;
  const weekly = employment / 52;
  // Exempt at/below the weekly threshold.
  if (weekly <= p.weeklyExemptionThreshold) return 0;

  const gross = employment * p.rate;

  // Tapered PRSI Credit: max €12/week, reduced by 1/6 of weekly earnings above
  // the exemption, reaching zero at €424/week.
  if (weekly <= p.weeklyCreditTaperUpper) {
    const weeklyCredit = clampMin0(
      p.weeklyCreditMax - (weekly - p.weeklyExemptionThreshold) / p.weeklyCreditTaperDivisor,
    );
    return clampMin0(gross - weeklyCredit * 52);
  }
  return gross;
}

/** Class S (self-employment / other income). */
function computePrsiClassS(selfEmp: number, rates: YearRates): number {
  const p = rates.prsi;
  if (selfEmp <= 0) return 0;
  return Math.max(selfEmp * p.rate, p.selfEmployedMinimum);
}

export function computePRSI(input: IncomeTaxInput, rates: YearRates): IncomeTaxResult["prsi"] {
  // TODO: PRSI generally stops once someone is 66+ AND receiving the State
  // Pension (Contributory). The form has an age field but no "receiving state
  // pension" flag, so we do NOT auto-exempt at 66 (that would misfire for
  // deferred pensions). Flagged, not hard-coded.
  const classA = computePrsiClassA(sanitize(input.employmentIncome), rates);
  const classS = computePrsiClassS(sanitize(input.selfEmploymentOrOtherIncome), rates);
  return { classA, classS, total: classA + classS };
}

/* ========================================================================== */
/* Top-level: full calculation for one year                                    */
/* ========================================================================== */

export function computeIrishTax(
  input: IncomeTaxInput,
  year: number,
  ratesOverride?: YearRates,
): IncomeTaxResult {
  // Rates normally come from the admin-managed tax_rates table (see
  // tax-data.ts); the versioned configs above are the seed + fallback.
  const rates = ratesOverride ?? RATES_BY_YEAR[year];
  if (!rates) throw new Error(`No rate config for tax year ${year}`);

  const employment = sanitize(input.employmentIncome);
  const selfEmp = sanitize(input.selfEmploymentOrOtherIncome);
  const grossIncome = employment + selfEmp;

  const pension = computeQualifyingPension(input, rates);
  const incomeTax = computeIncomeTax(input, rates, pension.qualifying);
  const usc = computeUSC(input, rates);
  const prsi = computePRSI(input, rates);

  // Take-home. The qualifying pension is money actually paid into a pension, so
  // it leaves take-home; the non-qualifying excess is NOT subtracted here.
  const netIncomeBeforePrsi =
    grossIncome - incomeTax.netTax - usc.total - pension.qualifying;
  const netIncome = netIncomeBeforePrsi - prsi.total;

  const totalDeductions = incomeTax.netTax + usc.total + prsi.total;

  return {
    year,
    grossIncome,
    pension: {
      entered: sanitize(input.pensionContribution),
      reliefRate: pension.reliefRate,
      qualifying: pension.qualifying,
      nonQualifyingExcess: pension.nonQualifyingExcess,
    },
    incomeTax,
    usc,
    prsi,
    netIncomeBeforePrsi,
    netIncome,
    monthlyNetIncome: netIncome / 12,
    weeklyNetIncome: netIncome / 52,
    effectiveRate: grossIncome > 0 ? totalDeductions / grossIncome : 0,
  };
}

/* ========================================================================== */
/* Two-year comparison (Deloitte shows the current + prior year side by side)   */
/* ========================================================================== */

export interface YearComparison {
  current: IncomeTaxResult;
  prior: IncomeTaxResult;
  delta: {
    annual: number;
    monthly: number;
    weekly: number;
  };
}

export function compareYears(
  input: IncomeTaxInput,
  currentYear = 2026,
  priorYear = 2025,
  ratesByYear?: Record<number, YearRates>,
): YearComparison {
  const current = computeIrishTax(input, currentYear, ratesByYear?.[currentYear]);
  const prior = computeIrishTax(input, priorYear, ratesByYear?.[priorYear]);
  return {
    current,
    prior,
    delta: {
      annual: current.netIncome - prior.netIncome,
      monthly: current.monthlyNetIncome - prior.monthlyNetIncome,
      weekly: current.weeklyNetIncome - prior.weeklyNetIncome,
    },
  };
}

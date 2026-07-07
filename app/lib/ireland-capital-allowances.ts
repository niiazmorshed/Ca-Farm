/* ──────────────────────────────────────────────────────────────────────────
   Ireland Capital Allowances calculator — wear & tear / writing-down allowances
   on capital expenditure (plant & machinery, cars, industrial buildings, and
   100% accelerated allowances for energy-efficient equipment).

   PURE FUNCTIONS ONLY — no React, no I/O — so every figure is unit-testable.
   All rates/limits live in the config block below: this file is the SINGLE
   SOURCE OF TRUTH. Every number the UI shows reads from here.

   HOW IT WORKS
   - Capital allowances are tax depreciation: the cost of a qualifying asset is
     written off against taxable profits over a fixed life at a fixed rate.
       • Plant & machinery:  12.5% straight-line over 8 years.
       • Motor vehicles (cars): 12.5% over 8 years, but the cost is capped at
         €24,000 and further restricted by CO2 emissions (full / 50% / nil).
       • Industrial buildings: 4% straight-line over 25 years.
       • Energy-efficient equipment (ACA): 100% in year one.
   - The cash value is the allowance × the tax rate (12.5% trading here).

   Sources (verified July 2026):
   - Rates + 8-year/25-year lives, 100% ACA (extended to 31 Dec 2030 in
     Budget 2026; excludes fossil-fuel-run equipment):
       revenue.ie/en/companies-and-charities/corporation-tax-for-companies/corporation-tax/capital-allowances-and-deductions
       taxsummaries.pwc.com/ireland/corporate/deductions
   - Car €24,000 cap + CO2 categories (Group 1 ≤155 g/km full; Group 2 156–190
     g/km 50%; Group 3 >190 g/km nil), s380K TCA 1997:
       revenue.ie Tax and Duty Manual Part 11-00-01 (Cars — Capital Allowances)

   Figures are ESTIMATES for guidance only — not tax advice. Balancing
   allowances/charges on disposal, private-use restrictions, leasing rules and
   scheme-specific building reliefs are NOT modelled. Confirm with a qualified
   adviser or revenue.ie.
   ────────────────────────────────────────────────────────────────────────── */

/** When the rates/limits below were last checked against Revenue. */
export const CA_LAST_REVIEWED = "July 2026";
export const CA_SOURCE_URL =
  "https://www.revenue.ie/en/companies-and-charities/corporation-tax-for-companies/corporation-tax/capital-allowances-and-deductions.aspx";

/** Specified amount — the cost ceiling for cars. */
export const MOTOR_CAP_EUR = 24_000;
/** Trading CT rate used to show the cash value of the allowances. */
export const TRADING_CT_PERCENT = 12.5;

/* ---------- asset classes (single source of truth) ---------- */

export type AssetKey =
  | "plant-machinery"
  | "motor-vehicle"
  | "industrial-building"
  | "energy-efficient";

export interface AssetClass {
  key: AssetKey;
  label: string;
  /** Annual wear-and-tear rate, e.g. 12.5. For ACA this is 100. */
  ratePercent: number;
  /** Years the allowance is spread over (1 for a 100% first-year allowance). */
  years: number;
  /** True when the whole cost is written off in year one (ACA). */
  firstYearFull: boolean;
  /** True for cars — the €24,000 cap + CO2 restriction apply. */
  co2Restricted?: boolean;
  note: string;
}

export const ASSET_CLASSES: AssetClass[] = [
  {
    key: "plant-machinery",
    label: "Plant & machinery",
    ratePercent: 12.5,
    years: 8,
    firstYearFull: false,
    note: "Machinery, equipment, fixtures and fittings, plus commercial vehicles (vans, trucks, tractors) — written off at 12.5% a year over 8 years.",
  },
  {
    key: "motor-vehicle",
    label: "Motor vehicle (car)",
    ratePercent: 12.5,
    years: 8,
    firstYearFull: false,
    co2Restricted: true,
    note: "12.5% over 8 years, but the cost is capped at €24,000 and restricted by CO2 emissions. Commercial vehicles (vans, trucks) aren't restricted — use Plant & machinery for those.",
  },
  {
    key: "industrial-building",
    label: "Industrial building",
    ratePercent: 4,
    years: 25,
    firstYearFull: false,
    note: "Factories, mills and similar buildings in use for a trade — 4% a year over 25 years. Many scheme-specific building reliefs have ended; check the building qualifies.",
  },
  {
    key: "energy-efficient",
    label: "Energy-efficient equipment (ACA)",
    ratePercent: 100,
    years: 1,
    firstYearFull: true,
    note: "Accelerated Capital Allowance — 100% written off in year one for approved energy-efficient equipment on the SEAI Triple-E register. Extended to 31 December 2030. Excludes equipment run on fossil fuels.",
  },
];

export function getAssetClass(key: AssetKey): AssetClass {
  const cls = ASSET_CLASSES.find((a) => a.key === key);
  if (!cls) throw new Error(`Unknown asset class: ${key}`);
  return cls;
}

/* ---------- car CO2 emissions groups (2026 rules) ---------- */

export type Co2GroupKey = "group1" | "group2" | "group3";

export interface Co2Group {
  key: Co2GroupKey;
  label: string;
  /** Multiplier applied to the capped cost: 1 (full), 0.5 (half) or 0 (nil). */
  factor: number;
  note: string;
}

export const CAR_CO2_GROUPS: Co2Group[] = [
  {
    key: "group1",
    label: "0–155 g/km (Category A–C)",
    factor: 1,
    note: "Full relief — allowances on the cost up to €24,000.",
  },
  {
    key: "group2",
    label: "156–190 g/km (Category D–E)",
    factor: 0.5,
    note: "Half relief — allowances on 50% of the cost (capped at €24,000).",
  },
  {
    key: "group3",
    label: "Over 190 g/km (Category F–G)",
    factor: 0,
    note: "No wear-and-tear allowances are available for this car.",
  },
];

export function getCo2Group(key: Co2GroupKey): Co2Group {
  const g = CAR_CO2_GROUPS.find((c) => c.key === key);
  if (!g) throw new Error(`Unknown CO2 group: ${key}`);
  return g;
}

/** Flagged on the car result — the emissions bands change on this date. */
export const CAR_2027_NOTE =
  "From 1 January 2027 the car bands change to €24,000 for 0–120 g/km, €12,000 for 121–140 g/km and nil above 140 g/km. These figures use the rules in force in 2026.";

/* ---------- maths ---------- */

/** Round to 2 decimal places, absorbing binary-float error. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export interface CapitalAllowanceInput {
  assetKey: AssetKey;
  cost: number;
  /** Required for cars; ignored otherwise. Defaults to the full-relief group. */
  co2Group?: Co2GroupKey;
}

export interface CapitalAllowanceResult {
  cost: number;
  /** Cost after the car cap + CO2 restriction (equals cost for other assets). */
  allowableCost: number;
  ratePercent: number;
  years: number;
  firstYearFull: boolean;
  /** Standard annual allowance (for ACA, the full year-one amount). */
  annualAllowance: number;
  /** Allowance claimed in year one. */
  firstYearAllowance: number;
  /** Final year's allowance — carries the rounding remainder so the schedule
      sums back to allowableCost exactly. */
  finalYearAllowance: number;
  /** Total allowances over the life = allowableCost. */
  totalAllowances: number;
  /** Cash value of the total allowances at the 12.5% trading rate. */
  taxSaving: number;
  /** True when the car cap / CO2 factor reduced the cost. */
  restricted: boolean;
}

/**
 * Compute the capital allowance profile for one asset.
 *
 *   allowableCost = cost, except cars: min(cost, €24,000) × CO2 factor.
 *   annual        = allowableCost × rate       (straight-line)
 *   finalYear     = allowableCost − annual × (years − 1)   ← reconciles rounding
 *   ACA (100%)    = whole allowableCost in year one.
 */
export function computeCapitalAllowance(
  input: CapitalAllowanceInput,
): CapitalAllowanceResult {
  const cls = getAssetClass(input.assetKey);
  const cost = round2(Math.max(0, input.cost));

  let allowableCost = cost;
  let restricted = false;
  if (cls.co2Restricted) {
    const capped = Math.min(cost, MOTOR_CAP_EUR);
    const group = getCo2Group(input.co2Group ?? "group1");
    allowableCost = round2(capped * group.factor);
    restricted = allowableCost !== cost;
  }

  const { ratePercent, years, firstYearFull } = cls;

  let annualAllowance: number;
  let firstYearAllowance: number;
  let finalYearAllowance: number;

  if (firstYearFull) {
    annualAllowance = allowableCost;
    firstYearAllowance = allowableCost;
    finalYearAllowance = allowableCost;
  } else {
    annualAllowance = round2(allowableCost * (ratePercent / 100));
    firstYearAllowance = annualAllowance;
    finalYearAllowance = round2(allowableCost - annualAllowance * (years - 1));
  }

  return {
    cost,
    allowableCost,
    ratePercent,
    years,
    firstYearFull,
    annualAllowance,
    firstYearAllowance,
    finalYearAllowance,
    totalAllowances: allowableCost,
    taxSaving: round2(allowableCost * (TRADING_CT_PERCENT / 100)),
    restricted,
  };
}

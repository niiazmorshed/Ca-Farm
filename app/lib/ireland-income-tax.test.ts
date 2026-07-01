/* Unit tests for the Irish income tax engine.
   Run: node --test app/lib/ireland-income-tax.test.ts   (Node 22.6+ strips types)

   Two known-good cases:
   (a) simple PAYE employee sanity check,
   (b) the VERIFIED REFERENCE CASE captured from the live Deloitte calculator —
       every line must reproduce exactly. It was chosen to exercise the pension
       cap, the combined employment-credit cap, and the self-employed USC
       surcharge all at once. If any line is off, there is a bug. */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeIrishTax,
  type IncomeTaxInput,
} from "./ireland-income-tax.ts";

/** Displayed figures are whole euros — compare rounded, like the UI shows them. */
const round = (n: number) => Math.round(n);

test("(a) simple: single PAYE employee, €50,000, age 30, no children", () => {
  const input: IncomeTaxInput = {
    maritalStatus: "single",
    hasChildOnChildBenefit: false,
    isPrincipalCarerOfDependentChild: false,
    age: 30,
    employmentIncome: 50_000,
    selfEmploymentOrOtherIncome: 0,
    pensionContribution: 0,
  };
  const r = computeIrishTax(input, 2026);

  // Income tax: 20% × 44,000 = 8,800; 40% × 6,000 = 2,400; less €4,000 credits.
  assert.equal(round(r.incomeTax.netTax), 7_200);
  // USC: 0.5%×12,012 + 2%×16,688 + 3%×21,300 = 1,032.82 → €1,033.
  assert.equal(round(r.usc.total), 1_033);
});

test("(b) VERIFIED REFERENCE CASE — €4M employment + €1M self-emp + €2M pension, age 30", () => {
  const input: IncomeTaxInput = {
    maritalStatus: "single",
    hasChildOnChildBenefit: false,
    isPrincipalCarerOfDependentChild: false,
    age: 30,
    employmentIncome: 4_000_000,
    selfEmploymentOrOtherIncome: 1_000_000,
    pensionContribution: 2_000_000,
  };
  const r = computeIrishTax(input, 2026);

  assert.equal(round(r.grossIncome), 5_000_000, "Total income");
  assert.equal(round(r.pension.qualifying), 23_000, "Qualifying Pension Deduction");
  assert.equal(round(r.incomeTax.taxAtStandard), 8_800, "Tax @ 20%");
  assert.equal(round(r.incomeTax.taxAtHigher), 1_973_200, "Tax @ 40%");
  assert.equal(round(r.incomeTax.totalCredits), 4_000, "Tax Credits");
  assert.equal(round(r.incomeTax.netTax), 1_978_000, "Net Tax");
  assert.equal(round(r.usc.total), 423_031, "USC");
  assert.equal(round(r.netIncomeBeforePrsi), 2_575_969, "Net income before PRSI");
  assert.equal(round(r.prsi.total), 210_000, "PRSI");
  assert.equal(round(r.netIncome), 2_365_969, "Annual Net Income");

  // Combined employment credit must NOT stack (2,000, not 4,000) — both income types.
  const employmentCredit = r.incomeTax.credits.find((c) =>
    c.name.includes("Earned Income") || c.name.includes("PAYE"),
  );
  assert.equal(employmentCredit?.amount, 2_000, "Combined employment credit capped at €2,000");

  // USC surcharge slice: 3% × (1,000,000 − 100,000) = 27,000.
  assert.equal(round(r.usc.selfEmployedSurcharge), 27_000, "Self-employed USC surcharge");
});

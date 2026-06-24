"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  MORTGAGE_RULES,
  TAX_YEAR,
  computeMortgage,
  computeTax,
  eur,
  pct,
  type BuyerType,
  type EmploymentType,
  type FilingStatus,
} from "../lib/ireland-tax";

/* ---------- shared inputs ---------- */

function CurrencyField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
          €
        </span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          step={1000}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 w-full rounded-md border border-line bg-surface pl-7 pr-3 text-sm text-ink tabular-nums transition-colors duration-200 focus:border-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  min = 0,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink tabular-nums transition-colors duration-200 focus:border-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function SegmentedField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <span className="block text-sm font-medium text-ink">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="mt-1.5 flex flex-wrap gap-1.5 rounded-md border border-line bg-surface-muted p-1"
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={`flex-1 cursor-pointer rounded-sm px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                active
                  ? "bg-surface text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  strong = false,
  tone = "default",
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "default" | "deduct" | "positive";
}) {
  const valueColor =
    tone === "deduct"
      ? "text-secondary-600"
      : tone === "positive"
        ? "text-primary-600"
        : "text-ink";
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-2 ${
        strong ? "border-t border-line pt-3" : ""
      }`}
    >
      <span
        className={`text-sm ${strong ? "font-semibold text-ink" : "text-muted"}`}
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${
          strong ? "font-display text-lg font-semibold" : "text-sm font-medium"
        } ${valueColor}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ---------- income tax calculator ---------- */

function IncomeTaxCalculator() {
  const [income, setIncome] = useState(55_000);
  const [partnerIncome, setPartnerIncome] = useState(35_000);
  const [status, setStatus] = useState<FilingStatus>("single");
  const [employment, setEmployment] = useState<EmploymentType>("employee");

  const result = useMemo(
    () => computeTax({ income, status, employment, partnerIncome }),
    [income, status, employment, partnerIncome],
  );

  const monthlyNet = result.netIncome / 12;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* inputs */}
      <div className="flex flex-col gap-5">
        <SegmentedField
          label="Filing status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "single", label: "Single" },
            { value: "married-one", label: "Married · 1 income" },
            { value: "married-two", label: "Married · 2 incomes" },
          ]}
        />
        <SegmentedField
          label="Employment"
          value={employment}
          onChange={setEmployment}
          options={[
            { value: "employee", label: "Employee (PAYE)" },
            { value: "self-employed", label: "Self-employed" },
          ]}
        />
        <CurrencyField
          label="Gross annual income"
          value={income}
          onChange={setIncome}
        />
        {status === "married-two" && (
          <CurrencyField
            label="Partner's gross annual income"
            value={partnerIncome}
            onChange={setPartnerIncome}
          />
        )}
        <p className="text-xs leading-5 text-muted">
          Estimate for {TAX_YEAR} based on standard credits. Excludes pension
          relief, BIK, age/medical-card USC reductions and the PRSI tapered
          credit.
        </p>
      </div>

      {/* results */}
      <div className="rounded-sm border-t-2 border-primary-400 bg-surface p-6 shadow-sm shadow-navy-900/5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-base font-medium text-ink">
            Estimated take-home
          </h3>
          <span className="rounded-sm bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">
            {TAX_YEAR}
          </span>
        </div>

        <p className="mt-4 font-display text-3xl font-semibold tabular-nums text-ink">
          {eur(result.netIncome)}
          <span className="ml-1.5 text-sm font-normal text-muted">/year</span>
        </p>
        <p className="mt-0.5 text-sm text-muted">
          {eur(monthlyNet)} per month · effective rate{" "}
          {pct(result.effectiveRate)}
        </p>

        <div className="mt-5">
          <ResultRow label="Gross income" value={eur(result.grossIncome)} />
          <ResultRow
            label="Income tax (PAYE)"
            value={`− ${eur(result.incomeTax)}`}
            tone="deduct"
          />
          <ResultRow label="USC" value={`− ${eur(result.usc)}`} tone="deduct" />
          <ResultRow
            label="PRSI"
            value={`− ${eur(result.prsi)}`}
            tone="deduct"
          />
          <ResultRow
            label="Net income"
            value={eur(result.netIncome)}
            strong
            tone="positive"
          />
        </div>

        <details className="mt-4 border-t border-line pt-3 text-sm">
          <summary className="cursor-pointer list-none font-medium text-muted transition-colors duration-200 hover:text-ink">
            How the income tax is worked out
          </summary>
          <div className="mt-3">
            <ResultRow
              label={`Standard rate (20%) up to ${eur(result.standardRateCutOff)}`}
              value={eur(result.taxAtStandard)}
            />
            <ResultRow
              label="Higher rate (40%)"
              value={eur(result.taxAtHigher)}
            />
            <ResultRow label="Gross tax" value={eur(result.grossTax)} />
            <ResultRow
              label="Less tax credits"
              value={`− ${eur(result.taxCredits)}`}
              tone="deduct"
            />
            <ResultRow
              label="Income tax due"
              value={eur(result.incomeTax)}
              strong
            />
          </div>
        </details>
      </div>
    </div>
  );
}

/* ---------- mortgage calculator ---------- */

function MortgageCalculator() {
  const [buyerType, setBuyerType] = useState<BuyerType>("first-time");
  const [income, setIncome] = useState(70_000);
  const [propertyPrice, setPropertyPrice] = useState(400_000);
  const [deposit, setDeposit] = useState(40_000);
  const [ratePercent, setRatePercent] = useState(3.8);
  const [termYears, setTermYears] = useState(30);

  const result = useMemo(
    () =>
      computeMortgage({
        income,
        buyerType,
        propertyPrice,
        deposit,
        ratePercent,
        termYears,
      }),
    [income, buyerType, propertyPrice, deposit, ratePercent, termYears],
  );

  const rules = MORTGAGE_RULES[buyerType];
  const showIncome = rules.ltiMultiple !== null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* inputs */}
      <div className="flex flex-col gap-5">
        <SegmentedField
          label="Buyer type"
          value={buyerType}
          onChange={setBuyerType}
          options={[
            { value: "first-time", label: "First-time" },
            { value: "mover", label: "Mover" },
            { value: "btl", label: "Buy-to-let" },
          ]}
        />
        {showIncome && (
          <CurrencyField
            label="Gross annual income (household)"
            value={income}
            onChange={setIncome}
            hint={`Loan-to-income limit: ${rules.ltiMultiple}× income`}
          />
        )}
        <CurrencyField
          label="Property price"
          value={propertyPrice}
          onChange={setPropertyPrice}
        />
        <CurrencyField
          label="Deposit"
          value={deposit}
          onChange={setDeposit}
          hint={`Minimum deposit: ${pct(1 - rules.maxLtv)} (${eur(
            result.minDeposit,
          )})`}
        />
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Interest rate"
            value={ratePercent}
            onChange={setRatePercent}
            suffix="%"
            step={0.1}
          />
          <NumberField
            label="Term"
            value={termYears}
            onChange={setTermYears}
            suffix="yrs"
            min={1}
            step={1}
          />
        </div>
        <p className="text-xs leading-5 text-muted">
          Borrowing limits follow Central Bank of Ireland macroprudential rules.
          Lenders may apply exemptions and their own affordability tests — this
          is an indicative estimate only.
        </p>
      </div>

      {/* results */}
      <div className="rounded-sm border-t-2 border-primary-400 bg-surface p-6 shadow-sm shadow-navy-900/5">
        <h3 className="font-display text-base font-medium text-ink">
          Monthly repayment
        </h3>
        <p className="mt-4 font-display text-3xl font-semibold tabular-nums text-ink">
          {eur(result.monthlyRepayment)}
          <span className="ml-1.5 text-sm font-normal text-muted">/month</span>
        </p>
        <p className="mt-0.5 text-sm text-muted">
          on a {eur(result.requestedLoan)} loan over {termYears} years
        </p>

        <div className="mt-5">
          <ResultRow label="Loan required" value={eur(result.requestedLoan)} />
          <ResultRow
            label="Deposit"
            value={`${eur(deposit)} (${pct(result.depositPercent)})`}
          />
          {showIncome && result.maxByLti !== null && (
            <ResultRow
              label={`Max by income (${rules.ltiMultiple}×)`}
              value={eur(result.maxByLti)}
            />
          )}
          <ResultRow
            label={`Max by LTV (${pct(rules.maxLtv)})`}
            value={eur(result.maxByLtv)}
          />
          <ResultRow label="Maximum loan" value={eur(result.maxLoan)} strong />
        </div>

        <div
          className={`mt-4 rounded-sm border px-4 py-3 text-sm leading-6 ${
            result.withinLimits
              ? "border-secondary-400/40 bg-secondary-50 text-secondary-600"
              : "border-primary-400/40 bg-primary-50 text-primary-600"
          }`}
        >
          {result.withinLimits ? (
            <>Within Central Bank limits for a {rules.label.toLowerCase()}.</>
          ) : result.bindingConstraint === "income" ? (
            <>
              Loan exceeds the {rules.ltiMultiple}× income limit by{" "}
              {eur(result.requestedLoan - result.maxLoan)}. Increase income or
              deposit.
            </>
          ) : (
            <>
              Deposit is {eur(result.depositShortfall)} short of the{" "}
              {pct(1 - rules.maxLtv)} minimum for this property price.
            </>
          )}
        </div>

        <div className="mt-4 border-t border-line pt-3">
          <ResultRow label="Total interest" value={eur(result.totalInterest)} />
          <ResultRow
            label="Total repayable"
            value={eur(result.totalRepayable)}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- shell with tabs ---------- */

type Tab = "tax" | "mortgage";

export function IrelandCalculator() {
  const [tab, setTab] = useState<Tab>("tax");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Calculator"
        className="inline-flex gap-1 rounded-md border border-line bg-surface-muted p-1"
      >
        {(
          [
            { id: "tax", label: "Income tax" },
            { id: "mortgage", label: "Mortgage" },
          ] as const
        ).map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`cursor-pointer rounded-sm px-5 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                active
                  ? "bg-surface text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {tab === "tax" ? <IncomeTaxCalculator /> : <MortgageCalculator />}
      </div>

      <p className="mt-8 text-sm leading-6 text-muted">
        These calculators give indicative estimates for the Republic of Ireland
        only and are not tax or financial advice. For a precise assessment,{" "}
        <Link
          href="/contact"
          className="font-medium text-primary-500 transition-colors duration-200 hover:text-primary-600"
        >
          talk to our team
        </Link>
        .
      </p>
    </div>
  );
}

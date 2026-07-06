"use client";

/* Ireland VAT calculator — Add VAT (net → gross) or Remove VAT (gross → net).
   All maths + rates live in ../lib/ireland-vat (single source of truth). This
   component only renders; it computes live via that pure engine. */

import { useMemo, useState } from "react";
import {
  addVat,
  removeVat,
  getVatRate,
  VAT_RATES,
  VAT_CATEGORIES,
  VAT_THRESHOLDS,
  VAT_LAST_REVIEWED,
  VAT_SOURCE_URL,
} from "../lib/ireland-vat";
import {
  CurrencyField,
  LegendDot,
  ProportionBar,
  ResultDisclaimer,
  SegmentedField,
  SelectField,
} from "./calculator-fields";

type Mode = "add" | "remove";

const money = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const eur0 = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export function IrelandVatCalculator() {
  const [mode, setMode] = useState<Mode>("add");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<string>(VAT_CATEGORIES[0].label);

  // The chosen category resolves the rate automatically — the user never
  // has to know the percentage.
  const selected =
    VAT_CATEGORIES.find((c) => c.label === category) ?? VAT_CATEGORIES[0];
  const rate = getVatRate(selected.rateKey);
  const result = useMemo(
    () =>
      mode === "add"
        ? addVat(amount, rate.percent)
        : removeVat(amount, rate.percent),
    [mode, amount, rate.percent],
  );

  const amountLabel =
    mode === "add" ? "Net amount (excluding VAT)" : "Gross amount (including VAT)";

  // Hero = the figure this mode produces (the other two support it).
  const heroValue = mode === "add" ? result.gross : result.net;
  const heroLabel = mode === "add" ? "Gross (incl. VAT)" : "Net (excl. VAT)";

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* inputs */}
      <div className="flex flex-col gap-5">
        <SegmentedField<Mode>
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "add", label: "Add VAT" },
            { value: "remove", label: "Remove VAT" },
          ]}
        />

        <div>
          <SelectField
            label="Goods or service"
            value={category}
            onChange={setCategory}
            hint="Pick what you're selling — the correct VAT rate is applied for you."
          >
            {VAT_RATES.map((r) => {
              const items = VAT_CATEGORIES.filter((c) => c.rateKey === r.key);
              if (items.length === 0) return null;
              return (
                <optgroup key={r.key} label={r.label}>
                  {items.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </SelectField>

          {/* rate resolved automatically from the category above */}
          <div className="mt-2.5 flex items-start gap-3 border-l-[3px] border-primary-500 bg-surface-muted px-3 py-2.5">
            <span className="shrink-0 rounded-none bg-primary-500 px-2 py-1 font-display text-xs font-semibold tabular-nums text-white">
              {rate.percent}% VAT
            </span>
            <p className="text-xs leading-5 text-muted">
              <span className="font-medium text-ink">
                {rate.label.split(" — ")[0]} rate
              </span>{" "}
              — {rate.applies}.
              {rate.note && <span className="mt-1 block">{rate.note}</span>}
            </p>
          </div>
        </div>

        <CurrencyField
          label={amountLabel}
          value={amount}
          onChange={setAmount}
        />
      </div>

      {/* results */}
      <div className="flex flex-col">
        <div className="border border-line bg-surface">
          {/* hero: the figure this mode produces + net/VAT split bar */}
          <div className="border-b border-line px-5 py-5 sm:px-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {heroLabel}
              </p>
              <span className="text-xs text-muted tabular-nums">
                {rate.percent}% rate
              </span>
            </div>
            <p className="mt-3 font-display text-[2.5rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
              {money(heroValue)}
            </p>
            <p className="mt-2.5 text-sm text-muted">
              <span className="font-semibold text-primary-600 tabular-nums">
                {money(result.vat)}
              </span>{" "}
              VAT at {rate.percent}%
            </p>
            <div className="mt-4">
              <ProportionBar
                segments={[
                  {
                    label: `Net ${money(result.net)}`,
                    value: result.net,
                    className: "bg-navy-900",
                  },
                  {
                    label: `VAT ${money(result.vat)}`,
                    value: result.vat,
                    className: "bg-primary-500",
                  },
                ]}
              />
            </div>
          </div>

          {/* breakdown */}
          <dl className="divide-y divide-line">
            <div className="flex items-baseline justify-between gap-4 px-5 py-3.5 sm:px-6">
              <div className="flex items-baseline gap-2.5">
                <LegendDot className="bg-navy-900" />
                <span className="text-sm text-ink-body">Net (excl. VAT)</span>
              </div>
              <span className="text-sm font-medium text-ink tabular-nums">
                {money(result.net)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 px-5 py-3.5 sm:px-6">
              <div className="flex items-baseline gap-2.5">
                <LegendDot className="bg-primary-500" />
                <span className="text-sm text-ink-body">VAT @ {rate.percent}%</span>
              </div>
              <span className="text-sm font-medium text-ink tabular-nums">
                {money(result.vat)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 bg-surface-muted px-5 py-3.5 sm:px-6">
              <span className="text-sm font-semibold text-ink">Gross (incl. VAT)</span>
              <span className="font-display text-sm font-semibold text-ink tabular-nums">
                {money(result.gross)}
              </span>
            </div>
          </dl>
        </div>

        {/* registration thresholds — read from config */}
        <div className="mt-5 border border-line bg-surface p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            VAT registration thresholds
          </h3>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-body">
            <span>
              Goods:{" "}
              <span className="font-semibold text-ink">{eur0(VAT_THRESHOLDS.goods)}</span>
            </span>
            <span>
              Services:{" "}
              <span className="font-semibold text-ink">{eur0(VAT_THRESHOLDS.services)}</span>
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            Turnover limits in any 12-month period, in force since{" "}
            {VAT_THRESHOLDS.since}. You must register once turnover exceeds — or
            is likely to exceed — the limit for your activity.
          </p>
        </div>

        <ResultDisclaimer asOf={VAT_LAST_REVIEWED} sourceUrl={VAT_SOURCE_URL} />
      </div>
    </div>
  );
}

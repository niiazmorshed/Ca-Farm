"use client";

/* Ireland Corporation Tax calculator — trading (12.5%) vs passive (25%).
   The user classifies which income is which; this component never guesses.
   All maths + rates live in ../lib/ireland-corporation-tax (single source of
   truth); this renders and computes live via that pure engine. */

import { useMemo, useState } from "react";
import {
  computeCorporationTax,
  CT_RATES,
  CT_LAST_REVIEWED,
  CT_SOURCE_URL,
  PILLAR_TWO,
} from "../lib/ireland-corporation-tax";
import {
  CurrencyField,
  LegendDot,
  ProportionBar,
  ResultDisclaimer,
} from "./calculator-fields";

const money = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const pct2 = (fraction: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fraction);

const share = (fraction: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(fraction);

/* One breakdown line: colour swatch · label · (share of tax) · amount. */
function BreakdownRow({
  dotClass,
  label,
  value,
  shareOfTotal,
}: {
  dotClass: string;
  label: string;
  value: string;
  shareOfTotal: number | null;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-3.5 sm:px-6">
      <div className="flex items-baseline gap-2.5">
        <LegendDot className={dotClass} />
        <span className="text-sm text-ink-body">{label}</span>
      </div>
      <div className="flex items-baseline gap-3">
        {shareOfTotal !== null && (
          <span className="text-xs text-muted tabular-nums">{share(shareOfTotal)}</span>
        )}
        <span className="text-sm font-medium text-ink tabular-nums">{value}</span>
      </div>
    </div>
  );
}

export function IrelandCorporationTaxCalculator() {
  const [tradingProfit, setTradingProfit] = useState(0);
  const [passiveIncome, setPassiveIncome] = useState(0);

  const result = useMemo(
    () => computeCorporationTax({ tradingProfit, passiveIncome }),
    [tradingProfit, passiveIncome],
  );

  const hasTax = result.totalTax > 0;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* inputs */}
      <div className="flex flex-col gap-5">
        <div className="border-l-[3px] border-primary-500 bg-surface-muted px-4 py-3 text-xs leading-5 text-ink-body">
          <span className="font-semibold text-ink">You decide the split.</span>{" "}
          Trading income is active business profit (12.5%); passive income is
          rent, interest and most foreign dividends (25%). Enter each figure
          where it belongs — the tool never classifies for you.
        </div>

        <CurrencyField
          label="Trading profit"
          value={tradingProfit}
          onChange={setTradingProfit}
          hint="Active business trading profits — taxed at 12.5%."
        />
        <CurrencyField
          label="Passive / non-trading income"
          value={passiveIncome}
          onChange={setPassiveIncome}
          hint="Rental income, interest and most foreign dividends — taxed at 25%."
        />

        <div className="mt-auto border border-line bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Not included
          </p>
          <p className="mt-2 text-xs leading-5 text-muted">
            Headline rates only. The R&amp;D credit, Knowledge Development Box,
            close-company surcharge and start-up relief can each change the final
            bill — that&rsquo;s a conversation, not a slider.
          </p>
        </div>
      </div>

      {/* results */}
      <div className="flex flex-col">
        <div className="border border-line bg-surface">
          {/* hero: total tax + blended rate + split bar */}
          <div className="border-b border-line px-5 py-5 sm:px-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Corporation tax
              </p>
              <span className="text-xs text-muted tabular-nums">
                on {money(result.totalProfit)} profit
              </span>
            </div>
            <p className="mt-3 font-display text-[2.5rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
              {money(result.totalTax)}
            </p>
            <p className="mt-2.5 text-sm text-muted">
              Total tax ·{" "}
              <span className="font-semibold text-primary-600 tabular-nums">
                {pct2(result.effectiveRate)}
              </span>{" "}
              blended effective rate
            </p>
            <div className="mt-4">
              <ProportionBar
                segments={[
                  {
                    label: `Trading tax ${money(result.tradingTax)}`,
                    value: result.tradingTax,
                    className: "bg-primary-500",
                  },
                  {
                    label: `Passive tax ${money(result.passiveTax)}`,
                    value: result.passiveTax,
                    className: "bg-navy-900",
                  },
                ]}
              />
            </div>
          </div>

          {/* breakdown */}
          <dl className="divide-y divide-line">
            <BreakdownRow
              dotClass="bg-primary-500"
              label={`Trading tax @ ${CT_RATES.tradingPercent}%`}
              value={money(result.tradingTax)}
              shareOfTotal={hasTax ? result.tradingTax / result.totalTax : null}
            />
            <BreakdownRow
              dotClass="bg-navy-900"
              label={`Passive tax @ ${CT_RATES.passivePercent}%`}
              value={money(result.passiveTax)}
              shareOfTotal={hasTax ? result.passiveTax / result.totalTax : null}
            />
          </dl>
        </div>

        {/* Pillar Two — info note, never a live input (read from config) */}
        <div className="mt-5 border border-line bg-surface p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Large groups: Pillar Two
          </h3>
          <p className="mt-2 text-xs leading-5 text-muted">{PILLAR_TWO.note}</p>
        </div>

        <ResultDisclaimer asOf={CT_LAST_REVIEWED} sourceUrl={CT_SOURCE_URL} />
      </div>
    </div>
  );
}

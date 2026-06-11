"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon } from "./ui";
import type { PricingTier } from "../lib/content";

export function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${annual ? "text-sage-600" : "text-ink"}`}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-label="Bill annually"
          onClick={() => setAnnual((value) => !value)}
          className={`relative h-7 w-12 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 ${
            annual ? "bg-forest-800" : "bg-line"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-parchment shadow transition-all duration-200 ${
              annual ? "left-6" : "left-1"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${annual ? "text-ink" : "text-sage-600"}`}
        >
          Annual
          <span className="ml-1.5 rounded-full bg-brass-400/20 px-2 py-0.5 text-xs font-semibold text-brass-700">
            2 months free
          </span>
        </span>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-2xl border bg-surface p-8 ${
              tier.popular
                ? "border-brass-400 shadow-xl shadow-forest-950/5"
                : "border-line"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brass-400 px-3 py-1 text-xs font-semibold whitespace-nowrap text-forest-950">
                Most popular
              </span>
            )}
            <h2 className="font-display text-xl font-medium tracking-tight">
              {tier.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-sage-600">{tier.blurb}</p>
            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="text-sm text-sage-600">from</span>
              <span className="font-display text-4xl font-medium tracking-tight">
                £{annual ? tier.annualMonthly : tier.monthly}
              </span>
              <span className="text-sm text-sage-600">/mo + VAT</span>
            </p>
            <p className="mt-1 text-xs text-sage-500">
              {annual ? "billed annually" : "billed monthly, cancel any time"}
            </p>
            <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-line pt-6">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm leading-6 text-sage-700"
                >
                  <span className="mt-1 text-brass-600">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={`mt-8 inline-flex h-11 cursor-pointer items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                tier.popular
                  ? "bg-brass-400 text-forest-950 hover:bg-brass-300 focus-visible:outline-brass-600"
                  : "bg-forest-950 text-parchment hover:bg-forest-800 focus-visible:outline-forest-700"
              }`}
            >
              Get started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

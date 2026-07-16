"use client";

/* Founders Hub resource browser. The tab strip is a 1:1 visual copy of the
   Ireland-calculators switcher (calculator-tabs.tsx TabInner) so both hubs
   share one design language — the only difference is these tabs switch a
   category client-side instead of navigating between routes. */

import { useState } from "react";
import Link from "next/link";
import {
  TOOLKIT_CATEGORIES,
  type ToolkitCategory,
  type ToolkitResource,
} from "../lib/toolkit-types";
import { STARTER_RESOURCES, type StarterResource } from "../lib/toolkit-content";

/* Tab labels kept short so the strip scans like the calculators one. */
const TAB_LABELS: Record<ToolkitCategory, string> = {
  memo: "Memos",
  template: "Templates",
  "tax-form": "Tax forms",
  "vat-form": "VAT forms",
  guide: "Setup guides",
  other: "Other",
};

const CATEGORY_INTROS: Record<ToolkitCategory, string> = {
  memo: "Short technical notes on the tax questions founders ask us most.",
  template: "Ready-to-use documents and spreadsheets for the day-to-day running of the business.",
  "tax-form": "Walkthroughs and checklists for the Revenue forms you will actually file.",
  "vat-form": "VAT registration and the returns cycle, explained for Ireland and the UK.",
  guide: "Step-by-step playbooks for starting and structuring a business.",
  other: "Everything else worth having to hand.",
};

/* ---------- tab visuals (mirrors calculator-tabs.tsx exactly) ---------- */

function TabInner({ label, active }: { label: string; active: boolean }) {
  return (
    <>
      <span
        className={`relative z-10 block px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
          active ? "text-white" : "text-ink group-hover:text-white group-focus-visible:text-white"
        }`}
      >
        {label}
      </span>
      {/* top & bottom rule */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 origin-center border-y-2 border-primary-500 transition-all duration-300 ${
          active
            ? "scale-y-100 opacity-100"
            : "scale-y-[2] opacity-0 group-hover:scale-y-100 group-hover:opacity-100 group-focus-visible:scale-y-100 group-focus-visible:opacity-100"
        }`}
      />
      {/* fill */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 inset-y-[2px] origin-top bg-primary-500 transition-all duration-300 ${
          active
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
        }`}
      />
    </>
  );
}

/* ---------- cards ---------- */

const addedOn = (iso: string) =>
  new Intl.DateTimeFormat("en-IE", { dateStyle: "medium" }).format(new Date(iso));

const ctaLink =
  "whitespace-nowrap text-sm font-semibold text-primary-500 transition-colors duration-200 hover:text-primary-600";

function FormatTag({ format }: { format: string }) {
  return (
    <span className="shrink-0 rounded-none bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-600">
      {format}
    </span>
  );
}

/* Live card — a real uploaded file (or external link) from the admin. */
function UploadedCard({ resource }: { resource: ToolkitResource }) {
  return (
    <div className="flex flex-col rounded-none border border-line bg-surface p-6">
      <h3 className="font-display text-base font-medium tracking-tight text-ink">
        {resource.title}
      </h3>
      {resource.description && (
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{resource.description}</p>
      )}
      <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-4">
        <span className="text-xs text-muted">Added {addedOn(resource.createdAt)}</span>
        <a href={resource.fileUrl} target="_blank" rel="noopener" className={ctaLink}>
          {resource.filePath ? "Download" : "Open"} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

/* Starter card — a resource our team is finalising (no file yet). */
function StarterCard({ resource }: { resource: StarterResource }) {
  return (
    <div className="flex flex-col rounded-none border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-medium tracking-tight text-ink">
          {resource.title}
        </h3>
        <FormatTag format={resource.format} />
      </div>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{resource.description}</p>
      <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          In preparation
        </span>
        <Link href="/contact" className={ctaLink}>
          Request a copy <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/* ---------- browser ---------- */

export function ToolkitBrowser({ uploaded }: { uploaded: ToolkitResource[] }) {
  /* Only show tabs that have something behind them. */
  const categories = TOOLKIT_CATEGORIES.filter(
    (c) =>
      uploaded.some((r) => r.category === c.value) ||
      STARTER_RESOURCES.some((r) => r.category === c.value),
  );
  const [active, setActive] = useState<ToolkitCategory>(
    categories[0]?.value ?? "memo",
  );

  const uploadedItems = uploaded.filter((r) => r.category === active);
  const starterItems = STARTER_RESOURCES.filter((r) => r.category === active);

  return (
    <div>
      <nav aria-label="Resource categories" className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Founder resources
        </p>
        <div role="tablist" className="flex flex-wrap gap-x-3 gap-y-2">
          {categories.map((category) => {
            const isActive = category.value === active;
            return (
              <button
                key={category.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(category.value)}
                className="group relative inline-block cursor-pointer outline-none"
              >
                <TabInner label={TAB_LABELS[category.value]} active={isActive} />
              </button>
            );
          })}
        </div>
      </nav>

      <p className="text-sm leading-6 text-muted">{CATEGORY_INTROS[active]}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {uploadedItems.map((resource) => (
          <UploadedCard key={resource.id} resource={resource} />
        ))}
        {starterItems.map((resource) => (
          <StarterCard key={resource.title} resource={resource} />
        ))}
      </div>
    </div>
  );
}

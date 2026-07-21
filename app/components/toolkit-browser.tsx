"use client";

/* Founders Hub resource browser. The tab strip is a 1:1 visual copy of the
   Ireland-calculators switcher (calculator-tabs.tsx TabInner) so both hubs
   share one design language — the only difference is these tabs switch a
   category client-side instead of navigating between routes.

   Two clearly-separated groups per tab so real downloads never read as
   "coming soon":
     • Available now  — real uploads from /admin/toolkits, shown as cards.
     • In preparation — the curated catalogue (toolkit-content.ts), shown as a
       lighter list with a request-a-copy link. */

import { useState } from "react";
import Link from "next/link";
import {
  TOOLKIT_CATEGORIES,
  type ToolkitCategory,
  type ToolkitResource,
} from "../lib/toolkit-types";
import { STARTER_RESOURCES, type StarterResource } from "../lib/toolkit-content";

/* Short tab labels so the strip scans like the calculators one. */
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
  template: "Ready-to-use statements, workings and checklists for day-to-day reporting.",
  "tax-form": "Walkthroughs and checklists for the Revenue forms you actually file.",
  "vat-form": "VAT registration and the returns cycle, for Ireland and the UK.",
  guide: "Step-by-step playbooks for setting up, running and closing a company.",
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

/* ---------- shared bits ---------- */

const addedOn = (iso: string) =>
  new Intl.DateTimeFormat("en-IE", { dateStyle: "medium" }).format(new Date(iso));

const ctaLink =
  "whitespace-nowrap text-sm font-semibold text-primary-500 transition-colors duration-200 hover:text-primary-600";

function Badge({ tone, children }: { tone: "framework" | "format"; children: React.ReactNode }) {
  const cls =
    tone === "framework"
      ? "bg-secondary-50 text-secondary-600"
      : "bg-surface-muted text-muted";
  return (
    <span className={`shrink-0 rounded-none px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  );
}

function GroupHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </h3>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
    </div>
  );
}

/* ---------- Available now: real uploaded file, shown as a card ---------- */

function UploadedCard({ resource }: { resource: ToolkitResource }) {
  return (
    <div className="flex flex-col rounded-none border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-base font-medium tracking-tight text-ink">
          {resource.title}
        </h4>
        {resource.framework && <Badge tone="framework">{resource.framework}</Badge>}
      </div>
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

/* ---------- In preparation: curated catalogue, shown as a light list ---------- */

function StarterRow({ resource }: { resource: StarterResource }) {
  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-medium text-ink">{resource.title}</p>
          {resource.framework && <Badge tone="framework">{resource.framework}</Badge>}
          <Badge tone="format">{resource.format}</Badge>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted">{resource.description}</p>
      </div>
      <Link href="/contact" className={`${ctaLink} shrink-0`}>
        Request a copy <span aria-hidden="true">→</span>
      </Link>
    </li>
  );
}

function StarterList({ items }: { items: StarterResource[] }) {
  return (
    <ul className="divide-y divide-line rounded-none border border-line bg-surface-muted/40">
      {items.map((resource) => (
        <StarterRow key={resource.title} resource={resource} />
      ))}
    </ul>
  );
}

/* ---------- browser ---------- */

export function ToolkitBrowser({ uploaded }: { uploaded: ToolkitResource[] }) {
  /* Show any category that has real uploads or curated cards behind it. */
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

      <div className="mt-8 flex flex-col gap-10">
        {uploadedItems.length > 0 && (
          <section>
            <GroupHeading label="Available now" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedItems.map((resource) => (
                <UploadedCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        )}

        {starterItems.length > 0 && (
          <section>
            <GroupHeading label="In preparation" />
            <p className="mb-4 -mt-1 text-sm leading-6 text-muted">
              Being finalised by our team — request a copy and we&apos;ll email it
              to you the moment it&apos;s ready.
            </p>
            <StarterList items={starterItems} />
          </section>
        )}
      </div>
    </div>
  );
}

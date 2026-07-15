import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, PageHero } from "../components/ui";
import { ContactCta } from "../components/sections";
import {
  getToolkitResources,
  TOOLKIT_CATEGORIES,
  type ToolkitResource,
} from "../lib/toolkit-data";
import { STARTER_RESOURCES, type StarterResource } from "../lib/toolkit-content";

export const metadata: Metadata = {
  title: "Entrepreneur Toolkits — memos, templates, tax & VAT forms",
  description:
    "Free downloads for founders and business owners: memos, templates, tax forms, VAT forms and business setup guides for Ireland and the UK.",
};

const addedOn = (iso: string) =>
  new Intl.DateTimeFormat("en-IE", { dateStyle: "medium" }).format(new Date(iso));

function FormatTag({ format }: { format: string }) {
  return (
    <span className="rounded-none bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-600">
      {format}
    </span>
  );
}

/* Live card — a real uploaded file (or external link) from the admin. */
function ResourceCard({ resource }: { resource: ToolkitResource }) {
  return (
    <div className="flex flex-col rounded-none border border-line bg-surface p-6">
      <h3 className="font-display text-base font-medium tracking-tight text-ink">
        {resource.title}
      </h3>
      {resource.description && (
        <p className="mt-2 text-sm leading-6 text-muted">{resource.description}</p>
      )}
      <div className="mt-4 flex flex-1 flex-wrap items-end justify-between gap-3">
        <span className="text-xs text-muted">Added {addedOn(resource.createdAt)}</span>
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-none bg-primary-500 px-5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          {resource.filePath ? "Download" : "Open"}
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  );
}

/* Starter card — content we are preparing (frontend only, no file yet). */
function StarterCard({ resource }: { resource: StarterResource }) {
  return (
    <div className="flex flex-col rounded-none border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-medium tracking-tight text-ink">
          {resource.title}
        </h3>
        <FormatTag format={resource.format} />
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">{resource.description}</p>
      <div className="mt-4 flex flex-1 flex-wrap items-end justify-between gap-3">
        <span className="rounded-none bg-primary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-600">
          In preparation
        </span>
        <Link
          href="/contact"
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-none border border-ink/20 px-5 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink/40 hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
        >
          Request a copy →
        </Link>
      </div>
    </div>
  );
}

export default async function ToolkitsPage() {
  const uploaded = await getToolkitResources();
  const sections = TOOLKIT_CATEGORIES.map((category) => ({
    ...category,
    uploaded: uploaded.filter((r) => r.category === category.value),
    starters: STARTER_RESOURCES.filter((r) => r.category === category.value),
  })).filter((s) => s.uploaded.length > 0 || s.starters.length > 0);

  return (
    <>
      <PageHero
        image="office"
        breadcrumb={
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Entrepreneur Toolkits" }]}
          />
        }
        title="Entrepreneur Toolkits"
        lede="Practical downloads for founders and business owners — memos, templates, tax and VAT forms, and step-by-step business setup guides for Ireland and the UK."
      />

      <Container className="py-16 sm:py-20">
        <div className="flex flex-col gap-12">
          {sections.map((section) => (
            <section key={section.value} aria-labelledby={`toolkit-${section.value}`}>
              <h2
                id={`toolkit-${section.value}`}
                className="font-display text-xl font-medium tracking-tight text-ink"
              >
                {section.label}
              </h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.uploaded.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
                {section.starters.map((resource) => (
                  <StarterCard key={resource.title} resource={resource} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 text-center text-xs leading-5 text-muted">
          Items marked “in preparation” are being finalised by our team — request a
          copy and we&apos;ll email it to you as soon as it&apos;s ready.
        </p>
      </Container>

      <ContactCta />
    </>
  );
}

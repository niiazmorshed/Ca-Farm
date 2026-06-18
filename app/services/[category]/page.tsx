import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, CheckIcon } from "../../components/ui";
import { ContactCta } from "../../components/sections";
import { serviceCategories, getCategory } from "../../lib/content";

export function generateStaticParams() {
  return serviceCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return { title: cat.title, description: cat.blurb };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const comingSoon = cat.status === "coming-soon";
  const isPersona = cat.kind === "personas";
  const isSingle = cat.kind === "single";

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line bg-surface">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_20rem_at_85%_-40%,rgba(134,172,178,0.15),transparent_60%)]"
        />
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="animate-fade-up block">
              <Eyebrow>
                <Link
                  href="/services"
                  className="transition-colors duration-200 hover:text-secondary-400"
                >
                  Services
                </Link>{" "}
                / {cat.title}
              </Eyebrow>
            </span>
            <h1 className="animate-fade-up mt-4 flex flex-wrap items-center gap-3 font-display text-4xl font-medium tracking-tight text-balance text-ink [animation-delay:60ms] sm:text-5xl">
              {cat.title}
              {comingSoon && (
                <span className="rounded-full bg-secondary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-500">
                  Coming soon
                </span>
              )}
            </h1>
            <p className="animate-fade-up mt-5 text-lg leading-8 text-muted [animation-delay:120ms]">
              {cat.overview}
            </p>
            <div className="animate-fade-up mt-7 [animation-delay:180ms]">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary-400 px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
              >
                {comingSoon ? "Register your interest" : `Talk to us about ${cat.title.toLowerCase()}`}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* services / personas: grid of sub-service cards */}
      {!comingSoon && !isSingle && (
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
            {isPersona ? "Who we help" : "What this covers"}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {cat.items.map((item, index) => (
              <article
                key={item.slug}
                className="flex flex-col rounded-2xl border border-line bg-surface p-7"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-sm font-semibold text-primary-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`/services/${cat.slug}/${item.slug}`}
                    className="text-sm font-semibold text-secondary-500 transition-colors duration-200 hover:text-secondary-400"
                  >
                    Details <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-ink">
                  <Link
                    href={`/services/${cat.slug}/${item.slug}`}
                    className="transition-colors duration-200 hover:text-secondary-500"
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2.5 text-[15px] leading-7 text-muted">
                  {item.blurb}
                </p>
              </article>
            ))}
          </div>
        </Container>
      )}

      {/* single: render included / best-for inline like a detail page */}
      {!comingSoon && isSingle && (
        <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
              What’s included
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {(cat.included ?? []).map((entry) => (
                <li
                  key={entry}
                  className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-sm leading-6 text-ink-body"
                >
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-900 text-primary-400">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {entry}
                </li>
              ))}
            </ul>
          </div>
          <aside>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Best for
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {(cat.bestFor ?? []).map((entry) => (
                  <li
                    key={entry}
                    className="border-l-2 border-primary-400 pl-3 text-sm leading-6 text-ink-body"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      )}

      {/* coming soon: simple reassurance block */}
      {comingSoon && (
        <Container className="py-16 sm:py-20">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-8 py-12 text-center">
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
              We’re building this service
            </h2>
            <p className="text-[15px] leading-7 text-muted">
              Tell us what you need and we’ll be in touch the moment it launches —
              or sooner, if we can already help.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-primary-400 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-500"
            >
              Register your interest
            </Link>
          </div>
        </Container>
      )}

      <ContactCta />
    </>
  );
}

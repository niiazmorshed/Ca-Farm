import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, CheckIcon } from "../../../components/ui";
import { ContactCta } from "../../../components/sections";
import { getCategory, getServiceParams } from "../../../lib/content";

export function generateStaticParams() {
  return getServiceParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const cat = getCategory(category);
  const item = cat?.items.find((i) => i.slug === slug);
  if (!cat || !item) return {};
  return { title: `${item.title} — ${cat.title}`, description: item.blurb };
}

export default async function SubServicePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const cat = getCategory(category);
  if (!cat || cat.status === "coming-soon") notFound();
  const index = cat.items.findIndex((i) => i.slug === slug);
  if (index === -1) notFound();
  const item = cat.items[index];
  const isPersona = cat.kind === "personas";
  const siblings = cat.items.filter((i) => i.slug !== slug).slice(0, 3);

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
                /{" "}
                <Link
                  href={`/services/${cat.slug}`}
                  className="transition-colors duration-200 hover:text-secondary-400"
                >
                  {cat.title}
                </Link>
              </Eyebrow>
            </span>
            <h1 className="animate-fade-up mt-4 font-display text-4xl font-medium tracking-tight text-balance text-ink [animation-delay:60ms] sm:text-5xl">
              {item.title}
            </h1>
            <p className="animate-fade-up mt-5 text-lg leading-8 text-muted [animation-delay:120ms]">
              {item.overview}
            </p>
            <div className="animate-fade-up mt-7 [animation-delay:180ms]">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary-400 px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
              >
                Talk to us about {item.title.toLowerCase()}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
            {isPersona ? "What we handle" : "What’s included"}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {item.included.map((entry) => (
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

        <aside className="flex flex-col gap-8">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {isPersona ? "Ideal if" : "Best for"}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {item.bestFor.map((entry) => (
                <li
                  key={entry}
                  className="border-l-2 border-primary-400 pl-3 text-sm leading-6 text-ink-body"
                >
                  {entry}
                </li>
              ))}
            </ul>
          </div>
          {siblings.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {isPersona ? "Also in this area" : "Often paired with"}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {siblings.map((sibling) => (
                  <li key={sibling.slug}>
                    <Link
                      href={`/services/${cat.slug}/${sibling.slug}`}
                      className="text-sm font-medium text-secondary-500 transition-colors duration-200 hover:text-secondary-400"
                    >
                      {sibling.title} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>

      <ContactCta />
    </>
  );
}

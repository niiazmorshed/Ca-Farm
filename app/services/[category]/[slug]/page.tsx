import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  Container,
  Eyebrow,
  PageHero,
  CheckIcon,
} from "../../../components/ui";
import { ContactCta } from "../../../components/sections";
import { Reveal } from "../../../components/reveal";
import { site, getCategory, getServiceParams } from "../../../lib/content";

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
      <PageHero
        image="architecture"
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: cat.title, href: `/services/${cat.slug}` },
              { label: item.title },
            ]}
          />
        }
        title={item.title}
        lede={item.overview}
        action={
          <Button href="/contact">
            Talk to us about {item.title.toLowerCase()}
          </Button>
        }
      />

      <Container className="grid items-start gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_22rem]">
        <Reveal>
          <Eyebrow>{isPersona ? "What we handle" : "What’s included"}</Eyebrow>
          <h2 className="mt-4 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            {isPersona
              ? `Tax and finance, tailored to ${item.title.toLowerCase()}`
              : `Everything ${item.title.toLowerCase()} covers`}
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {item.included.map((entry) => (
              <li
                key={entry}
                className="flex items-start gap-3 rounded-sm border border-line bg-surface p-4 text-sm leading-6 text-ink-body transition-colors duration-200 hover:border-primary-300"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-sm bg-navy-900 text-primary-300">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {entry}
              </li>
            ))}
          </ul>
        </Reveal>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
          <div className="rounded-sm bg-navy-900 p-7 text-white">
            <h2 className="font-display text-lg font-medium tracking-tight">
              Talk to us about {item.title.toLowerCase()}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              A partner-led conversation, scoped to your situation. No pitch, no
              obligation.
            </p>
            <Button href="/contact" className="mt-5 w-full">
              Book a free consultation
            </Button>
            <a
              href={site.phoneHref}
              className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-primary-300 transition-colors duration-200 hover:text-primary-400"
            >
              {site.phone}
            </a>
          </div>

          <div className="rounded-sm border-t-2 border-primary-400 bg-surface p-6 shadow-sm shadow-navy-900/5">
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
        </aside>
      </Container>

      {siblings.length > 0 && (
        <section className="border-t border-line bg-canvas">
          <Container className="py-16 sm:py-20">
            <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
                More in {cat.title}
              </h2>
              <Link
                href={`/services/${cat.slug}`}
                className="text-sm font-semibold text-primary-500 transition-colors duration-200 hover:text-primary-600"
              >
                View all <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
              {siblings.map((sibling) => (
                <Link
                  key={sibling.slug}
                  href={`/services/${cat.slug}/${sibling.slug}`}
                  className="group relative flex flex-col bg-surface p-6 transition-colors duration-200 hover:bg-secondary-50/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-500"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-0.5 w-0 bg-primary-400 transition-all duration-300 group-hover:w-full"
                  />
                  <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                    {sibling.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
                    {sibling.blurb}
                  </p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-primary-500">
                    Details <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
            </Reveal>
          </Container>
        </section>
      )}

      <ContactCta />
    </>
  );
}

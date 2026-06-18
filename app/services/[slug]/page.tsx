import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, CheckIcon } from "../../components/ui";
import { ContactCta } from "../../components/sections";
import { services } from "../../lib/content";

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.blurb };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const service = services[index];
  const related = [
    services[(index + 1) % services.length],
    services[(index + 2) % services.length],
  ];

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
                / {String(index + 1).padStart(2, "0")}
              </Eyebrow>
            </span>
            <h1 className="animate-fade-up mt-4 font-display text-4xl font-medium tracking-tight text-balance text-ink [animation-delay:60ms] sm:text-5xl">
              {service.title}
            </h1>
            <p className="animate-fade-up mt-5 text-lg leading-8 text-muted [animation-delay:120ms]">
              {service.overview}
            </p>
            <div className="animate-fade-up mt-7 [animation-delay:180ms]">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary-400 px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
              >
                Talk to us about {service.title.toLowerCase()}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
            What’s included
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {service.included.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-sm leading-6 text-ink-body"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-900 text-primary-400">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="flex flex-col gap-8">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Best for
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {service.bestFor.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-primary-400 pl-3 text-sm leading-6 text-ink-body"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Often paired with
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="text-sm font-medium text-secondary-500 transition-colors duration-200 hover:text-secondary-400"
                  >
                    {item.title} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>

      <ContactCta />
    </>
  );
}

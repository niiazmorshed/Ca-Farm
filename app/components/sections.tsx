import Link from "next/link";
import { Container, Eyebrow, SectionHeading } from "./ui";
import { industries, services, site } from "../lib/content";

/* ---------- hero ---------- */

const heroFigures: [string, string][] = [
  ["Client tax saved", "£612k"],
  ["Filings submitted on time", "100%"],
  ["Median reply time", "< 1 business day"],
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 text-parchment">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70rem_45rem_at_12%_-12%,rgba(203,167,93,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50rem_35rem_at_100%_110%,rgba(39,115,90,0.35),transparent_65%)]" />
        <div className="absolute inset-0 opacity-55 [background:repeating-radial-gradient(circle_at_88%_18%,transparent_0_64px,rgba(245,241,232,0.05)_64px_65px)]" />
      </div>

      <Container className="grid gap-14 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-32">
        <div className="flex max-w-2xl flex-col items-start gap-6">
          <div className="animate-fade-up">
            <Eyebrow tone="dark">Chartered Accountants &amp; Business Advisors</Eyebrow>
          </div>
          <h1 className="animate-fade-up font-display text-4xl font-medium leading-[1.06] tracking-tight text-balance [animation-delay:60ms] sm:text-5xl lg:text-6xl">
            Solid ground for{" "}
            <em className="italic text-brass-300">growing</em> businesses.
          </h1>
          <p className="animate-fade-up max-w-xl text-lg leading-8 text-parchment/75 [animation-delay:120ms]">
            CA Farm pairs partner-led accounting with modern cloud tools —
            audit, tax, payroll and advisory that keep you compliant today and
            ready for what comes next.
          </p>
          <div className="animate-fade-up flex flex-col gap-3 [animation-delay:180ms] sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-brass-400 px-7 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-brass-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
            >
              Book a free consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-parchment/25 px-7 text-sm font-medium text-parchment transition-colors duration-200 hover:border-parchment/50 hover:bg-parchment/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parchment/60"
            >
              Explore services
            </Link>
          </div>
          <ul className="animate-fade-up mt-2 flex flex-wrap gap-x-7 gap-y-2 border-t border-parchment/15 pt-5 text-sm text-parchment/60 [animation-delay:240ms]">
            <li>ICAEW-registered practice</li>
            <li>20+ years in practice</li>
            <li>500+ clients served</li>
          </ul>
        </div>

        <div className="animate-fade-up relative [animation-delay:200ms] lg:justify-self-end">
          <div className="w-full max-w-md rounded-3xl border border-parchment/12 bg-forest-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-parchment/70">
                This quarter, across our clients
              </p>
              <span className="rounded-full bg-forest-700/60 px-3 py-1 text-xs font-medium whitespace-nowrap text-brass-300">
                On track
              </span>
            </div>
            <div className="mt-6 flex h-28 items-end gap-2" aria-hidden="true">
              {[38, 52, 34, 64, 48, 74, 60, 88].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-brass-700/70 to-brass-400"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <dl className="mt-6 divide-y divide-parchment/10 border-t border-parchment/10">
              {heroFigures.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3"
                >
                  <dt className="text-sm text-parchment/65">{label}</dt>
                  <dd className="font-display text-base font-semibold">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- client strip (marquee) ---------- */

const clients = [
  "Northfield & Co",
  "Hartley Dairy",
  "Bloom Studio",
  "Cedar Logistics",
  "Marrow Kitchen",
  "Atlas Crane",
];

export function LogoStrip() {
  return (
    <section className="border-b border-line bg-parchment">
      <Container className="flex flex-col items-center gap-5 py-10">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-sage-500">
          Trusted by founders, family firms and growing teams
        </p>
        <ul className="sr-only">
          {clients.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        >
          <div className="flex w-max animate-marquee">
            {[...clients, ...clients].map((name, index) => (
              <span
                key={index}
                className="mr-14 whitespace-nowrap font-display text-lg font-medium text-ink/35"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- services ---------- */

export function Services() {
  return (
    <section id="services" className="scroll-mt-24">
      <Container className="py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="What we do"
            title="Full-service accounting, from seed to scale."
            lede="One firm for the whole journey — whether you need year-end accounts done properly or a finance function without the headcount."
          />
          <Link
            href="/services"
            className="text-sm font-semibold text-forest-700 transition-colors duration-200 hover:text-forest-600"
          >
            All services <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brass-400/50 hover:shadow-xl hover:shadow-forest-950/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
            >
              <span className="font-display text-sm font-semibold text-brass-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-medium tracking-tight">
                {service.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-7 text-sage-600">
                {service.blurb}
              </p>
              <span className="mt-auto pt-5 text-sm font-medium text-forest-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                Learn more <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- industries ---------- */

export function Industries() {
  return (
    <section className="border-t border-line">
      <Container className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="Who we serve"
          title="Deep benches in the sectors we know best."
          lede="Every industry has its own tax quirks and rhythms. These are the ones we work in every day."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <h3 className="font-display text-lg font-medium tracking-tight">
                {industry.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-sage-600">
                {industry.note}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- process ---------- */

const steps = [
  {
    title: "Discovery call",
    description:
      "A free 30-minute conversation about where your books stand and what you need — no pitch, no jargon.",
  },
  {
    title: "Fixed-fee proposal",
    description:
      "A clear scope and a fixed monthly fee. You know exactly what it costs before you commit.",
  },
  {
    title: "Painless onboarding",
    description:
      "We collect records, talk to your previous accountant and set up your cloud stack. You sign one letter.",
  },
  {
    title: "Year-round care",
    description:
      "Monthly accounts, deadline tracking and proactive tax planning — not just a January scramble.",
  },
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 border-y border-line bg-surface">
      <Container className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="How we work"
          title="A simple path to tidy books."
          lede="Switching accountants sounds painful. We’ve made it four steps, and we do the heavy lifting."
        />
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="relative border-t border-line pt-6">
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-12 bg-brass-500"
              />
              <span className="font-display text-3xl font-medium text-brass-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-medium">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-sage-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ---------- stats ---------- */

const stats = [
  { value: "20+", label: "years in practice" },
  { value: "500+", label: "businesses served" },
  { value: "£40m+", label: "saved for clients in tax" },
  { value: "98%", label: "client retention" },
];

export function Stats() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 text-parchment">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_85%_120%,rgba(203,167,93,0.12),transparent_60%)]"
      />
      <Container className="py-16 sm:py-20">
        <dl className="grid gap-x-8 gap-y-10 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <dd className="order-1 font-display text-4xl font-medium tracking-tight text-brass-300 sm:text-5xl">
                {stat.value}
              </dd>
              <dt className="order-2 text-sm text-parchment/65">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ---------- testimonials ---------- */

const testimonials = [
  {
    quote:
      "CA Farm took our year-end from a three-week scramble to a non-event. The books are just — done.",
    name: "Priya Shah",
    role: "Founder, Bloom Studio",
  },
  {
    quote:
      "They found £40k in R&D relief our previous accountant never mentioned. They’ve paid for themselves many times over.",
    name: "Marcus Hale",
    role: "Director, Cedar Logistics",
  },
  {
    quote:
      "Proper partner-led service. I message our accountant and get an answer the same day — not a ticket number.",
    name: "Hannah Okafor",
    role: "COO, Marrow Kitchen",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24">
      <Container className="py-20 sm:py-24">
        <SectionHeading eyebrow="Client stories" title="Don’t take our word for it." />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col rounded-2xl border border-line bg-surface p-8"
            >
              <span
                aria-hidden="true"
                className="font-display text-5xl leading-none text-brass-400/60"
              >
                “
              </span>
              <blockquote className="mt-3 flex-1 font-display text-lg leading-8">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-5 text-sm">
                <span className="font-semibold">{testimonial.name}</span>
                <span className="block text-sage-600">{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- faq ---------- */

const faqs = [
  {
    question: "How hard is it to switch accountants?",
    answer:
      "Not hard at all — for you. You sign one letter of engagement; we contact your previous accountant, collect handover records and pick up mid-year without missing a deadline.",
  },
  {
    question: "How does your pricing work?",
    answer:
      "A fixed monthly fee, scoped upfront based on your size and what you need. No hourly billing, and the scope is reviewed together once a year — not whenever we feel like it.",
  },
  {
    question: "Which accounting software do you support?",
    answer:
      "We’re certified partners on Xero and QuickBooks and also work with FreeAgent. If you’re on spreadsheets, we’ll migrate you and train your team as part of onboarding.",
  },
  {
    question: "Do you work with businesses like mine?",
    answer:
      "Our clients range from sole traders to £20m-turnover companies — agriculture, hospitality, e-commerce, construction and professional services are our deepest benches.",
  },
  {
    question: "I’ve already missed deadlines. Can you help?",
    answer:
      "Yes. Penalty triage is routine work for us: we bring filings up to date, deal with HMRC correspondence on your behalf and appeal penalties where there are grounds.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-line bg-surface">
      <Container className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions, answered straight." />
          <div className="mt-10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium">
                  {faq.question}
                  <svg
                    className="h-4 w-4 shrink-0 text-brass-600 transition-transform duration-300 group-open:rotate-45"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 2v12M2 8h12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </summary>
                <p className="mt-3 max-w-[60ch] text-[15px] leading-7 text-sage-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- contact cta ---------- */

export function ContactCta() {
  return (
    <section id="contact" className="scroll-mt-24">
      <Container className="py-20 sm:py-24">
        <div className="relative isolate overflow-hidden rounded-3xl bg-forest-950 px-6 py-16 text-center text-parchment sm:px-16 sm:py-20">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(45rem_25rem_at_50%_-20%,rgba(203,167,93,0.18),transparent_60%)]" />
            <div className="absolute inset-0 opacity-60 [background:repeating-radial-gradient(circle_at_50%_140%,transparent_0_56px,rgba(245,241,232,0.05)_56px_57px)]" />
          </div>
          <Eyebrow tone="dark">Free 30-minute consultation</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            Ready to put your books on solid ground?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-parchment/70">
            Tell us where things stand — we’ll tell you exactly what we’d do,
            what it costs and what you’d get back. No obligation, no jargon.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-brass-400 px-7 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-brass-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
            >
              Start the conversation
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-parchment/25 px-7 text-sm font-medium text-parchment transition-colors duration-200 hover:border-parchment/50 hover:bg-parchment/5"
            >
              {site.phone}
            </a>
          </div>
          <p className="mt-6 text-sm text-parchment/50">
            We reply within one business day.
          </p>
        </div>
      </Container>
    </section>
  );
}

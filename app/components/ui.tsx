import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.22em] ${
        tone === "dark" ? "text-primary-400" : "text-secondary-500"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl">
        {title}
      </h2>
      {lede && <p className="mt-4 text-lg leading-8 text-muted">{lede}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_20rem_at_85%_-40%,rgba(134,172,178,0.15),transparent_60%)]"
      />
      <Container className="py-16 sm:py-20">
        <div className="max-w-2xl">
          <span className="animate-fade-up block">
            <Eyebrow>{eyebrow}</Eyebrow>
          </span>
          <h1 className="animate-fade-up mt-4 font-display text-4xl font-medium tracking-tight text-balance text-ink [animation-delay:60ms] sm:text-5xl">
            {title}
          </h1>
          {lede && (
            <p className="animate-fade-up mt-5 text-lg leading-8 text-muted [animation-delay:120ms]">
              {lede}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 8.5l3.2 3.2L13 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

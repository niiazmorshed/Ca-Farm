import Link from "next/link";
import { Container } from "./components/ui";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center">
      <Container className="flex flex-col items-center gap-6 py-28 text-center">
        <p className="font-display text-7xl font-medium text-primary-400">404</p>
        <h1 className="font-display text-3xl font-medium tracking-tight text-balance text-ink sm:text-4xl">
          This field is empty.
        </h1>
        <p className="max-w-md text-[15px] leading-7 text-muted">
          The page you are looking for has been moved, harvested or never
          planted. Let’s get you back to solid ground.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary-400 px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-500"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-line px-7 text-sm font-medium text-ink transition-colors duration-200 hover:bg-surface"
          >
            Contact us
          </Link>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "../components/ui";
import { query } from "../lib/db";
import { requireUser } from "../lib/supabase/guards";

export const metadata: Metadata = {
  title: "Client portal",
  description: "Your CA Farm client area.",
};

interface EnquiryRow {
  id: string;
  service: string | null;
  message: string;
  created_at: Date;
}

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function PortalPage() {
  const user = await requireUser();

  // Profile + the client's own enquiries (their contact-form submissions),
  // both from the pg pool and fetched in parallel.
  const [profileResult, enquiriesResult] = await Promise.all([
    query<{ full_name: string | null; role: string; created_at: Date }>(
      "select full_name, role, created_at from public.profiles where id = $1",
      [user.id],
    ),
    query<EnquiryRow>(
      `select id, service, message, created_at
         from enquiries
        where lower(email) = lower($1)
        order by created_at desc
        limit 50`,
      [user.email ?? ""],
    ),
  ]);

  const profile = profileResult.rows[0] ?? null;
  const enquiries = enquiriesResult.rows;
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <>
      <PageHero
        eyebrow="Client area"
        title={firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        lede="Your enquiries, documents and account — all in one place."
        image="office"
      />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          {/* Account summary */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-sm border-t-2 border-primary-400 bg-surface p-6 shadow-sm shadow-navy-900/5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Your account
              </h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div>
                  <dt className="text-muted">Name</dt>
                  <dd className="font-medium text-ink">{profile?.full_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd className="font-medium break-all text-ink">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-muted">Member since</dt>
                  <dd className="font-medium text-ink">
                    {profile?.created_at
                      ? fmt.format(new Date(profile.created_at))
                      : "—"}
                  </dd>
                </div>
              </dl>
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className="mt-5 inline-block text-sm font-semibold text-primary-600 transition-colors duration-200 hover:text-primary-500"
                >
                  Open admin dashboard →
                </Link>
              )}
            </div>

            <div className="rounded-sm border border-line bg-surface p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Documents
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Statements, returns and signed accounts will appear here once
                your accountant shares them.
              </p>
              <span className="mt-3 inline-block rounded-sm bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-500">
                Coming soon
              </span>
            </div>
          </aside>

          {/* My enquiries */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-medium tracking-tight text-ink">
                Your enquiries
              </h2>
              <Link
                href="/contact"
                className="text-sm font-semibold text-primary-600 transition-colors duration-200 hover:text-primary-500"
              >
                New enquiry →
              </Link>
            </div>

            {enquiries.length === 0 ? (
              <div className="mt-5 rounded-sm border border-dashed border-line bg-surface p-8 text-center">
                <p className="text-[15px] text-muted">No enquiries yet.</p>
                <p className="mt-1 text-sm text-muted">
                  When you send us a message it&apos;ll show here with its status.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-primary-500 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-600"
                >
                  Start an enquiry
                </Link>
              </div>
            ) : (
              <ul className="mt-5 flex flex-col gap-4">
                {enquiries.map((enquiry) => (
                  <li
                    key={enquiry.id}
                    className="rounded-sm border border-line bg-surface p-5 shadow-sm shadow-navy-900/5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-ink">
                        {enquiry.service ?? "General enquiry"}
                      </span>
                      <span className="text-xs text-muted">
                        {fmt.format(new Date(enquiry.created_at))}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-body">
                      {enquiry.message}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary-400" />
                      Received
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </Container>
    </>
  );
}

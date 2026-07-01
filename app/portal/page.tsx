import Link from "next/link";
import { query } from "../lib/db";
import { requireClient } from "../lib/supabase/guards";

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
  const user = await requireClient();

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
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-ink">
          {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Your enquiries, documents and account — all in one place.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        {/* Account summary */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-none border-t-2 border-primary-400 bg-white p-6 shadow-sm shadow-navy-900/5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Your account
            </h3>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-muted">Name</dt>
                <dd className="font-medium text-ink">
                  {profile?.full_name ?? "—"}
                </dd>
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
          </div>

          <div className="rounded-none border border-line bg-white p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Documents
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Statements, returns and signed accounts will appear here once your
              accountant shares them.
            </p>
            <span className="mt-3 inline-block rounded-none bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-500">
              Coming soon
            </span>
          </div>
        </aside>

        {/* My enquiries */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-medium tracking-tight text-ink">
              Your enquiries
            </h3>
            <Link
              href="/contact"
              className="text-sm font-semibold text-primary-600 transition-colors duration-200 hover:text-primary-500"
            >
              New enquiry →
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <div className="mt-5 rounded-none border border-dashed border-line bg-white p-8 text-center">
              <p className="text-[15px] text-muted">No enquiries yet.</p>
              <p className="mt-1 text-sm text-muted">
                When you send us a message it&apos;ll show here with its status.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-none bg-primary-500 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-600"
              >
                Start an enquiry
              </Link>
            </div>
          ) : (
            <ul className="mt-5 flex flex-col gap-4">
              {enquiries.map((enquiry) => (
                <li
                  key={enquiry.id}
                  className="rounded-none border border-line bg-white p-5 shadow-sm shadow-navy-900/5"
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
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-none bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary-400" />
                    Received
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

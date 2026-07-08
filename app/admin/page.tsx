import type { Metadata } from "next";
import Link from "next/link";
import { query } from "../lib/db";
import { requireAdmin } from "../lib/supabase/guards";
import { loadReviewStatus } from "../lib/editable-calculators";
import { markCalculatorReviewedAction } from "./review-actions";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
  created_at: Date;
}

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-none border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
  const user = await requireAdmin();

  const [{ rows }, { rows: countRows }, reviews] = await Promise.all([
    query<EnquiryRow>(
      `select id, name, email, company, service, message, created_at
         from enquiries
        order by created_at desc
        limit 200`,
    ),
    query<{ total: string }>(`select count(*)::text as total from enquiries`),
    loadReviewStatus(),
  ]);

  const total = Number(countRows[0]?.total ?? 0);
  const latest = rows[0] ? fmt.format(new Date(rows[0].created_at)) : "—";
  const dueReviews = reviews.filter((r) => r.due);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-ink">Dashboard</h2>
        <p className="mt-1 text-sm text-muted">
          Welcome back — signed in as{" "}
          <span className="font-medium text-ink-body">{user.email}</span>.
        </p>
      </header>

      {dueReviews.length > 0 && (
        <div className="mb-8 space-y-4">
          {dueReviews.map((r) => {
            const reviewedLabel = r.reviewedAt
              ? dateFmt.format(new Date(r.reviewedAt))
              : null;
            return (
              <div
                key={r.key}
                className="rounded-none border-l-2 border-primary-500 bg-primary-50 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-base font-semibold text-ink">
                      {r.label} review due
                    </p>
                    <p className="mt-1 text-sm text-ink-body">
                      {reviewedLabel
                        ? `Last reviewed ${reviewedLabel}.`
                        : "Not reviewed yet."}{" "}
                      Check the rates against Revenue for the next Budget.
                    </p>
                    <Link
                      href={r.adminHref}
                      className="mt-3 inline-block text-sm font-semibold text-primary-600 transition-colors duration-200 hover:text-primary-500"
                    >
                      Open {r.label} →
                    </Link>
                  </div>
                  <form action={markCalculatorReviewedAction}>
                    <input type="hidden" name="key" value={r.key} />
                    <button
                      type="submit"
                      className="inline-flex h-9 cursor-pointer items-center rounded-none border border-primary-500 px-4 text-xs font-semibold text-primary-600 transition-colors duration-200 hover:bg-primary-500 hover:text-white"
                    >
                      Mark reviewed
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total enquiries" value={total} />
        <StatCard label="Latest received" value={latest} />
        <StatCard label="Role" value="Administrator" />
      </div>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">
            Recent enquiries
          </h3>
          <p className="text-sm text-muted">
            {total === 0
              ? "No enquiries yet."
              : `Showing ${rows.length} of ${total}.`}
          </p>
        </div>

        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-none border border-line bg-white">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Message</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-line align-top last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {fmt.format(new Date(row.created_at))}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {row.name}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${row.email}`}
                        className="text-primary-600 transition-colors duration-200 hover:text-primary-500"
                      >
                        {row.email}
                      </a>
                      {row.company && (
                        <span className="block text-xs text-muted">
                          {row.company}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-body">
                      {row.service ?? "—"}
                    </td>
                    <td className="max-w-md px-4 py-3 text-ink-body">
                      {row.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

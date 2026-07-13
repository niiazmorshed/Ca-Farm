import type { Metadata } from "next";
import Link from "next/link";
import { query } from "../lib/db";
import { requireAdmin } from "../lib/supabase/guards";
import { loadReviewStatus } from "../lib/editable-calculators";
import { markCalculatorReviewedAction } from "./review-actions";
import { Icon } from "../components/dashboard-icons";
import {
  Avatar,
  initialsOf,
  PageHeader,
  Panel,
  SparkBars,
  StatTile,
} from "../components/dashboard-ui";

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

const fmtDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});
const fmtTime = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});
const fmtLong = new Intl.DateTimeFormat("en-GB", {
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
const todayFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

/** Bucket per-day counts into a dense 14-slot array ending today. */
function dailySeries(rows: { day: Date; n: number }[]) {
  const byDay = new Map(
    rows.map((r) => [new Date(r.day).toISOString().slice(0, 10), r.n]),
  );
  const points: number[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    points.push(byDay.get(d.toISOString().slice(0, 10)) ?? 0);
  }
  return points;
}

export default async function AdminPage() {
  const user = await requireAdmin();

  const [enquiriesResult, statsResult, trendResult, clientsResult, reviews] =
    await Promise.all([
      query<EnquiryRow>(
        `select id, name, email, company, service, message, created_at
           from enquiries
          order by created_at desc
          limit 9`,
      ),
      query<{ total: number; last7: number; prev7: number }>(
        `select count(*)::int as total,
                count(*) filter (where created_at >= now() - interval '7 days')::int as last7,
                count(*) filter (where created_at >= now() - interval '14 days'
                             and created_at <  now() - interval '7 days')::int as prev7
           from enquiries`,
      ),
      query<{ day: Date; n: number }>(
        `select date_trunc('day', created_at) as day, count(*)::int as n
           from enquiries
          where created_at >= now() - interval '14 days'
          group by 1`,
      ),
      query<{ clients: number }>(
        `select count(*)::int as clients from public.profiles where role = 'client'`,
      ),
      loadReviewStatus(),
    ]);

  const rows = enquiriesResult.rows;
  const { total, last7, prev7 } = statsResult.rows[0] ?? {
    total: 0,
    last7: 0,
    prev7: 0,
  };
  const clients = clientsResult.rows[0]?.clients ?? 0;
  const trend = dailySeries(trendResult.rows);
  const latest = rows[0] ? new Date(rows[0].created_at) : null;
  const dueReviews = reviews.filter((r) => r.due);
  const upToDate = reviews.length - dueReviews.length;
  const firstName = (user.user_metadata?.full_name as string | undefined)
    ?.trim()
    .split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Overview"
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        lede="What's happening across enquiries, rates and clients."
        actions={
          <span className="hidden items-center gap-2 rounded-none border border-line bg-white px-3.5 py-2 text-xs font-medium text-muted sm:inline-flex">
            <Icon name="clock" className="h-3.5 w-3.5 text-primary-500" />
            {todayFmt.format(new Date())}
          </span>
        }
      />

      {/* Action needed: overdue calculator rate reviews, consolidated */}
      {dueReviews.length > 0 && (
        <Panel className="mb-8 overflow-hidden border-l-2 border-l-primary-500">
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-primary-50/60 px-5 py-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-none bg-primary-500 text-white">
              <Icon name="receiptPercent" className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                Action needed
              </h3>
              <p className="text-xs text-muted">
                {dueReviews.length}{" "}
                {dueReviews.length === 1 ? "calculator needs" : "calculators need"}{" "}
                checking against Revenue before the next Budget.
              </p>
            </div>
          </div>
          <ul className="divide-y divide-line">
            {dueReviews.map((r) => {
              const reviewedLabel = r.reviewedAt
                ? dateFmt.format(new Date(r.reviewedAt))
                : null;
              return (
                <li
                  key={r.key}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={r.adminHref}
                      className="text-sm font-semibold text-ink transition-colors duration-200 hover:text-primary-600"
                    >
                      {r.label}
                    </Link>
                    <p className="text-xs text-muted">
                      {reviewedLabel
                        ? `Last reviewed ${reviewedLabel}`
                        : "Not reviewed yet"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={r.adminHref}
                      className="inline-flex h-8 items-center rounded-none border border-line px-3 text-xs font-semibold text-ink-body transition-colors duration-200 hover:border-ink/30 hover:text-ink"
                    >
                      Open
                    </Link>
                    <form action={markCalculatorReviewedAction}>
                      <input type="hidden" name="key" value={r.key} />
                      <button
                        type="submit"
                        className="inline-flex h-8 cursor-pointer items-center rounded-none border border-primary-500 px-3 text-xs font-semibold text-primary-600 transition-colors duration-200 hover:bg-primary-500 hover:text-white"
                      >
                        Mark reviewed
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      {/* KPI row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total enquiries"
          value={total}
          icon={<Icon name="inbox" className="h-[18px] w-[18px]" />}
        >
          <SparkBars
            points={trend}
            summary={`Enquiries per day over the last 14 days: ${trend.join(", ")}.`}
          />
        </StatTile>
        <StatTile
          label="Last 7 days"
          value={last7}
          delta={{ value: last7 - prev7, vs: "prior 7 days" }}
          icon={<Icon name="trendUp" className="h-[18px] w-[18px]" />}
        />
        <StatTile
          label="Latest received"
          value={latest ? fmtDate.format(latest) : "—"}
          hint={latest ? `at ${fmtTime.format(latest)}` : "No enquiries yet"}
          icon={<Icon name="clock" className="h-[18px] w-[18px]" />}
        />
        <StatTile
          label="Registered clients"
          value={clients}
          hint="Portal accounts"
          icon={<Icon name="users" className="h-[18px] w-[18px]" />}
        />
      </div>

      {/* Enquiries + rate-review health */}
      <div className="grid items-start gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Panel className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
              Recent enquiries
            </h3>
            <p className="text-xs font-medium text-muted">
              {total === 0
                ? "New contact-form messages land here"
                : `Showing ${rows.length} of ${total}`}
            </p>
          </div>

          {rows.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-none bg-primary-50 text-primary-600">
                <Icon name="inbox" className="h-6 w-6" />
              </span>
              <p className="mt-4 text-[15px] font-medium text-ink">
                No enquiries yet
              </p>
              <p className="mt-1 text-sm text-muted">
                When a visitor sends the contact form, it appears here instantly.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-muted text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    <th className="px-5 py-3">From</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-5 py-3 text-right">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-line align-top transition-colors duration-150 last:border-0 hover:bg-surface-muted/60"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            initials={initialsOf(row.name, row.email)}
                            className="h-8 w-8 text-[11px]"
                          />
                          <div className="min-w-0 leading-tight">
                            <p className="font-medium text-ink">{row.name}</p>
                            <a
                              href={`mailto:${row.email}`}
                              className="text-xs text-primary-600 transition-colors duration-200 hover:text-primary-500"
                            >
                              {row.email}
                            </a>
                            {row.company && (
                              <p className="text-xs text-muted">{row.company}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {row.service ? (
                          <span className="inline-block whitespace-nowrap rounded-none bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-body">
                            {row.service}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="max-w-md px-4 py-3.5 text-ink-body">
                        <p className="line-clamp-2 leading-6">{row.message}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-xs text-muted">
                        {fmtLong.format(new Date(row.created_at))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {/* Rate review health — every calculator at a glance */}
        <Panel className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
              Rate reviews
            </h3>
            <span
              className={`rounded-none px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                dueReviews.length === 0
                  ? "bg-primary-50 text-primary-600"
                  : "bg-navy-900 text-white"
              }`}
            >
              {upToDate}/{reviews.length} up to date
            </span>
          </div>
          <ul className="divide-y divide-line">
            {reviews.map((r) => (
              <li key={r.key}>
                <Link
                  href={r.adminHref}
                  className="group flex items-center gap-3 px-5 py-3 transition-colors duration-200 hover:bg-surface-muted"
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      r.due ? "bg-navy-900" : "bg-primary-500"
                    }`}
                  />
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-sm font-medium text-ink">
                      {r.label}
                    </span>
                    <span className="block text-xs text-muted">
                      {r.reviewedAt
                        ? `Reviewed ${dateFmt.format(new Date(r.reviewedAt))}`
                        : "Not reviewed yet"}
                    </span>
                  </span>
                  {r.due && (
                    <span className="shrink-0 rounded-none bg-navy-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Due
                    </span>
                  )}
                  <Icon
                    name="arrowUpRight"
                    className="h-3.5 w-3.5 shrink-0 text-muted transition-colors duration-200 group-hover:text-primary-600"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

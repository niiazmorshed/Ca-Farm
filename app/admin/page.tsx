import type { Metadata } from "next";
import { query } from "../lib/db";
import { requireAdmin } from "../lib/supabase/guards";
import { Icon } from "../components/dashboard-icons";
import {
  Avatar,
  initialsOf,
  PageHeader,
  Panel,
  SparkBars,
  StatTile,
  StatusChip,
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

  const [enquiriesResult, statsResult, trendResult, clientsResult] =
    await Promise.all([
      query<EnquiryRow>(
        `select id, name, email, company, service, message, created_at
           from enquiries
          order by created_at desc
          limit 200`,
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
  const firstName = (user.user_metadata?.full_name as string | undefined)
    ?.trim()
    .split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Overview"
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        lede="What's happening across enquiries, rates and clients."
      />

      {/* KPI row */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Recent enquiries */}
      <section>
        <Panel>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-4">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
              Recent enquiries
            </h3>
            <p className="text-sm text-muted">
              {total === 0
                ? "Nothing yet — new contact-form messages land here."
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
              <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-5 py-3">From</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Status</th>
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
                          <span className="inline-block rounded-none bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-body">
                            {row.service}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="max-w-md px-4 py-3.5 text-ink-body">
                        <p className="line-clamp-2 leading-6">{row.message}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusChip label="New" />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                        {fmtLong.format(new Date(row.created_at))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}

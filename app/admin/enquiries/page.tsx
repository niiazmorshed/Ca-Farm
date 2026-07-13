import type { Metadata } from "next";
import Link from "next/link";
import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/supabase/guards";
import { updateEnquiryStatusAction } from "./actions";
import { Icon } from "../../components/dashboard-icons";
import {
  Avatar,
  initialsOf,
  PageHeader,
  Panel,
  StatusChip,
  timeAgo,
  type StatusTone,
} from "../../components/dashboard-ui";

export const metadata: Metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
  status: string;
  created_at: Date;
}

type StatusKey = "new" | "in_progress" | "resolved";

const STATUS_META: Record<StatusKey, { label: string; tone: StatusTone }> = {
  new: { label: "New", tone: "green" },
  in_progress: { label: "In progress", tone: "dark" },
  resolved: { label: "Resolved", tone: "muted" },
};

const statusMeta = (s: string) =>
  STATUS_META[s as StatusKey] ?? STATUS_META.new;

const fmtLong = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Inbox URL preserving the active filter + search. */
function hrefWith(p: { status?: string; q?: string; id?: string }) {
  const sp = new URLSearchParams();
  if (p.status && p.status !== "all") sp.set("status", p.status);
  if (p.q) sp.set("q", p.q);
  if (p.id) sp.set("id", p.id);
  const s = sp.toString();
  return s ? `/admin/enquiries?${s}` : "/admin/enquiries";
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; q?: string; status?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const statusFilter =
    params.status && params.status in STATUS_META ? params.status : "all";
  const idParam = params.id && /^\d+$/.test(params.id) ? params.id : null;

  // List query with optional status + free-text filters.
  const conds: string[] = [];
  const values: unknown[] = [];
  if (statusFilter !== "all") {
    values.push(statusFilter);
    conds.push(`status = $${values.length}`);
  }
  if (q) {
    values.push(`%${q}%`);
    const n = values.length;
    conds.push(
      `(name ilike $${n} or email ilike $${n} or coalesce(company, '') ilike $${n}
        or coalesce(service, '') ilike $${n} or message ilike $${n})`,
    );
  }
  const where = conds.length ? `where ${conds.join(" and ")}` : "";

  const [listResult, countsResult, selectedResult] = await Promise.all([
    query<EnquiryRow>(
      `select id, name, email, company, service, message, status, created_at
         from enquiries ${where}
        order by created_at desc
        limit 100`,
      values,
    ),
    query<{ total: number; new: number; in_progress: number; resolved: number }>(
      `select count(*)::int as total,
              count(*) filter (where status = 'new')::int as new,
              count(*) filter (where status = 'in_progress')::int as in_progress,
              count(*) filter (where status = 'resolved')::int as resolved
         from enquiries`,
    ),
    idParam
      ? query<EnquiryRow>(
          `select id, name, email, company, service, message, status, created_at
             from enquiries where id = $1`,
          [idParam],
        )
      : Promise.resolve(null),
  ]);

  const rows = listResult.rows;
  const counts = countsResult.rows[0] ?? {
    total: 0,
    new: 0,
    in_progress: 0,
    resolved: 0,
  };
  const selected = selectedResult?.rows[0] ?? rows[0] ?? null;
  const explicitSelection = Boolean(selectedResult?.rows[0]);

  const tabs = [
    { key: "all", label: "All", count: counts.total },
    { key: "new", label: "New", count: counts.new },
    { key: "in_progress", label: "In progress", count: counts.in_progress },
    { key: "resolved", label: "Resolved", count: counts.resolved },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Inbox"
        title="Enquiries"
        lede="Every contact-form message, triaged in one place — reply, track and resolve."
        actions={
          counts.new > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-none bg-navy-900 px-3.5 py-2 text-xs font-semibold text-white">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-primary-400"
              />
              {counts.new} awaiting reply
            </span>
          ) : undefined
        }
      />

      <Panel className="overflow-hidden">
        <div className="flex flex-col lg:h-[calc(100vh-19rem)] lg:min-h-[540px] lg:flex-row">
          {/* ── List pane ─────────────────────────────────────────── */}
          <div
            className={`w-full shrink-0 flex-col border-line lg:flex lg:w-[24rem] lg:border-r ${
              explicitSelection ? "hidden" : "flex"
            }`}
          >
            {/* Filters */}
            <div className="border-b border-line p-4">
              <form action="/admin/enquiries" method="get" role="search">
                {statusFilter !== "all" && (
                  <input type="hidden" name="status" value={statusFilter} />
                )}
                <label className="flex h-10 items-center gap-2.5 rounded-none border border-line bg-surface-muted/60 px-3 transition-colors duration-200 focus-within:border-primary-500 focus-within:bg-white">
                  <Icon name="search" className="h-4 w-4 shrink-0 text-muted" />
                  <input
                    type="search"
                    name="q"
                    defaultValue={q}
                    placeholder="Search name, email, message…"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                  />
                </label>
              </form>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tabs.map((tab) => {
                  const active = statusFilter === tab.key;
                  return (
                    <Link
                      key={tab.key}
                      href={hrefWith({ status: tab.key, q })}
                      className={`inline-flex items-center gap-1.5 rounded-none px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                        active
                          ? "bg-navy-900 text-white"
                          : "bg-surface-muted text-ink-body hover:bg-primary-50 hover:text-primary-600"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`tabular-nums ${active ? "text-white/60" : "text-muted"}`}
                      >
                        {tab.count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto">
              {rows.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-none bg-primary-50 text-primary-600">
                    <Icon name="inbox" className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-medium text-ink">
                    {q || statusFilter !== "all"
                      ? "No enquiries match"
                      : "No enquiries yet"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {q || statusFilter !== "all"
                      ? "Try a different search or filter."
                      : "New contact-form messages land here."}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {rows.map((row) => {
                    const meta = statusMeta(row.status);
                    const active = selected?.id === row.id;
                    return (
                      <li key={row.id}>
                        <Link
                          href={hrefWith({ status: statusFilter, q, id: row.id })}
                          aria-current={active ? "true" : undefined}
                          className={`relative block px-4 py-3.5 transition-colors duration-150 ${
                            active
                              ? "bg-primary-50/60"
                              : "hover:bg-surface-muted/70"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`absolute inset-y-0 left-0 w-0.5 ${
                              active ? "bg-primary-500" : "bg-transparent"
                            }`}
                          />
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex min-w-0 items-center gap-2.5">
                              <Avatar
                                initials={initialsOf(row.name, row.email)}
                                className="h-7 w-7 text-[10px]"
                              />
                              <span
                                className={`truncate text-sm ${
                                  row.status === "new"
                                    ? "font-semibold text-ink"
                                    : "font-medium text-ink-body"
                                }`}
                              >
                                {row.name}
                              </span>
                            </span>
                            <span className="shrink-0 text-[11px] tabular-nums text-muted">
                              {timeAgo(new Date(row.created_at))}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 pl-[38px] text-xs leading-5 text-muted">
                            {row.message}
                          </p>
                          <div className="mt-2 flex items-center gap-2 pl-[38px]">
                            <StatusChip label={meta.label} tone={meta.tone} />
                            {row.service && (
                              <span className="truncate text-[11px] font-medium text-muted">
                                {row.service}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {rows.length === 100 && (
              <p className="border-t border-line px-4 py-2.5 text-center text-[11px] text-muted">
                Showing the latest 100 — narrow with search to see older ones.
              </p>
            )}
          </div>

          {/* ── Detail pane ───────────────────────────────────────── */}
          <div
            className={`min-w-0 flex-1 flex-col lg:flex ${
              explicitSelection ? "flex" : "hidden"
            }`}
          >
            {!selected ? (
              <div className="grid flex-1 place-items-center px-6 py-20 text-center">
                <div>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-none bg-primary-50 text-primary-600">
                    <Icon name="inbox" className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-[15px] font-medium text-ink">
                    Nothing selected
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Pick an enquiry from the list to read it here.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Detail header */}
                <div className="border-b border-line px-5 py-4 sm:px-6">
                  <Link
                    href={hrefWith({ status: statusFilter, q })}
                    className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors duration-200 hover:text-ink lg:hidden"
                  >
                    <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                    Back to inbox
                  </Link>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <Avatar
                        initials={initialsOf(selected.name, selected.email)}
                        className="h-11 w-11 text-sm"
                      />
                      <div className="min-w-0 leading-tight">
                        <h3 className="truncate font-display text-lg font-semibold tracking-tight text-ink">
                          {selected.name}
                        </h3>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm">
                          <a
                            href={`mailto:${selected.email}`}
                            className="text-primary-600 transition-colors duration-200 hover:text-primary-500"
                          >
                            {selected.email}
                          </a>
                          {selected.company && (
                            <span className="text-muted">
                              · {selected.company}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <StatusChip
                      label={statusMeta(selected.status).label}
                      tone={statusMeta(selected.status).tone}
                    />
                  </div>

                  {/* Meta strip */}
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        Received
                      </dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {fmtLong.format(new Date(selected.created_at))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        Service
                      </dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {selected.service ?? "General enquiry"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        Reference
                      </dt>
                      <dd className="mt-0.5 font-medium tabular-nums text-ink">
                        #{selected.id.padStart(4, "0")}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Message body */}
                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Message
                  </p>
                  <div className="mt-3 max-w-2xl whitespace-pre-line text-[15px] leading-7 text-ink-body">
                    {selected.message}
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-muted/50 px-5 py-3.5 sm:px-6">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(
                      `Re: ${selected.service ?? "your enquiry"} — CA Farm`,
                    )}`}
                    className="inline-flex h-10 items-center gap-2 rounded-none bg-primary-500 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-600"
                  >
                    <Icon name="chat" className="h-4 w-4" />
                    Reply by email
                  </a>
                  <div
                    className="inline-flex rounded-none border border-line bg-white"
                    role="group"
                    aria-label="Set status"
                  >
                    {(Object.keys(STATUS_META) as StatusKey[]).map((key) => {
                      const active = selected.status === key;
                      return (
                        <form key={key} action={updateEnquiryStatusAction}>
                          <input type="hidden" name="id" value={selected.id} />
                          <input type="hidden" name="status" value={key} />
                          <button
                            type="submit"
                            disabled={active}
                            className={`inline-flex h-10 cursor-pointer items-center gap-1.5 px-3.5 text-xs font-semibold transition-colors duration-200 disabled:cursor-default ${
                              active
                                ? "bg-navy-900 text-white"
                                : "text-ink-body hover:bg-surface-muted hover:text-ink"
                            }`}
                          >
                            {key === "resolved" && (
                              <Icon name="check" className="h-3.5 w-3.5" />
                            )}
                            {STATUS_META[key].label}
                          </button>
                        </form>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}

import Link from "next/link";
import { query } from "../lib/db";
import { requireClient } from "../lib/supabase/guards";
import { Icon } from "../components/dashboard-icons";
import {
  Avatar,
  initialsOf,
  PageHeader,
  Panel,
  StatTile,
  StatusChip,
} from "../components/dashboard-ui";

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

const quickActions = [
  {
    href: "/contact",
    icon: "chat",
    title: "Start an enquiry",
    body: "Message the team — same-day reply.",
  },
  {
    href: "/tools/ireland",
    icon: "calculator",
    title: "Tax calculators",
    body: "Income tax, VAT, CT and more.",
  },
  {
    href: "/pricing",
    icon: "banknotes",
    title: "Plans & pricing",
    body: "See what's included at each tier.",
  },
] as const;

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
  const initials = initialsOf(profile?.full_name, user.email ?? "");
  const latest = enquiries[0] ? new Date(enquiries[0].created_at) : null;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Your dashboard"
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        lede="Your enquiries, documents and account — all in one place."
        actions={
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-none bg-primary-500 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-600"
          >
            <Icon name="plus" className="h-4 w-4" />
            New enquiry
          </Link>
        }
      />

      {/* Snapshot */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Your enquiries"
          value={enquiries.length}
          hint={enquiries.length === 0 ? "None sent yet" : "Sent to the team"}
          icon={<Icon name="chat" className="h-[18px] w-[18px]" />}
        />
        <StatTile
          label="Last activity"
          value={latest ? fmt.format(latest) : "—"}
          hint={latest ? "Most recent enquiry" : "No activity yet"}
          icon={<Icon name="clock" className="h-[18px] w-[18px]" />}
        />
        <StatTile
          label="Member since"
          value={profile?.created_at ? fmt.format(new Date(profile.created_at)) : "—"}
          hint="Account created"
          icon={<Icon name="users" className="h-[18px] w-[18px]" />}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        {/* Left rail: account, quick actions, documents */}
        <aside className="flex flex-col gap-6">
          <Panel accent className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Your account
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <Avatar initials={initials} className="h-11 w-11 text-sm" />
              <div className="min-w-0 leading-tight">
                <p className="truncate font-medium text-ink">
                  {profile?.full_name ?? "—"}
                </p>
                <p className="truncate text-sm text-muted">{user.email}</p>
              </div>
            </div>
            <dl className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Member since</dt>
                <dd className="font-medium text-ink">
                  {profile?.created_at
                    ? fmt.format(new Date(profile.created_at))
                    : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Account type</dt>
                <dd className="font-medium text-ink">Client</dd>
              </div>
            </dl>
          </Panel>

          <Panel className="p-2">
            <h3 className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Quick actions
            </h3>
            <ul>
              {quickActions.map((action) => (
                <li key={action.href}>
                  <Link
                    href={action.href}
                    className="group flex items-center gap-3 rounded-none px-4 py-3 transition-colors duration-200 hover:bg-surface-muted"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-none bg-primary-50 text-primary-600">
                      <Icon name={action.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block text-sm font-medium text-ink">
                        {action.title}
                      </span>
                      <span className="block text-xs text-muted">
                        {action.body}
                      </span>
                    </span>
                    <Icon
                      name="arrowUpRight"
                      className="ml-auto h-4 w-4 shrink-0 text-muted transition-colors duration-200 group-hover:text-primary-600"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Documents
              </h3>
              <span className="rounded-none bg-secondary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-500">
                Coming soon
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Statements, returns and signed accounts will appear here once your
              accountant shares them.
            </p>
          </Panel>
        </aside>

        {/* My enquiries */}
        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
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
            <div className="mt-5 rounded-none border border-dashed border-line bg-white p-10 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-none bg-primary-50 text-primary-600">
                <Icon name="chat" className="h-6 w-6" />
              </span>
              <p className="mt-4 text-[15px] font-medium text-ink">
                No enquiries yet
              </p>
              <p className="mt-1 text-sm text-muted">
                When you send us a message it&apos;ll show here with its status.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-none bg-primary-500 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-600"
              >
                Start an enquiry
              </Link>
            </div>
          ) : (
            <ul className="mt-5 flex flex-col gap-4">
              {enquiries.map((enquiry) => (
                <li
                  key={enquiry.id}
                  className="group rounded-none border border-line bg-white p-5 shadow-sm shadow-navy-900/5 transition-colors duration-200 hover:border-primary-400/60"
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
                  <div className="mt-3">
                    <StatusChip label="Received" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { requireAdmin } from "../../lib/supabase/guards";
import { getAllToolkitResources, type ToolkitResource } from "../../lib/toolkit-data";
import {
  countPendingRequests,
  getToolkitRequests,
  type ToolkitRequest,
} from "../../lib/toolkit-requests";
import { setRequestStatusAction } from "./actions";
import { ToolkitsManager } from "./toolkits-manager";

export const metadata: Metadata = {
  title: "Toolkits",
  robots: { index: false, follow: false },
};

const requestedAt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminToolkitsPage() {
  await requireAdmin();

  let resources: ToolkitResource[] = [];
  let loadError = false;
  try {
    resources = await getAllToolkitResources();
  } catch (err) {
    console.error("[toolkits] admin load failed:", err);
    loadError = true;
  }

  // The request log is a bonus panel: never let it break the upload manager.
  let requests: ToolkitRequest[] = [];
  let pending = 0;
  try {
    [requests, pending] = await Promise.all([
      getToolkitRequests(100),
      countPendingRequests(),
    ]);
  } catch (err) {
    console.error("[toolkits] request log load failed:", err);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Founders Hub
        </h2>
        <p className="mt-1 text-sm text-muted">
          Memos, templates, tax forms, VAT forms and business setup guides shown
          on the{" "}
          <a
            href="/toolkits"
            className="font-medium text-primary-600 transition-colors duration-200 hover:text-primary-500"
          >
            public Founders Hub page
          </a>
          . Uploads go live immediately, no deploy needed.
          {loadError && (
            <>
              {" "}
              Could not read the toolkit_resources table. Run{" "}
              <code className="rounded-none bg-surface-muted px-1.5 py-0.5 text-xs">
                node scripts/db-migrate.mjs
              </code>{" "}
              to create it.
            </>
          )}
        </p>
      </header>

      <ToolkitsManager resources={resources} />

      <section className="mt-12">
        <div className="mb-1 flex flex-wrap items-center gap-2.5">
          <h3 className="font-display text-base font-semibold text-ink">
            Resource requests ({requests.length})
          </h3>
          {pending > 0 && (
            <span className="rounded-none bg-navy-900 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">
              {pending} to send
            </span>
          )}
        </div>
        <p className="mb-4 text-sm text-muted">
          Nothing is emailed automatically. Send the file to the address below,
          then mark the request sent. Outstanding requests are listed first.
        </p>
        {requests.length === 0 ? (
          <p className="rounded-none border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            No one has requested a resource yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {requests.map((r) => (
              <li
                key={r.id}
                className={`rounded-none border bg-white p-4 ${
                  r.status === "pending" ? "border-l-2 border-l-primary-500 border-line" : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-ink">
                      {r.resourceTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      Requested {requestedAt.format(new Date(r.createdAt))}
                      {r.sentAt && ` · sent ${requestedAt.format(new Date(r.sentAt))}`}
                      {r.resourceId === null && " · no file uploaded yet"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-none px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                        r.status === "sent"
                          ? "bg-secondary-50 text-secondary-600"
                          : "bg-primary-50 text-primary-600"
                      }`}
                    >
                      {r.status}
                    </span>
                    <form action={setRequestStatusAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={r.status === "sent" ? "pending" : "sent"}
                      />
                      <button
                        type="submit"
                        className="inline-flex h-8 cursor-pointer items-center rounded-none border border-line px-3 text-xs font-semibold text-ink-body transition-colors duration-200 hover:border-ink/30 hover:text-ink"
                      >
                        {r.status === "sent" ? "Undo" : "Mark sent"}
                      </button>
                    </form>
                  </div>
                </div>

                <dl className="mt-3 grid gap-x-6 gap-y-2 border-t border-line pt-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Name
                    </dt>
                    <dd className="mt-0.5 text-ink">{r.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Email
                    </dt>
                    <dd className="mt-0.5 break-all">
                      <a
                        href={`mailto:${r.email}?subject=${encodeURIComponent(r.resourceTitle)}`}
                        className="font-medium text-primary-600 transition-colors duration-200 hover:text-primary-500"
                      >
                        {r.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Phone
                    </dt>
                    <dd className="mt-0.5 text-ink">{r.phone}</dd>
                  </div>
                  <div className="sm:col-span-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Purpose
                    </dt>
                    <dd className="mt-0.5 whitespace-pre-line leading-6 text-ink-body">
                      {r.purpose}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

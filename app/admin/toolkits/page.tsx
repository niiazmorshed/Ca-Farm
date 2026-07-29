import type { Metadata } from "next";
import { requireAdmin } from "../../lib/supabase/guards";
import { getAllToolkitResources, type ToolkitResource } from "../../lib/toolkit-data";
import { getToolkitRequests, type ToolkitRequest } from "../../lib/toolkit-requests";
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
  try {
    requests = await getToolkitRequests(50);
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
        <h3 className="mb-1 font-display text-base font-semibold text-ink">
          Recent requests ({requests.length})
        </h3>
        <p className="mb-3 text-sm text-muted">
          Who asked for a copy by email, newest first. Failed rows usually mean
          the email provider rejected the send: check the server logs.
        </p>
        {requests.length === 0 ? (
          <p className="rounded-none border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            No one has requested a copy yet.
          </p>
        ) : (
          <div className="overflow-x-auto border border-line bg-white">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-surface-muted">
                  <th className="px-4 py-2.5 text-left font-semibold text-muted">Email</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted">Resource</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted">When</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-t border-line">
                    <td className="px-4 py-2.5 text-ink">{r.email}</td>
                    <td className="px-4 py-2.5 text-muted">
                      {r.resourceTitle ?? "(deleted resource)"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-muted">
                      {requestedAt.format(new Date(r.createdAt))}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-none px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                          r.status === "sent"
                            ? "bg-secondary-50 text-secondary-600"
                            : "bg-primary-50 text-primary-600"
                        }`}
                        title={r.error ?? undefined}
                      >
                        {r.status}
                      </span>
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

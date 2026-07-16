import type { Metadata } from "next";
import { requireAdmin } from "../../lib/supabase/guards";
import { getAllToolkitResources, type ToolkitResource } from "../../lib/toolkit-data";
import { ToolkitsManager } from "./toolkits-manager";

export const metadata: Metadata = {
  title: "Toolkits",
  robots: { index: false, follow: false },
};

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
          . Uploads go live immediately — no deploy needed.
          {loadError && (
            <>
              {" "}
              Could not read the toolkit_resources table — run{" "}
              <code className="rounded-none bg-surface-muted px-1.5 py-0.5 text-xs">
                node scripts/db-migrate.mjs
              </code>{" "}
              to create it.
            </>
          )}
        </p>
      </header>

      <ToolkitsManager resources={resources} />
    </div>
  );
}

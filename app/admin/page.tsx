import type { Metadata } from "next";
import { Container, PageHero } from "../components/ui";
import { query } from "../lib/db";
import { requireAdmin } from "../lib/supabase/guards";

export const metadata: Metadata = {
  title: "Admin — Enquiries",
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

export default async function AdminPage() {
  await requireAdmin();

  const { rows } = await query<EnquiryRow>(
    `select id, name, email, company, service, message, created_at
       from enquiries
      order by created_at desc
      limit 200`,
  );

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Enquiries"
        lede="Contact-form submissions, newest first."
        image="tower"
      />
      <Container className="py-12 sm:py-16">
        <p className="mb-6 text-sm text-muted">
          {rows.length === 0
            ? "No enquiries yet."
            : `${rows.length} enquir${rows.length === 1 ? "y" : "ies"}.`}
        </p>

        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-sm border border-line bg-surface">
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
                    <td className="px-4 py-3 font-medium text-ink">{row.name}</td>
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
      </Container>
    </>
  );
}

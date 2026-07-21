/* Toolkit categories, labels and row types — PURE module, no DB imports.
   Client components (admin manager) import from here; the pg-backed loaders
   live in toolkit-data.ts, which is server-only. Importing that file from a
   client component would drag `pg` into the browser bundle and break the
   production build (dns/fs/net/tls don't exist there). */

export const TOOLKIT_CATEGORIES = [
  { value: "memo", label: "Memos" },
  { value: "template", label: "Templates" },
  { value: "tax-form", label: "Tax forms" },
  { value: "vat-form", label: "VAT forms" },
  { value: "guide", label: "Business setup guides" },
  { value: "other", label: "Other resources" },
] as const;

export type ToolkitCategory = (typeof TOOLKIT_CATEGORIES)[number]["value"];

export const TOOLKIT_CATEGORY_LABELS: Record<ToolkitCategory, string> =
  Object.fromEntries(
    TOOLKIT_CATEGORIES.map((c) => [c.value, c.label]),
  ) as Record<ToolkitCategory, string>;

/* Accounting-framework badge shown on Templates/checklist cards. Free text in
   the DB; the admin offers this list so the labels stay consistent. */
export const TOOLKIT_FRAMEWORKS = [
  "FRS 102",
  "FRS 101",
  "FRS 105",
  "IFRS",
  "UK GAAP",
] as const;

export type ToolkitFramework = (typeof TOOLKIT_FRAMEWORKS)[number];

export interface ToolkitResource {
  id: string;
  title: string;
  description: string | null;
  category: ToolkitCategory;
  /** Accounting framework badge, e.g. "FRS 102"; null when not applicable. */
  framework: string | null;
  fileUrl: string;
  /** Storage object path — null when the row points at an external URL. */
  filePath: string | null;
  fileName: string | null;
  active: boolean;
  createdAt: string;
}

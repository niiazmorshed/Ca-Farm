/* Server-side loader for the Entrepreneur Toolkits resources — SERVER ONLY
   (imports pg via ./db; a client component must import toolkit-types.ts
   instead, or the browser bundle tries to resolve dns/fs/net/tls).
   Rows live in toolkit_resources (managed in /admin/toolkits); files sit in
   the public "toolkits" Supabase Storage bucket, or the row points at an
   external URL. The public page degrades to an empty list if the DB is
   unreachable — it never 500s. */

import { query } from "./db";
import type { ToolkitCategory, ToolkitResource } from "./toolkit-types";

export {
  TOOLKIT_CATEGORIES,
  TOOLKIT_CATEGORY_LABELS,
  type ToolkitCategory,
  type ToolkitResource,
} from "./toolkit-types";

interface ResourceRow {
  id: string;
  title: string;
  description: string | null;
  category: ToolkitCategory;
  file_url: string;
  file_path: string | null;
  file_name: string | null;
  active: boolean;
  created_at: string;
}

const fromRow = (r: ResourceRow): ToolkitResource => ({
  id: r.id,
  title: r.title,
  description: r.description,
  category: r.category,
  fileUrl: r.file_url,
  filePath: r.file_path,
  fileName: r.file_name,
  active: r.active,
  createdAt: r.created_at,
});

/** Active resources for the public page (empty list on DB failure). */
export async function getToolkitResources(): Promise<ToolkitResource[]> {
  try {
    const { rows } = await query<ResourceRow>(
      `select id, title, description, category, file_url, file_path,
              file_name, active, created_at
         from toolkit_resources
        where active
        order by category asc, created_at desc`,
    );
    return rows.map(fromRow);
  } catch (err) {
    console.error("[toolkits] DB read failed:", err);
    return [];
  }
}

/** Everything, including inactive rows — for the admin manager. */
export async function getAllToolkitResources(): Promise<ToolkitResource[]> {
  const { rows } = await query<ResourceRow>(
    `select id, title, description, category, file_url, file_path,
            file_name, active, created_at
       from toolkit_resources
      order by category asc, created_at desc`,
  );
  return rows.map(fromRow);
}

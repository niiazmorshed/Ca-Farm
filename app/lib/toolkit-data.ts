/* Server-side loader for the Entrepreneur Toolkits resources — SERVER ONLY
   (imports pg via ./db; a client component must import toolkit-types.ts
   instead, or the browser bundle tries to resolve dns/fs/net/tls).
   Rows live in toolkit_resources (managed in /admin/toolkits); files sit in
   the public "toolkits" Supabase Storage bucket, or the row points at an
   external URL. The public page degrades to an empty list if the DB is
   unreachable — it never 500s. */

import { query } from "./db";
import { toolkitSlug } from "./toolkit-types";
import type { ToolkitCategory, ToolkitResource } from "./toolkit-types";
import { STARTER_RESOURCES } from "./toolkit-content";

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
  framework: string | null;
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
  framework: r.framework,
  fileUrl: r.file_url,
  filePath: r.file_path,
  fileName: r.file_name,
  active: r.active,
  createdAt: r.created_at,
});

const SELECT_COLS = `id, title, description, category, framework, file_url,
                     file_path, file_name, active, created_at`;

/** Active resources for the public page (empty list on DB failure). */
export async function getToolkitResources(): Promise<ToolkitResource[]> {
  try {
    const { rows } = await query<ResourceRow>(
      `select ${SELECT_COLS}
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
    `select ${SELECT_COLS}
       from toolkit_resources
      order by category asc, created_at desc`,
  );
  return rows.map(fromRow);
}

/* ---------- request-form lookup ---------- */

/** A resource the request form can be opened for. `id` is null for catalogue
    entries that have no uploaded file yet. */
export interface RequestableResource {
  id: string | null;
  title: string;
  description: string | null;
  category: ToolkitCategory;
  framework: string | null;
}

/**
 * Resolve a slug from a "Request a copy" link back to the resource it names.
 * Uploaded rows win over catalogue entries with the same title, so once a real
 * file exists the request is attributed to it. Returns null when nothing
 * matches, which the page turns into a 404 rather than trusting the URL.
 */
export async function findRequestableResourceBySlug(
  slug: string,
): Promise<RequestableResource | null> {
  try {
    const { rows } = await query<ResourceRow>(
      `select ${SELECT_COLS} from toolkit_resources where active`,
    );
    const hit = rows.map(fromRow).find((r) => toolkitSlug(r.title) === slug);
    if (hit) {
      return {
        id: hit.id,
        title: hit.title,
        description: hit.description,
        category: hit.category,
        framework: hit.framework,
      };
    }
  } catch (err) {
    // A DB outage should not stop someone requesting a catalogue item.
    console.error("[toolkits] resource lookup failed, trying catalogue:", err);
  }

  const starter = STARTER_RESOURCES.find((r) => toolkitSlug(r.title) === slug);
  if (!starter) return null;
  return {
    id: null,
    title: starter.title,
    description: starter.description,
    category: starter.category,
    framework: starter.framework ?? null,
  };
}

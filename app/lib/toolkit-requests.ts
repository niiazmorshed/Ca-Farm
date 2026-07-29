/* Founders Hub file requests: log + read. SERVER ONLY (imports pg via ./db). */

import { query } from "./db";

export interface ToolkitRequest {
  id: string;
  resourceId: string;
  resourceTitle: string | null;
  email: string;
  status: "sent" | "failed";
  error: string | null;
  createdAt: Date;
}

interface RequestRow {
  id: string;
  resource_id: string;
  resource_title: string | null;
  email: string;
  status: "sent" | "failed";
  error: string | null;
  created_at: Date;
}

/** How many requests one email may make per hour, across all resources. */
export const REQUEST_RATE_LIMIT = 5;
const RATE_WINDOW = "1 hour";

export async function countRecentRequests(email: string): Promise<number> {
  const { rows } = await query<{ n: number }>(
    `select count(*)::int as n
       from toolkit_requests
      where lower(email) = lower($1)
        and created_at > now() - interval '${RATE_WINDOW}'`,
    [email],
  );
  return rows[0]?.n ?? 0;
}

export async function logRequest(input: {
  resourceId: string;
  email: string;
  status: "sent" | "failed";
  error?: string | null;
}): Promise<void> {
  await query(
    `insert into toolkit_requests (resource_id, email, status, error)
     values ($1, $2, $3, $4)`,
    [input.resourceId, input.email, input.status, input.error ?? null],
  );
}

/** Newest-first request log for the admin screen. */
export async function getToolkitRequests(limit = 200): Promise<ToolkitRequest[]> {
  const { rows } = await query<RequestRow>(
    `select r.id, r.resource_id, t.title as resource_title, r.email,
            r.status, r.error, r.created_at
       from toolkit_requests r
       left join toolkit_resources t on t.id = r.resource_id
      order by r.created_at desc
      limit $1`,
    [limit],
  );
  return rows.map((r) => ({
    id: r.id,
    resourceId: r.resource_id,
    resourceTitle: r.resource_title,
    email: r.email,
    status: r.status,
    error: r.error,
    createdAt: r.created_at,
  }));
}

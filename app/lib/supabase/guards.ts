import { redirect } from "next/navigation";
import { createClient } from "./server";
import { query } from "../db";

/** Current authenticated user, or null. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Lightweight email for UI (the header). Verifies the JWT locally via getClaims
 * (no network round-trip, no "insecure session" warning). Real route gating
 * still uses getUser + RLS.
 */
export async function getSessionEmail() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  return typeof email === "string" ? email : null;
}

/** Require any signed-in user; otherwise redirect to login. */
export async function requireUser(next = "/portal") {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

/**
 * Require an admin. Non-admins are sent to /portal (not 404) to avoid leaking
 * the existence of the admin area. Role is read via the pg pool (bypasses RLS)
 * keyed on the authenticated user id — reliable and not subject to the
 * is_admin() policy footgun.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/admin")}`);

  const { rows } = await query<{ role: string }>(
    "select role from public.profiles where id = $1",
    [user.id],
  );

  if (rows[0]?.role !== "admin") redirect("/portal");
  return user;
}

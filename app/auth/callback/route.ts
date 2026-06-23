import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";
import { query } from "../../lib/db";

/**
 * OAuth (Google) redirect target. Exchanges the PKCE `code` for a session,
 * then routes by role: admins to /admin, everyone else to /portal — unless an
 * explicit safe `next` was carried through.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next) return NextResponse.redirect(`${origin}${next}`);

      // Role via the pg pool (bypasses RLS) — reliable right after exchange.
      let role: string | null = null;
      const userId = data.user?.id;
      if (userId) {
        const { rows } = await query<{ role: string }>(
          "select role from public.profiles where id = $1",
          [userId],
        );
        role = rows[0]?.role ?? null;
      }
      return NextResponse.redirect(
        `${origin}${role === "admin" ? "/admin" : "/portal"}`,
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?notice=oauth`);
}

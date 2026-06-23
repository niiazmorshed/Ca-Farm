import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";

/**
 * Email-confirmation landing route. Supabase links here with a `token_hash`;
 * we verify it, which sets the session cookie, then forward the user on.
 * Requires the Supabase email template to point at {{ .TokenHash }}.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/portal";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/portal";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?notice=confirm`);
}

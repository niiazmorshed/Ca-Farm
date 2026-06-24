"use server";

import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { query } from "../lib/db";

export interface SignupState {
  error?: string;
  checkEmail?: boolean;
  values?: { email?: string; fullName?: string };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const values = { email, fullName };

  if (fullName.length < 2) return { error: "Please tell us your name.", values };
  if (!EMAIL_RE.test(email))
    return { error: "Please enter a valid email address.", values };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters.", values };

  // Create the user already confirmed via the Admin API — sends no email, so
  // signup works regardless of the project's email-confirmation setting and
  // never hits the email rate limit. Role is set to 'client' by a DB trigger.
  const admin = createAdminClient();
  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (createError) {
    const exists = /already|exists|registered|duplicate/i.test(
      createError.message,
    );
    return {
      error: exists
        ? "An account with this email already exists — try signing in."
        : createError.message,
      values,
    };
  }

  // Establish a session for the new user, then route by role.
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) return { error: signInError.message, values };

  let role: string | null = null;
  const userId = created.user?.id;
  if (userId) {
    const { rows } = await query<{ role: string }>(
      "select role from public.profiles where id = $1",
      [userId],
    );
    role = rows[0]?.role ?? null;
  }

  redirect(role === "admin" ? "/admin" : "/portal");
}

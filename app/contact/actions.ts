"use server";

import { query } from "../lib/db";

export interface EnquiryState {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    service: String(formData.get("service") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  const errors: EnquiryState["errors"] = {};
  if (values.name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(values.email))
    errors.email = "Please enter a valid email address.";
  if (values.message.length < 10)
    errors.message = "Tell us a little more — a sentence or two is plenty.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  // Save to Postgres (Supabase). Parameterised query ($1..$5) — never string
  // interpolation — so user input can't be used for SQL injection.
  try {
    await query(
      `insert into enquiries (name, email, company, service, message)
       values ($1, $2, $3, $4, $5)`,
      [
        values.name,
        values.email,
        values.company || null,
        values.service || null,
        values.message.slice(0, 4000),
      ],
    );
  } catch (err) {
    console.error("[enquiry] failed to save:", err);
    return { status: "error", values };
  }

  return { status: "success" };
}

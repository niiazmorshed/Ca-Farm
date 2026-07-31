"use server";

/* "Request a copy" on the Founders Hub.

   A visitor fills in the form and we record who they are and what they want.
   Nothing is emailed automatically: a team member reads the request in
   /admin/toolkits and sends the file by hand, then marks it sent.

   Deliberately public (no auth). Abuse is bounded by a per-address hourly
   limit, and the request only ever records what was typed in. */

import { revalidatePath } from "next/cache";
import { findRequestableResourceBySlug } from "../lib/toolkit-data";
import {
  countRecentRequests,
  createRequest,
  REQUEST_RATE_LIMIT,
} from "../lib/toolkit-requests";

export interface RequestState {
  status: "idle" | "sent" | "error";
  message?: string;
  /** Field-level errors, keyed by input name, so each one renders in place. */
  errors?: Record<string, string>;
}

/* Permissive on purpose: the real test of an address is whether mail arrives.
   This only rejects obvious nonsense. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* Digits, spaces and the usual punctuation; 7 to 20 digits once stripped. */
const PHONE_RE = /^[+()\d][\d\s().-]{5,}$/;

const LIMITS = { name: 120, phone: 40, email: 254, purpose: 1000 };

export async function submitResourceRequestAction(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();

  const errors: Record<string, string> = {};

  if (!name) errors.name = "Please tell us your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  if (!phone) errors.phone = "Please give us a phone number.";
  else if (phone.length > LIMITS.phone) errors.phone = "That number is too long.";
  else if (!PHONE_RE.test(phone) || (phone.replace(/\D/g, "").length < 7))
    errors.phone = "Enter a valid phone number.";

  if (!email) errors.email = "Please give us an email address.";
  else if (email.length > LIMITS.email) errors.email = "That address is too long.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (!purpose) errors.purpose = "Let us know what you need it for.";
  else if (purpose.length > LIMITS.purpose)
    errors.purpose = "Please keep this under 1000 characters.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the fields below.", errors };
  }

  // Resolve the slug server-side rather than trusting a posted title.
  const resource = await findRequestableResourceBySlug(slug);
  if (!resource) {
    return {
      status: "error",
      message: "That resource is no longer available. Please go back and pick another.",
    };
  }

  try {
    if ((await countRecentRequests(email)) >= REQUEST_RATE_LIMIT) {
      return {
        status: "error",
        message: "That is a lot of requests in one go. Please try again later.",
      };
    }
  } catch (err) {
    // A failed rate-limit read should not block a genuine request.
    console.error("[toolkits] rate-limit check failed:", err);
  }

  try {
    await createRequest({
      resourceId: resource.id,
      resourceTitle: resource.title,
      name,
      phone,
      email,
      purpose,
    });
  } catch (err) {
    console.error("[toolkits] could not record request:", err);
    return {
      status: "error",
      message: "Something went wrong saving your request. Please try again.",
    };
  }

  revalidatePath("/admin/toolkits");
  return { status: "sent" };
}

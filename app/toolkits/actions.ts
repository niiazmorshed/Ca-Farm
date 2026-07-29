"use server";

/* "Email me a copy": a visitor asks for a Founders Hub resource, we send them a
   time-limited download link and log the request.

   Deliberately public (no auth): this is a lead-capture flow. Abuse is bounded
   by a per-email hourly rate limit, and by only ever emailing the address that
   was typed in, never an address supplied by a third party. */

import { createAdminClient } from "../lib/supabase/admin";
import { query } from "../lib/db";
import { site } from "../lib/content";
import {
  emailButton,
  emailShell,
  isEmailConfigured,
  sendEmail,
} from "../lib/email";
import {
  countRecentRequests,
  logRequest,
  REQUEST_RATE_LIMIT,
} from "../lib/toolkit-requests";

export interface RequestState {
  status: "idle" | "sent" | "error";
  message?: string;
}

const BUCKET = "toolkits";
/** Download links stay valid for a week, then quietly expire. */
const LINK_TTL_SECONDS = 60 * 60 * 24 * 7;

/* Deliberately permissive: the real proof an address is valid is whether the
   mail arrives. This only rejects obvious nonsense. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ResourceRow {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path: string | null;
  file_name: string | null;
}

export async function requestResourceAction(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const resourceId = String(formData.get("resource_id") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!/^\d+$/.test(resourceId)) {
    return { status: "error", message: "Something went wrong. Please refresh and try again." };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: "error", message: "Enter a valid email address." };
  }

  // Fail fast with an honest message rather than silently logging a request
  // that can never be delivered.
  if (!isEmailConfigured()) {
    console.error("[toolkits] request received but email is not configured");
    return {
      status: "error",
      message: "We can't send emails just yet. Please use the contact form and we'll send it over.",
    };
  }

  try {
    if ((await countRecentRequests(email)) >= REQUEST_RATE_LIMIT) {
      return {
        status: "error",
        message: "That's a lot of requests in one go. Please try again later.",
      };
    }
  } catch (err) {
    console.error("[toolkits] rate-limit check failed:", err);
  }

  let resource: ResourceRow | undefined;
  try {
    const { rows } = await query<ResourceRow>(
      `select id, title, description, file_url, file_path, file_name
         from toolkit_resources
        where id = $1 and active`,
      [resourceId],
    );
    resource = rows[0];
  } catch (err) {
    console.error("[toolkits] resource lookup failed:", err);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  if (!resource) {
    return { status: "error", message: "That resource is no longer available." };
  }

  // Storage-backed files get an expiring signed link; rows that point at an
  // external URL are sent as-is.
  let downloadUrl = resource.file_url;
  if (resource.file_path) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(resource.file_path, LINK_TTL_SECONDS);
      if (error) throw error;
      if (data?.signedUrl) downloadUrl = data.signedUrl;
    } catch (err) {
      // A public bucket still serves the plain URL, so fall back rather than fail.
      console.error("[toolkits] could not sign download URL, using public URL:", err);
    }
  }

  const heading = `Your copy of “${resource.title}”`;
  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:14px;line-height:1.65;color:#2b2f33;">
      Thanks for your interest. Your download is ready:
    </p>
    ${
      resource.description
        ? `<p style="margin:0 0 4px;font-size:14px;line-height:1.65;color:#2b2f33;"><strong>${resource.title}</strong></p>
           <p style="margin:0;font-size:13px;line-height:1.6;color:#62686e;">${resource.description}</p>`
        : `<p style="margin:0;font-size:14px;line-height:1.65;color:#2b2f33;"><strong>${resource.title}</strong></p>`
    }
    ${emailButton(downloadUrl, "Download your copy")}
    <p style="margin:0;font-size:12px;line-height:1.6;color:#62686e;">
      If the button doesn't work, paste this into your browser:<br>
      <a href="${downloadUrl}" style="color:#26890d;word-break:break-all;">${downloadUrl}</a>
    </p>
    <p style="margin:18px 0 0;font-size:13px;line-height:1.65;color:#2b2f33;">
      Questions about how it applies to your business? Just reply to this email.
    </p>`;

  const text = [
    `Your copy of "${resource.title}"`,
    "",
    "Thanks for your interest. Download your copy here:",
    downloadUrl,
    "",
    "This link expires in 7 days.",
    "Questions? Just reply to this email.",
    "",
    `${site.name}, ${site.address.join(", ")}`,
  ].join("\n");

  const result = await sendEmail({
    to: email,
    subject: `Your copy of ${resource.title}`,
    html: emailShell({
      heading,
      bodyHtml,
      footerNote:
        "You're receiving this because you requested this resource on cafarm.co. This link expires in 7 days.",
    }),
    text,
  });

  try {
    await logRequest({
      resourceId,
      email,
      status: result.ok ? "sent" : "failed",
      error: result.ok ? null : result.error,
    });
  } catch (err) {
    console.error("[toolkits] could not log request:", err);
  }

  if (!result.ok) {
    return {
      status: "error",
      message: "We couldn't send that just now. Please try again, or use the contact form.",
    };
  }

  return {
    status: "sent",
    message: `Sent. Check ${email} for your download link.`,
  };
}

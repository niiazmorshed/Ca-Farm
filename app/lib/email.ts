/* Transactional email via Resend. SERVER ONLY.

   Calls the Resend REST API with fetch rather than pulling in the SDK: one less
   dependency, and the payload we need is a single POST.

   Configuration (Vercel → Settings → Environment Variables):
     RESEND_API_KEY   required. From resend.com → API Keys.
     EMAIL_FROM       optional. Defaults to the address below. MUST be on a
                      domain verified in Resend, or sends are rejected.
     EMAIL_REPLY_TO   optional. Where replies land; defaults to the site address.

   Every function here returns a result object instead of throwing, so callers
   can log and degrade rather than 500 a page. */

import { site } from "./content";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/* Brand details come from `site` so the emails never drift from the rest of
   the site. `content.ts` is pure data, so importing it here is safe. */
const DEFAULT_FROM = `${site.name} <${site.email}>`;

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  /** Plain-text alternative. Always send one: it improves deliverability. */
  text: string;
  replyTo?: string;
}

export type SendEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not an exception: in local dev without a key we want the calling flow to
    // report "couldn't send" cleanly rather than crash.
    console.error("[email] RESEND_API_KEY is not set — email not sent.");
    return { ok: false, error: "Email is not configured on the server." };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo || process.env.EMAIL_REPLY_TO || undefined,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[email] Resend rejected the send:", res.status, detail);
      return { ok: false, error: `Email provider returned ${res.status}.` };
    }

    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, id: data?.id ?? null };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false, error: "Could not reach the email provider." };
  }
}

/* ---------- shared presentation ---------- */

const BRAND = "#26890d";
const INK = "#0b0b0c";
const MUTED = "#62686e";

/** Wraps body content in the CA Farm email shell. Inline styles only: email
    clients strip <style> blocks. */
export function emailShell(opts: {
  heading: string;
  bodyHtml: string;
  footerNote?: string;
}): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f6f2;font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e4e5;">
    <tr><td style="padding:24px 28px;border-bottom:3px solid ${BRAND};">
      <span style="font-size:17px;font-weight:bold;letter-spacing:-0.2px;">AIBN</span>
      <span style="font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1.4px;display:block;margin-top:3px;">Chartered Accountants</span>
    </td></tr>
    <tr><td style="padding:28px;">
      <h1 style="margin:0 0 14px;font-size:19px;line-height:1.35;color:${INK};">${opts.heading}</h1>
      ${opts.bodyHtml}
    </td></tr>
    <tr><td style="padding:16px 28px 24px;border-top:1px solid #e2e4e5;font-size:11px;line-height:1.6;color:${MUTED};">
      ${opts.footerNote ?? ""}
      <div style="margin-top:8px;">${site.name}, ${site.address.join(", ")} · <a href="${site.url}" style="color:${BRAND};">${site.url.replace(/^https?:\/\//, "")}</a></div>
    </td></tr>
  </table>
</body></html>`;
}

export function emailButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="background:${BRAND};">
    <a href="${href}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">${label}</a>
  </td></tr></table>`;
}

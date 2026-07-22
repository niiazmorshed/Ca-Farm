"use server";

/* Client-side of the enquiry chat: a client posts a reply into one of their
   own enquiry threads. Ownership is enforced (the enquiry must be theirs by
   user_id or matching email); an email-only match also claims the enquiry for
   the account so future lookups are by id. */

import { revalidatePath } from "next/cache";
import { query } from "../lib/db";
import { requireClient } from "../lib/supabase/guards";

export async function sendClientMessageAction(formData: FormData): Promise<void> {
  const user = await requireClient();

  const id = String(formData.get("id") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!/^\d+$/.test(id) || !body) return;

  // The enquiry must belong to this client (owned by id, or email fallback).
  const { rows } = await query<{ id: string; user_id: string | null }>(
    `select id, user_id from enquiries
      where id = $1 and (user_id = $2 or lower(email) = lower($3))`,
    [id, user.id, user.email ?? ""],
  );
  if (rows.length === 0) return;

  try {
    await query(
      `insert into enquiry_messages (enquiry_id, sender, sender_user_id, body)
       values ($1, 'client', $2, $3)`,
      [id, user.id, body],
    );
    // Claim an email-only-matched enquiry for this account.
    if (rows[0].user_id === null) {
      await query(`update enquiries set user_id = $1 where id = $2`, [user.id, id]);
    }
  } catch (err) {
    console.error("[portal] client reply failed:", err);
    return;
  }

  revalidatePath("/portal");
  revalidatePath("/admin/enquiries");
}

"use server";

/* Status transitions for the enquiries inbox (new → in_progress → resolved).
   Re-checks requireAdmin; revalidates the inbox and the dashboard KPIs. */

import { revalidatePath } from "next/cache";
import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/supabase/guards";

const STATUSES = new Set(["new", "in_progress", "resolved"]);

export async function updateEnquiryStatusAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  if (!/^\d+$/.test(id) || !STATUSES.has(status)) return;

  try {
    await query(`update enquiries set status = $1 where id = $2`, [status, id]);
  } catch (err) {
    console.error("[enquiries] status update failed:", err);
    return;
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

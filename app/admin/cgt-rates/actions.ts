"use server";

/* Admin save actions for the CGT calculator.

   - saveCgtSettings is TWO-PHASE: the first submit returns a preview (diff) and
     writes nothing; the Confirm submit carries a normalized `payload` and only
     THAT is written — so you always commit exactly what you previewed.
   - The multiplier rows (edit/add/delete) are immediate — a single number
     doesn't need a preview — but every write is guard-railed and audited.
   Both re-check requireAdmin. */

import { revalidatePath } from "next/cache";
import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/supabase/guards";
import { slugifyYearKey } from "../../lib/ireland-cgt";
import { validateCgtConfig, validateMultiplier } from "../../lib/cgt-guardrails";
import { diffRecords, type DiffEntry } from "../../lib/rate-diff";
import { recordAudit } from "../../lib/rate-audit";
import { getCgtData } from "../../lib/cgt-data";

/** Immediate-action result (multiplier rows). */
export interface ActionState {
  status: "idle" | "saved" | "error";
  message?: string;
}

/** Two-phase (preview → confirm) result. */
export type TwoPhaseState =
  | { status: "idle" }
  | { status: "preview"; payload: string; diff: DiffEntry[] }
  | { status: "saved"; message: string }
  | { status: "error"; message: string };

function revalidate() {
  revalidatePath("/tools/ireland-cgt");
  revalidatePath("/admin/cgt-rates");
  revalidatePath("/admin");
}

const num = (v: FormDataEntryValue | null) => Number(String(v ?? "").trim());
const pctFmt = (v: unknown) => `${v}%`;
const euroFmt = (v: unknown) =>
  typeof v === "number"
    ? new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v)
    : String(v);

/* ---------- settings: two-phase ---------- */

export async function saveCgtSettings(
  _prev: TwoPhaseState,
  formData: FormData,
): Promise<TwoPhaseState> {
  const user = await requireAdmin();

  if (formData.get("cancel")) return { status: "idle" };

  // Phase 2 — confirm: write the previewed payload only.
  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw === "string" && payloadRaw) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(payloadRaw);
    } catch {
      return { status: "error", message: "Could not read the change — try again." };
    }
    const v = validateCgtConfig(parsed as never);
    if (!v.ok) return { status: "error", message: v.message };
    try {
      await query(
        `insert into cgt_settings (id, config, reviewed_at) values (1, $1, now())
         on conflict (id) do update set config = excluded.config, reviewed_at = now(), updated_at = now()`,
        [JSON.stringify(v.value)],
      );
    } catch (err) {
      console.error("[cgt] settings save failed:", err);
      return { status: "error", message: "Could not save — try again." };
    }
    await recordAudit({
      area: "cgt-settings",
      action: "update",
      summary: "Updated CGT rates & exemption",
      details: v.value,
      changedBy: user.email ?? "admin",
    });
    revalidate();
    return { status: "saved", message: "Rates saved." };
  }

  // Phase 1 — preview.
  const v = validateCgtConfig({
    standardRatePercent: num(formData.get("standard_rate")),
    annualExemptionEur: num(formData.get("annual_exemption")),
    entrepreneurRatePercent: num(formData.get("entrepreneur_rate")),
    entrepreneurLifetimeCapEur: num(formData.get("entrepreneur_cap")),
  });
  if (!v.ok) return { status: "error", message: v.message };

  const { config: current } = await getCgtData();
  const diff = diffRecords(
    current as unknown as Record<string, unknown>,
    v.value as unknown as Record<string, unknown>,
    [
      { key: "standardRatePercent", label: "Standard rate", format: pctFmt },
      { key: "annualExemptionEur", label: "Annual exemption", format: euroFmt },
      { key: "entrepreneurRatePercent", label: "Entrepreneur rate", format: pctFmt },
      { key: "entrepreneurLifetimeCapEur", label: "Entrepreneur cap", format: euroFmt },
    ],
  );
  return { status: "preview", payload: JSON.stringify(v.value), diff };
}

/* ---------- multiplier rows: immediate + audited ---------- */

export async function saveCgtMultiplierRow(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin();
  const yearKey = String(formData.get("year_key") ?? "").trim();
  const n = num(formData.get("multiplier"));
  if (!yearKey) return { status: "error", message: "Missing year." };
  if (!validateMultiplier(n)) return { status: "error", message: "Multiplier must be > 0 and ≤ 50." };

  try {
    const { rowCount } = await query(
      `update cgt_multipliers set multiplier = $1, updated_at = now() where year_key = $2`,
      [n, yearKey],
    );
    if (!rowCount) return { status: "error", message: "Year not found." };
  } catch (err) {
    console.error("[cgt] multiplier row save failed:", err);
    return { status: "error", message: "Could not save." };
  }

  await recordAudit({
    area: "cgt-multipliers",
    action: "update",
    summary: `Set ${yearKey} multiplier to ${n}`,
    details: { yearKey, multiplier: n },
    changedBy: user.email ?? "admin",
  });
  revalidate();
  return { status: "saved", message: "Saved." };
}

export async function deleteCgtMultiplierRow(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const yearKey = String(formData.get("year_key") ?? "").trim();
  if (!yearKey) return;

  try {
    await query(`delete from cgt_multipliers where year_key = $1`, [yearKey]);
  } catch (err) {
    console.error("[cgt] delete failed:", err);
    return;
  }

  await recordAudit({
    area: "cgt-multipliers",
    action: "delete",
    summary: `Deleted year ${yearKey}`,
    details: { yearKey },
    changedBy: user.email ?? "admin",
  });
  revalidate();
}

export async function addCgtMultiplier(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin();
  const label = String(formData.get("year_label") ?? "").trim();
  const n = num(formData.get("multiplier"));
  if (!label) return { status: "error", message: "Enter a year label." };
  if (!validateMultiplier(n)) return { status: "error", message: "Multiplier must be > 0 and ≤ 50." };

  const yearKey = slugifyYearKey(label);
  if (!yearKey) return { status: "error", message: "That label isn't a valid year." };

  try {
    const { rows } = await query<{ next: number }>(
      `select coalesce(max(sort_order), -1) + 1 as next from cgt_multipliers`,
    );
    const sortOrder = rows[0]?.next ?? 0;
    await query(
      `insert into cgt_multipliers (year_key, year_label, sort_order, multiplier)
       values ($1, $2, $3, $4)`,
      [yearKey, label, sortOrder, n],
    );
  } catch (err) {
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "23505")
      return { status: "error", message: "That year already exists." };
    console.error("[cgt] add year failed:", err);
    return { status: "error", message: "Could not add the year." };
  }

  await recordAudit({
    area: "cgt-multipliers",
    action: "add",
    summary: `Added year ${label} (×${n})`,
    details: { yearKey, label, multiplier: n },
    changedBy: user.email ?? "admin",
  });
  revalidate();
  return { status: "saved", message: `Added ${label}.` };
}

/* ---------- review reminder ---------- */

/** Stamp reviewed_at without changing any values. */
export async function markReviewed(): Promise<void> {
  const user = await requireAdmin();
  try {
    await query(`update cgt_settings set reviewed_at = now() where id = 1`);
  } catch (err) {
    console.error("[cgt] mark reviewed failed:", err);
    return;
  }
  await recordAudit({
    area: "cgt-settings",
    action: "reviewed",
    summary: "Marked CGT rates reviewed (no change)",
    changedBy: user.email ?? "admin",
  });
  revalidate();
}

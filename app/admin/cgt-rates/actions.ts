"use server";

/* Admin save actions for the CGT calculator. Two independent forms:
   - saveCgtSettings   → the four scalars (rate, exemption, entrepreneur rate/cap)
                         stored as one JSONB row in cgt_settings.
   - saveCgtMultipliers → the indexation multiplier table (cgt_multipliers),
                         updated atomically from a single VALUES list.
   Both re-check requireAdmin, validate, then revalidate the public tool. */

import { revalidatePath } from "next/cache";
import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/supabase/guards";
import { slugifyYearKey } from "../../lib/ireland-cgt";

export interface ActionState {
  status: "idle" | "saved" | "error";
  message?: string;
}

function revalidate() {
  revalidatePath("/tools/ireland-cgt");
  revalidatePath("/admin/cgt-rates");
}

const num = (v: FormDataEntryValue | null) => Number(String(v ?? "").trim());

class Invalid extends Error {}

function euro(formData: FormData, name: string, label: string): number {
  const n = num(formData.get(name));
  if (!Number.isFinite(n) || n < 0) throw new Invalid(`${label} must be a number ≥ 0.`);
  return n;
}

function pct(formData: FormData, name: string, label: string): number {
  const n = num(formData.get(name));
  if (!Number.isFinite(n) || n < 0 || n > 100)
    throw new Invalid(`${label} must be between 0 and 100 (%).`);
  return n;
}

/** Save the four editable scalars into cgt_settings (single JSONB row id=1). */
export async function saveCgtSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  let config: {
    standardRatePercent: number;
    annualExemptionEur: number;
    entrepreneurRatePercent: number;
    entrepreneurLifetimeCapEur: number;
  };
  try {
    config = {
      standardRatePercent: pct(formData, "standard_rate", "Standard rate"),
      annualExemptionEur: euro(formData, "annual_exemption", "Annual exemption"),
      entrepreneurRatePercent: pct(formData, "entrepreneur_rate", "Entrepreneur Relief rate"),
      entrepreneurLifetimeCapEur: euro(formData, "entrepreneur_cap", "Entrepreneur Relief lifetime cap"),
    };
  } catch (err) {
    if (err instanceof Invalid) return { status: "error", message: err.message };
    throw err;
  }

  try {
    await query(
      `insert into cgt_settings (id, config) values (1, $1)
       on conflict (id) do update set config = excluded.config, updated_at = now()`,
      [JSON.stringify(config)],
    );
  } catch (err) {
    console.error("[cgt] settings save failed:", err);
    return { status: "error", message: "Could not save — check the values." };
  }

  revalidate();
  return { status: "saved", message: "Rates saved." };
}

/** Edit one existing year's multiplier. */
export async function saveCgtMultiplierRow(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const yearKey = String(formData.get("year_key") ?? "").trim();
  const n = num(formData.get("multiplier"));
  if (!yearKey) return { status: "error", message: "Missing year." };
  if (!Number.isFinite(n) || n <= 0)
    return { status: "error", message: "Multiplier must be greater than 0." };

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

  revalidate();
  return { status: "saved", message: "Saved." };
}

/** Delete one year. Used via a button `formAction`, so it takes only FormData. */
export async function deleteCgtMultiplierRow(formData: FormData): Promise<void> {
  await requireAdmin();

  const yearKey = String(formData.get("year_key") ?? "").trim();
  if (!yearKey) return;

  try {
    await query(`delete from cgt_multipliers where year_key = $1`, [yearKey]);
  } catch (err) {
    console.error("[cgt] delete failed:", err);
  }

  revalidate();
}

/** Add a new year. Admin enters a label + multiplier; the key is slugified and
    the sort order appends to the end (so a new year lands after the last one). */
export async function addCgtMultiplier(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const label = String(formData.get("year_label") ?? "").trim();
  const n = num(formData.get("multiplier"));
  if (!label) return { status: "error", message: "Enter a year label." };
  if (!Number.isFinite(n) || n <= 0)
    return { status: "error", message: "Multiplier must be greater than 0." };

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
    // 23505 = unique_violation (year_key already exists).
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "23505")
      return { status: "error", message: "That year already exists." };
    console.error("[cgt] add year failed:", err);
    return { status: "error", message: "Could not add the year." };
  }

  revalidate();
  return { status: "saved", message: `Added ${label}.` };
}

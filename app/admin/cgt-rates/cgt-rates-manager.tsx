"use client";

/* Admin editor for the CGT calculator. Two forms: the scalar rates, and the
   indexation multiplier table. Saving upserts the DB and revalidates the public
   calculator — no deploy. All values here override the code fallbacks. */

import { useActionState } from "react";
import type { CgtConfig, CgtMultiplier } from "../../lib/ireland-cgt";
import {
  saveCgtSettings,
  saveCgtMultiplierRow,
  deleteCgtMultiplierRow,
  addCgtMultiplier,
  type ActionState,
} from "./actions";

const IDLE: ActionState = { status: "idle" };

const inputClass =
  "h-9 w-full rounded-none border border-line bg-white px-2.5 text-sm text-ink tabular-nums transition-colors duration-200 focus:border-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function StateNote({ state }: { state: ActionState }) {
  if (state.status === "idle") return null;
  return (
    <p
      role="status"
      className={`text-xs font-medium ${
        state.status === "saved" ? "text-secondary-600" : "text-primary-600"
      }`}
    >
      {state.message}
    </p>
  );
}

function SaveButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 cursor-pointer items-center rounded-none bg-primary-500 px-4 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primary-600 disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function SettingsForm({ config }: { config: CgtConfig }) {
  const [state, action, pending] = useActionState(saveCgtSettings, IDLE);
  return (
    <form action={action} className="rounded-none border border-line bg-white p-5">
      <h3 className="font-display text-base font-semibold text-ink">Rates &amp; exemption</h3>
      <p className="mt-1 text-xs text-muted">
        The standard rate, annual exemption and Entrepreneur Relief. Foreign-life (40%)
        and VC-fund (15%) rates are fixed in statute and not editable here.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Standard CGT rate (%)">
          <input name="standard_rate" type="number" step="any" min="0" max="100" defaultValue={config.standardRatePercent} className={inputClass} required />
        </Field>
        <Field label="Annual exemption (€)">
          <input name="annual_exemption" type="number" step="any" min="0" defaultValue={config.annualExemptionEur} className={inputClass} required />
        </Field>
        <Field label="Entrepreneur Relief rate (%)">
          <input name="entrepreneur_rate" type="number" step="any" min="0" max="100" defaultValue={config.entrepreneurRatePercent} className={inputClass} required />
        </Field>
        <Field label="Entrepreneur Relief lifetime cap (€)">
          <input name="entrepreneur_cap" type="number" step="any" min="0" defaultValue={config.entrepreneurLifetimeCapEur} className={inputClass} required />
        </Field>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <SaveButton pending={pending} label="Save rates" />
        <StateNote state={state} />
      </div>
    </form>
  );
}

const rowBtn =
  "inline-flex h-9 shrink-0 cursor-pointer items-center rounded-none px-3 text-xs font-semibold transition-colors duration-200 disabled:opacity-60";

/* One editable year: multiplier input + Save (edit) + Delete. Save goes through
   useActionState for feedback; Delete uses a button formAction and relies on
   revalidation to drop the row. */
function MultiplierRow({ m }: { m: CgtMultiplier }) {
  const [state, action, pending] = useActionState(saveCgtMultiplierRow, IDLE);
  return (
    <form
      action={action}
      className="flex flex-wrap items-center gap-2 border-b border-line py-2 last:border-0"
    >
      <input type="hidden" name="year_key" value={m.yearKey} />
      <span className="w-44 shrink-0 text-sm text-ink">{m.yearLabel}</span>
      <input
        name="multiplier"
        type="number"
        step="any"
        min="0"
        defaultValue={m.multiplier}
        className={`${inputClass} max-w-[7rem]`}
        required
      />
      <button type="submit" disabled={pending} className={`${rowBtn} bg-primary-500 text-white hover:bg-primary-600`}>
        {pending ? "…" : "Save"}
      </button>
      <button
        type="submit"
        formAction={deleteCgtMultiplierRow}
        formNoValidate
        onClick={(e) => {
          if (!confirm(`Delete ${m.yearLabel}? The calculator will drop this year.`)) e.preventDefault();
        }}
        className={`${rowBtn} border border-line text-muted hover:border-primary-600 hover:text-primary-600`}
      >
        Delete
      </button>
      <StateNote state={state} />
    </form>
  );
}

function AddYearForm() {
  const [state, action, pending] = useActionState(addCgtMultiplier, IDLE);
  return (
    <form action={action} className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
      <Field label="New year label">
        <input name="year_label" placeholder="e.g. 2003" className={`${inputClass} max-w-[10rem]`} required />
      </Field>
      <Field label="Multiplier">
        <input name="multiplier" type="number" step="any" min="0" placeholder="1.000" className={`${inputClass} max-w-[7rem]`} required />
      </Field>
      <button type="submit" disabled={pending} className={`${rowBtn} bg-primary-500 text-white hover:bg-primary-600`}>
        {pending ? "Adding…" : "Add year"}
      </button>
      <StateNote state={state} />
    </form>
  );
}

function MultipliersForm({ multipliers }: { multipliers: CgtMultiplier[] }) {
  return (
    <div className="rounded-none border border-line bg-white p-5">
      <h3 className="font-display text-base font-semibold text-ink">Indexation multipliers</h3>
      <p className="mt-1 text-xs text-muted">
        Revenue&rsquo;s multiplier for each acquisition year — edit a value, delete a
        year, or add a new one. Frozen since 2003, but if indexation is ever extended
        you can add 2003 onward here, no redeploy.
      </p>
      <div className="mt-4 flex flex-col">
        {multipliers.map((m) => (
          <MultiplierRow key={m.yearKey} m={m} />
        ))}
      </div>
      <AddYearForm />
    </div>
  );
}

export function CgtRatesManager({
  config,
  multipliers,
}: {
  config: CgtConfig;
  multipliers: CgtMultiplier[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <SettingsForm config={config} />
      <MultipliersForm multipliers={multipliers} />
    </div>
  );
}

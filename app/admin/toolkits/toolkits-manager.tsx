"use client";

/* Admin manager for the Entrepreneur Toolkits: upload memos, templates, tax/
   VAT forms and guides (or link to external ones), edit their metadata, and
   take them on/off the public /toolkits page. Saving revalidates the public
   page immediately — no deploy. */

import { useActionState } from "react";
import { TOOLKIT_CATEGORIES, type ToolkitResource } from "../../lib/toolkit-data";
import { deleteResource, saveResource, type ActionState } from "./actions";

const IDLE: ActionState = { status: "idle" };

const inputClass =
  "h-9 w-full rounded-none border border-line bg-white px-2.5 text-sm text-ink transition-colors duration-200 focus:border-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
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

function ResourceForm({ resource }: { resource?: ToolkitResource }) {
  const [state, action, pending] = useActionState(saveResource, IDLE);
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteResource,
    IDLE,
  );
  const isNew = !resource;

  return (
    <div className="rounded-none border border-line bg-white p-4">
      <form action={action}>
        {resource && <input type="hidden" name="id" value={resource.id} />}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Title" className="lg:col-span-2">
            <input name="title" defaultValue={resource?.title ?? ""} className={inputClass} required />
          </Field>
          <Field label="Category">
            <select name="category" defaultValue={resource?.category ?? "template"} className={inputClass}>
              {TOOLKIT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-end gap-4 pb-1">
            <label className="flex items-center gap-1.5 text-sm text-ink">
              <input type="checkbox" name="active" defaultChecked={resource?.active ?? true} className="h-4 w-4 accent-primary-500" />
              Live on /toolkits
            </label>
          </div>
          <Field label="Description (optional)" className="sm:col-span-2 lg:col-span-4">
            <textarea name="description" rows={2} defaultValue={resource?.description ?? ""} className={`${inputClass} h-auto py-2`} />
          </Field>
          <Field label={isNew ? "File (PDF, Word, Excel, …)" : "Replace file (optional)"} className="lg:col-span-2">
            <input
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.md,.png,.jpg,.jpeg,.zip"
              className="w-full cursor-pointer text-sm text-ink file:mr-3 file:h-9 file:cursor-pointer file:rounded-none file:border file:border-line file:bg-surface-muted file:px-3 file:text-xs file:font-semibold file:text-ink"
            />
          </Field>
          <Field label="…or external link" className="lg:col-span-2">
            <input name="external_url" type="url" placeholder="https://…" className={inputClass} />
          </Field>
        </div>

        {resource && (
          <p className="mt-2 text-xs text-muted">
            Current file:{" "}
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener"
              className="font-medium text-primary-600 transition-colors duration-200 hover:text-primary-500"
            >
              {resource.fileName ?? resource.fileUrl}
            </a>
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-9 cursor-pointer items-center rounded-none bg-primary-500 px-4 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primary-600 disabled:opacity-60"
          >
            {pending ? "Saving…" : isNew ? "Add resource" : "Save"}
          </button>
          <StateNote state={state} />
          <StateNote state={deleteState} />
        </div>
      </form>

      {resource && (
        <form
          action={deleteAction}
          className="mt-2"
          onSubmit={(e) => {
            if (!confirm(`Delete “${resource.title}”? The stored file is removed too.`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={resource.id} />
          <button
            type="submit"
            disabled={deletePending}
            className="cursor-pointer text-xs font-medium text-secondary-600 transition-colors duration-200 hover:text-secondary-500 disabled:opacity-60"
          >
            {deletePending ? "Deleting…" : "Delete resource"}
          </button>
        </form>
      )}
    </div>
  );
}

export function ToolkitsManager({ resources }: { resources: ToolkitResource[] }) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="mb-3 font-display text-base font-semibold text-ink">
          Add a resource
        </h3>
        <ResourceForm />
      </section>

      <section>
        <h3 className="mb-3 font-display text-base font-semibold text-ink">
          Published resources ({resources.length})
        </h3>
        <div className="flex flex-col gap-4">
          {resources.length === 0 && (
            <p className="text-sm text-muted">
              Nothing uploaded yet — add the first memo, template or form above.
            </p>
          )}
          {resources.map((r) => (
            <ResourceForm key={r.id} resource={r} />
          ))}
        </div>
      </section>
    </div>
  );
}

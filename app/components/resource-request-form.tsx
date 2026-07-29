"use client";

/* "Email me a copy" on a Founders Hub resource card.

   Collapsed to a single link until clicked, so a grid of cards stays scannable.
   Once opened it is a one-field form with an inline pending state, and it
   collapses back to a confirmation line on success. */

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { requestResourceAction, type RequestState } from "../toolkits/actions";

const IDLE: RequestState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-none bg-primary-500 px-3.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Sending
        </>
      ) : (
        "Send"
      )}
    </button>
  );
}

export function ResourceRequestForm({
  resourceId,
  label = "Email me a copy",
}: {
  resourceId: string;
  label?: string;
}) {
  const [state, action] = useActionState(requestResourceAction, IDLE);
  const [open, setOpen] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the field when the form opens, so it is immediately typeable.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (state.status === "sent") {
    return (
      <p className="text-xs font-medium leading-5 text-primary-600">
        {state.message}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer whitespace-nowrap text-sm font-semibold text-primary-500 transition-colors duration-200 hover:text-primary-600"
      >
        {label} <span aria-hidden="true">→</span>
      </button>
    );
  }

  return (
    <form action={action} className="w-full">
      <input type="hidden" name="resource_id" value={resourceId} />
      <label htmlFor={inputId} className="sr-only">
        Your email address
      </label>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.ie"
          className="h-9 w-full min-w-0 rounded-none border border-line bg-white px-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-400/40"
        />
        <SubmitButton />
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-1.5 text-xs leading-5 text-secondary-600">
          {state.message}
        </p>
      )}
      <p className="mt-1.5 text-[11px] leading-4 text-muted">
        We&apos;ll email you a download link. No marketing list.
      </p>
    </form>
  );
}

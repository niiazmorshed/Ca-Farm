"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "../contact/actions";
import { services } from "../lib/content";

const initialState: EnquiryState = { status: "idle" };

const inputClasses =
  "w-full rounded-xl border border-line bg-parchment px-4 py-3 text-[15px] text-ink placeholder:text-sage-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest-700";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-700">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitEnquiry,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-forest-700/30 bg-surface p-8">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-950 text-brass-300">
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
              d="M4 10.5l4 4L16 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Thank you — we’ve got it.
        </h2>
        <p className="text-[15px] leading-7 text-sage-600">
          Your enquiry is in. A partner — not an autoresponder — will reply
          within one business day.
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClasses}
            placeholder="Jane Smith"
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClasses}
            placeholder="jane@company.co"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
            Company <span className="font-normal text-sage-500">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            defaultValue={values.company}
            className={inputClasses}
            placeholder="Company Ltd"
          />
        </div>
        <div>
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium">
            What do you need?
          </label>
          <select
            id="service"
            name="service"
            defaultValue={values.service || "Not sure yet"}
            className={`${inputClasses} cursor-pointer`}
          >
            <option>Not sure yet</option>
            {services.map((service) => (
              <option key={service.slug}>{service.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputClasses} resize-y`}
          placeholder="Where are your books today, and what’s the goal?"
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-brass-400 px-7 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-brass-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-600 disabled:cursor-default disabled:opacity-60"
        >
          {isPending && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="3"
              />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          )}
          {isPending ? "Sending…" : "Send enquiry"}
        </button>
        <p className="text-xs text-sage-500">
          We reply within one business day. No newsletters, no spam.
        </p>
      </div>
    </form>
  );
}

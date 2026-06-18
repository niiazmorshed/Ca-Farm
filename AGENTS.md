## CA Farm — Agent Instructions

Persistent rules for working in this repo. These apply to **every Agent session** automatically.
For git push/merge workflow, see `CLAUDE.md`.


## Project

Marketing site for **CA Farm** — a partner-led chartered accountancy practice (audit, tax, bookkeeping, payroll, advisory). UK-focused copy and tone: professional, plain English, no jargon.



## Stack

- **Next.js 16** (App Router)
- **React 19**, **TypeScript**
- **Tailwind CSS v4** (`app/globals.css` with `@theme` tokens)
- **Fonts:** Fraunces (display), Geist (body) — loaded in `app/layout.tsx`

Commands: `npm run dev` · `npm run build` · `npm run lint`

---

## Structure

```
app/
  page.tsx, about/, contact/, pricing/, services/   # routes
  components/     # UI, layout, sections
  lib/content.ts  # site config, services, pricing, copy data
  globals.css     # brand tokens and base styles
```

- **Pages** compose section components; keep pages thin.
- **Copy and structured data** live in `app/lib/content.ts` — edit there instead of hardcoding in components.
- **Reusable UI** (`Button`, `Card`, etc.) → `app/components/ui.tsx`.
- **Page sections** (Hero, Faq, etc.) → `app/components/sections.tsx`.
- **Server actions** → colocate with the route (e.g. `app/contact/actions.ts`).


## Conventions

- Functional React components; default exports for pages/layouts.
- Tailwind utility classes only — use brand tokens (`canvas`, `surface`, `ink`, `ink-body`, `muted`, `primary-*`, `secondary-*`, `navy-*`), not arbitrary hex in components.
- Display headings: `font-display`; body: default `font-sans`.
- Preserve accessibility: skip link, semantic HTML, focus states.
- SEO: use `metadata` exports on pages; site URL and defaults in `app/layout.tsx`.
- Minimize scope — match existing patterns; don't refactor unrelated files.
- No new dependencies unless the task clearly needs them.

---

## When to update this file

**You do NOT need to update `AGENTS.md` before every prompt.**

| Situation | Update AGENTS.md? | What to do instead |
|-----------|-------------------|-------------------|
| Starting a new feature | **No** | Describe the feature in your chat prompt |
| One feature done, starting another | **No** | New prompt with the next task; Agent reads the codebase |
| One-off task ("fix this button") | **No** | Just ask in chat |
| Agent keeps making the same mistake | **Yes** | Add a rule so it stops happening |
| New permanent convention (e.g. all forms use X) | **Yes** | Document it here |
| Architecture or stack change | **Yes** | Update the relevant sections |

**Rule of thumb:** `AGENTS.md` = things that should be true for *all* future work. Your chat prompt = what you want *right now*.

---

## Skills (optional)

This repo has design skills under `.claude/skills/` (UI, banners, design system). Use them when the task involves visual design or new marketing assets — not required for routine code changes.

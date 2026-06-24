## CA Farm — Agent Instructions

Persistent rules for working in this repo. These apply to **every Agent session** automatically.
For git push/merge workflow, see `CLAUDE.md`.


## Project

Marketing site for **CA Farm** — a partner-led chartered accountancy practice (audit, tax, bookkeeping, payroll, advisory). UK-focused copy and tone: professional, plain English, no jargon.



## Stack

- **Next.js 16** (App Router)
- **React 19**, **TypeScript**
- **Tailwind CSS v4** (`app/globals.css` with `@theme` tokens)
- **Framer Motion** (`motion` package, import from `motion/react`) — scroll reveals, count-up, accordion
- **Supabase** — Postgres (via `pg`) + **Supabase Auth** (`@supabase/ssr`, cookie sessions, RLS)
- **Fonts:** Fraunces (display), Geist (body) — loaded in `app/layout.tsx`

Commands: `npm run dev` · `npm run build` · `npm run lint`

---

## Structure

```
app/
  page.tsx, about/, contact/, pricing/, services/   # marketing routes
  login/, signup/, portal/, admin/, auth/{confirm,callback}/  # auth routes
  components/      # UI, layout, sections + motion primitives
  lib/content.ts   # site config, services, pricing, copy data
  lib/images.ts    # curated Unsplash URLs (used as CSS background-image)
  lib/db.ts        # Postgres pool (pg) — contact write, admin reads
  lib/supabase/    # @supabase/ssr browser/server/admin clients, guards, session helper
  globals.css      # brand tokens, easing/animation tokens, base styles
proxy.ts           # (Next 16 middleware) refreshes session + gates /portal, /admin
```

- **Motion primitives** (client components, all reduced-motion safe):
  `reveal.tsx` (scroll fade-up), `count-up.tsx` (stats), `clip-reveal.tsx`
  (image clip), `accordion.tsx` (FAQ), `back-to-top.tsx`.

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

### Motion & imagery

- Animate with **Framer Motion** (`motion/react`) — never hand-rolled
  IntersectionObserver. Reuse the primitives in `app/components/` before adding new ones.
- Animate `transform` / `opacity` only; custom ease-out is the `ease-snappy`
  token (`cubic-bezier(0.23,1,0.32,1)`); UI ≤300ms, reveals ~600–900ms.
- Every motion must respect `prefers-reduced-motion` (drop movement, keep content);
  SSR must render the final/visible state for SEO + JS-off.
- **`transform` on an ancestor breaks `position: sticky` on descendants** — never
  wrap a sticky-aside grid in `Reveal` (or any transformed element).
- The header is **`sticky top-0` on the `<header>` element itself** (not an inner
  div — an inner sticky child fills its short parent and can't stick).
- Photos are CSS `background-image` from `lib/images.ts` over a gradient scrim
  (no `next/image` remote config); verify any new Unsplash URL returns 200.

### Auth & data

- **Auth = Supabase Auth via `@supabase/ssr`.** Browser client `lib/supabase/client.ts`,
  server client `lib/supabase/server.ts`, session refresh + route gating in `proxy.ts`
  (matcher = `/portal` + `/admin` only), guards in `lib/supabase/guards.ts`
  (`requireUser`, `requireAdmin`, `getSessionEmail`).
- **Roles** live in `public.profiles.role` (`client` | `admin`). The `handle_new_user`
  signup trigger is the **single source of truth**: it sets `role='admin'` only when
  the email matches one hardcoded admin address (`idublinfourir@gmail.com`,
  case-insensitive), otherwise `client`. This holds for every sign-in path (password
  or Google OAuth) and there is intentionally **no profile UPDATE policy**, so a
  client can't self-promote. Change the admin by editing that email in the trigger
  (via migration/MCP).
- **Signup uses the Admin API** (`lib/supabase/admin.ts`, service-role key,
  `admin.createUser({ email_confirm: true })`) so accounts are pre-confirmed — no
  confirmation email, no email rate-limit, independent of the dashboard "Confirm
  email" toggle. It then signs the user in and redirects by role.
- **Google OAuth** via `signInWithOAuth` → `/auth/callback` exchanges the PKCE
  code. OAuth users get a `client` profile from the same trigger. Provider is
  enabled in the Supabase dashboard (not via code/MCP).
- **Role lookups for redirect/gating use `pg`** (login action, `/auth/callback`,
  `requireAdmin`) — reading `profiles.role` via the Supabase client right after
  sign-in is unreliable (RLS + session timing), so query the `pg` pool by user id.
- **Header auth is read SERVER-SIDE**: the root layout calls `getSessionEmail()`
  (local `getClaims`, no network) and passes `userEmail` to `<SiteHeader>`; logout
  is the **server action** in `app/auth/actions.ts` (clears the cookie server-side).
  Do **not** read the session in the browser for the header — the SSR cookie isn't
  reliably readable client-side.
- **Two data paths by design:** `lib/db.ts` (`pg`) for the contact write, admin
  enquiries read, and all role lookups; `supabase-js` for auth/session. `enquiries`
  keeps RLS on with no policy (anon denied, `pg` owner bypasses) — leave it.
- **Secrets** live in `.env.local` only — `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, **`SUPABASE_SERVICE_ROLE_KEY`** (server-only,
  never `NEXT_PUBLIC`), and the `EmailJs_*` keys. Never echo or commit them. Run
  Supabase security advisors after any DDL.

### Contact email (EmailJS)

- `app/contact/actions.ts` saves the enquiry to Postgres, then sends an email via
  the **EmailJS REST API** server-side, wrapped in Next's `after()` so it never
  blocks the form response (best-effort — failures logged, not surfaced). Keys:
  `EmailJs_Gmail_serviceid_KEY`, `EmailJs_Template_KEY`, `EmailJs_PUBLIC_KEY`,
  `EmailJs_Private_KEY`.

### Testing

- E2E via **Playwright** lives in `/e2e` (gitignored, installed `--no-save` — not a
  project dependency). Run: `npx playwright test --config e2e/playwright.config.ts`
  (spins up a prod server on `:3100`). Covers marketing pages, auth gating,
  login/signup/logout, role routing, and the contact form.

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

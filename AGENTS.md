## CA Farm — Agent Instructions

Persistent rules for repo. Apply **every Agent session** automatically.
Git push/merge workflow: see `CLAUDE.md`.


## Project

Marketing site for **CA Farm** — partner-led chartered accountancy practice (audit, tax, bookkeeping, payroll, advisory). UK copy + tone: professional, plain English, no jargon.



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
- **Copy + structured data** live in `app/lib/content.ts` — edit there, don't hardcode in components.
- **Reusable UI** (`Button`, `Card`, etc.) → `app/components/ui.tsx`.
- **Page sections** (Hero, Faq, etc.) → `app/components/sections.tsx`.
- **Server actions** → colocate with route (e.g. `app/contact/actions.ts`).


## Conventions

- Functional React components; default exports for pages/layouts.
- Tailwind utility classes only — use brand tokens (`canvas`, `surface`, `ink`, `ink-body`, `muted`, `primary-*`, `secondary-*`, `navy-*`), not arbitrary hex in components.
- Display headings: `font-display`; body: default `font-sans`.
- Preserve accessibility: skip link, semantic HTML, focus states.
- SEO: use `metadata` exports on pages; site URL + defaults in `app/layout.tsx`.
- Minimize scope — match existing patterns; no refactor of unrelated files.
- No new dependencies unless task clearly needs them.

### Motion & imagery

- Animate with **Framer Motion** (`motion/react`) — never hand-rolled
  IntersectionObserver. Reuse primitives in `app/components/` before adding new.
- Animate `transform` / `opacity` only; custom ease-out is `ease-snappy`
  token (`cubic-bezier(0.23,1,0.32,1)`); UI ≤300ms, reveals ~600–900ms.
- Every motion respects `prefers-reduced-motion` (drop movement, keep content);
  SSR renders final/visible state for SEO + JS-off.
- **`transform` on ancestor breaks `position: sticky` on descendants** — never
  wrap sticky-aside grid in `Reveal` (or any transformed element).
- Header is **`sticky top-0` on `<header>` element itself** (not inner
  div — inner sticky child fills short parent, can't stick).
- Photos = CSS `background-image` from `lib/images.ts` over gradient scrim
  (no `next/image` remote config); verify any new Unsplash URL returns 200.

### Auth & data

- **Auth = Supabase Auth via `@supabase/ssr`.** Browser client `lib/supabase/client.ts`,
  server client `lib/supabase/server.ts`, session refresh + route gating in `proxy.ts`
  (matcher = `/portal` + `/admin` only), guards in `lib/supabase/guards.ts`
  (`requireUser`, `requireAdmin`, `requireClient`, `getSessionUser`).
- **Roles** live in `public.profiles.role` (`client` | `admin`). The `handle_new_user`
  signup trigger is **single source of truth**: sets `role='admin'` only when
  email matches one hardcoded admin address (`idublinfourir@gmail.com`,
  case-insensitive), else `client`. Holds for every sign-in path (password
  or Google OAuth); intentionally **no profile UPDATE policy**, so a
  client can't self-promote. Change admin by editing that email in the trigger
  (via migration/MCP).
- **Signup uses Admin API** (`lib/supabase/admin.ts`, service-role key,
  `admin.createUser({ email_confirm: true })`) so accounts pre-confirmed — no
  confirmation email, no email rate-limit, independent of dashboard "Confirm
  email" toggle. Then signs user in, redirects by role.
- **Google OAuth** via `signInWithOAuth` → `/auth/callback` exchanges PKCE
  code. OAuth users get `client` profile from same trigger. Provider
  enabled in Supabase dashboard (not via code/MCP). `redirectTo` =
  `window.location.origin/auth/callback` (adapts per host). Google's authorized
  redirect URI is the **Supabase** callback (`https://<ref>.supabase.co/auth/v1/callback`),
  not app URL. Supabase **Auth → URL Configuration** must allow-list both
  prod URL (`https://ca-farm.vercel.app/auth/callback`) and local
  (`http://localhost:3000/**` — note **http**). Consent screen is External: add
  test users or Publish.
- **Role in JWT:** `custom_access_token_hook` (DB function) stamps a `user_role`
  claim from `profiles`; enable "Customize Access Token (JWT) Claims" hook in
  dashboard to activate. `getSessionUser` prefers that claim, falls back to
  `profiles` lookup when absent — so header needs no per-request DB query once
  hook on.
- **Role lookups for redirect/gating use `pg`** (login action, `/auth/callback`,
  `requireAdmin`) — reading `profiles.role` via Supabase client right after
  sign-in is unreliable (RLS + session timing), so query `pg` pool by user id.
- **Header auth read SERVER-SIDE**: root layout calls `getSessionUser()`
  (local `getClaims`, no network) and passes `user` (email/name/avatar/role) to
  `<SiteHeader>`; logout is the **server action** in `app/auth/actions.ts` (clears
  cookie server-side). Do **not** read session in browser for header
  — SSR cookie not reliably readable client-side. `/admin` and `/portal` render
  own shells (sidebar + topbar); `ChromeGate` hides public header/footer there.
- **Two data paths by design:** `lib/db.ts` (`pg`) for contact write, admin
  enquiries read, all role lookups; `supabase-js` for auth/session. `enquiries`
  keeps RLS on with no policy (anon denied, `pg` owner bypasses) — leave it.
- **Secrets** live in `.env.local` locally — `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, **`SUPABASE_SERVICE_ROLE_KEY`** (server-only,
  never `NEXT_PUBLIC`), and `EmailJs_*` keys. Same keys set in **Vercel**
  project env for prod. Never echo or commit them. Run Supabase security advisors
  after any DDL.
- **Security headers** set in `next.config.ts` (`headers()`, all routes): CSP, HSTS
  (prod), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy. CSP allows
  `'unsafe-inline'` (no nonce yet) and dev-only `'unsafe-eval'` + localhost ws; it
  allow-lists Supabase (`connect-src`) and Google avatar / Unsplash image hosts.

### Contact email (EmailJS)

- `app/contact/actions.ts` saves enquiry to Postgres, then sends email via
  **EmailJS REST API** server-side, wrapped in Next's `after()` so it never
  blocks form response (best-effort — failures logged, not surfaced). Keys:
  `EmailJs_Gmail_serviceid_KEY`, `EmailJs_Template_KEY`, `EmailJs_PUBLIC_KEY`,
  `EmailJs_Private_KEY`.

### Testing

- E2E via **Playwright** lives in `/e2e` (gitignored, installed `--no-save` — not a
  project dependency). Run: `npx playwright test --config e2e/playwright.config.ts`
  (spins up prod server on `:3100`). Covers marketing pages, auth gating,
  login/signup/logout, role routing, contact form.

---

## When to update this file

**You do NOT need to update `AGENTS.md` before every prompt.**

| Situation | Update AGENTS.md? | What to do instead |
|-----------|-------------------|-------------------|
| Starting a new feature | **No** | Describe feature in chat prompt |
| One feature done, starting another | **No** | New prompt with next task; Agent reads codebase |
| One-off task ("fix this button") | **No** | Just ask in chat |
| Agent keeps making same mistake | **Yes** | Add rule so it stops |
| New permanent convention (e.g. all forms use X) | **Yes** | Document here |
| Architecture or stack change | **Yes** | Update relevant sections |

**Rule of thumb:** `AGENTS.md` = things true for *all* future work. Chat prompt = what you want *right now*.

---

## Skills (optional)

Repo has design skills under `.claude/skills/` (UI, banners, design system). Use when task involves visual design or new marketing assets — not required for routine code changes.
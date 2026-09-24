# AIBN Chartered Accountants — website, client portal and admin

Marketing site, client portal and staff admin for **AIBN Chartered Accountants
Ltd**, a partner-led practice serving the **UK and Ireland**.

Production: <https://ca-farm.vercel.app>

Coding conventions, auth rules and architecture decisions live in
[`AGENTS.md`](AGENTS.md). The git workflow lives in [`CLAUDE.md`](CLAUDE.md).

## What's in it

| Area | Routes | What it does |
| --- | --- | --- |
| Marketing | `/`, `/about`, `/contact` | Landing page, firm story, 3-step contact wizard (saved to Postgres, emailed via EmailJS) |
| Services | `/services`, `/services/[category]`, `/services/[category]/[slug]` | 8 categories generated from `app/lib/content.ts` (see below) |
| Tax calculators | `/tools/ireland-*`, `/tools/ireland` | Irish income tax, VAT, corporation tax, R&D credit, capital allowances, CGT, CAT and mortgage |
| Founders Hub | `/toolkits`, `/toolkits/request/[slug]` | Catalogue of memos, templates and guides; visitors request a copy, staff email it by hand |
| Auth | `/login`, `/signup`, `/auth/confirm`, `/auth/callback` | Supabase Auth: email + password (verified email required) and Google OAuth |
| Client portal | `/portal`, `/portal/settings` | Client's enquiries and message threads with the firm, account settings |
| Admin | `/admin/**` | Dashboard, enquiries inbox with replies, Founders Hub requests, and rate editors for every editable calculator |

### Service categories

1. **Accounting and Bookkeeping** — taxation, VAT returns, annual accounts, bookkeeping, payroll, audit
2. **Business Consulting** — company setup, financial consulting, international expansion, business planning
3. **Digital Transformation** — financial transformation, ERP migration, AI automation, AI integration
4. **Personal Finance** — doctors, IT professionals, independent contractors, entrepreneurs
5. **AI** — for finance, business model and automation, taxation
6. **Fractional CFO** — cash flow, board reporting, fundraising, valuations and exit
7. **Outsourcing** — bookkeeping, payroll and payments, management accounts, credit control
8. **Crypto and Digital Assets** — crypto CGT, staking/mining/DeFi income, CARF and DAC8 reporting, portfolio reconstruction

Adding or editing a service means editing `app/lib/content.ts`; the pages,
header menu and sitemap all read from it.

### Editable calculator rates

All eight calculators read their rates from the database (`calculator_settings`,
`tax_rates`, `cgt_*` and `mortgage_*`) and fall back to code defaults if the
row is missing or invalid. After a Budget an admin updates rates under
`/admin/*-rates` with a preview-and-confirm step. Every change goes into
`rate_audit`, so no redeploy is needed. The dashboard reminds admins when a
calculator's rates haven't been reviewed recently.

### Hidden for now

Pricing (`/pricing`, links, fee copy) has been hidden since 2026-08-20 until the
fee model is decided. The table in `CLAUDE.md` lists every hidden item and how
to bring it back.

## Stack

- Next.js 16 (App Router, `proxy.ts` as middleware), React 19, TypeScript
- Tailwind CSS v4, Motion (`motion/react`)
- Supabase: Postgres (queried directly with `pg`) and Supabase Auth (`@supabase/ssr`)
- EmailJS REST API for contact-form notifications
- Hosted on Vercel; GitHub Actions CI runs lint, typecheck and unit tests on every push

## Getting started

Requires Node 22+. Create `.env.local` with the keys below first.

```bash
npm install
npm run dev    # http://localhost:3000
```

`.env.local` needs these keys (the same keys are set in the Vercel project).
Never commit them:

| Key | Used for |
| --- | --- |
| `DATABASE_URL` | Postgres connection (server only) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin client. Never prefix with `NEXT_PUBLIC` |
| `EmailJs_Gmail_serviceid_KEY`, `EmailJs_Template_KEY`, `EmailJs_PUBLIC_KEY`, `EmailJs_Private_KEY` | Contact-form email |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests in `app/lib/*.test.ts` (Node's built-in test runner) |
| `node scripts/db-check.mjs` | Check the database connection |
| `node scripts/db-migrate.mjs [file]` | Apply `db/schema.sql`, or one file from `db/migrations/` |

Before pushing, `npm run typecheck`, `npm run lint`, `npm test` and `npm run build`
must all pass.

## Project layout

```
app/
  page.tsx, about/, contact/, services/, tools/, toolkits/   public pages
  login/, signup/, auth/                                     authentication
  portal/                                                    client area
  admin/                                                     staff area (dashboard, enquiries, rate editors)
  _pricing/                                                  hidden route
  components/                                                UI, sections, calculators, motion primitives
  lib/                                                       content, tax maths (ireland-*.ts), data access, validation, tests
  lib/supabase/                                              auth clients and route guards
db/schema.sql, db/migrations/                                database schema
scripts/                                                     database helper scripts
proxy.ts                                                     session refresh and /portal, /admin gating
next.config.ts                                               security headers (CSP, HSTS, etc.)
```

## Security notes

- Roles (`client` / `admin`) are set only by the `handle_new_user` database
  trigger. Users cannot promote themselves.
- Server data tables have RLS enabled **with no policies** on purpose. The app
  reaches them through the `pg` owner connection. Don't add a permissive policy
  to silence the Supabase advisor.
- Contact and signup are rate-limited through the database, and only hashed
  identifiers are stored.
- Full details are in `AGENTS.md` → *Auth & data*.

## Parked work and pending setup

Things that are built but not finished, so they are not lost.

### 1. Founders Hub "Request a copy" — how it works

Requesting a resource is a **manual fulfilment** flow. Nothing is emailed
automatically, and there is no email provider wired into the app.

1. A visitor clicks "Request a copy" on `/toolkits` and lands on
   `/toolkits/request/[slug]`.
2. They submit name, phone, organisation email and what they need it for. The
   request is stored in `toolkit_requests` and they see a confirmation dialog.
3. A team member opens `/admin/toolkits`, reads the request, emails the file
   from their own mailbox, and clicks **Mark sent**.

Outstanding requests sort to the top and the heading shows a "to send" count.
Mark sent shows a spinner and then a confirmation, so the click is never
silent. Abuse is bounded by a five-per-hour limit per email address.

**There is no upload path, deliberately.** The site never hosts a Founders Hub
file: no upload form, no storage bucket, no public download link. The catalogue
on `/toolkits` is `app/lib/toolkit-content.ts` and every copy goes out by hand.
Two earlier versions were removed — automated email (Resend, signed links) and
admin file upload (Supabase Storage) — so do not add either back without
agreeing it first. `toolkit_resources` stays in the database only for its
existing rows; nothing reads or writes it.

### 2. Founders Hub documents — 4 of 27 drafted, not in the repo

Four Irish tax memos were drafted from Revenue, gov.ie, DSP and CRO sources and
fact-checked figure by figure (three critical errors were found and corrected).
The generated PDFs are **not kept in this repo** — they live wherever the team
keeps them and get attached to an email by hand.

Still to produce: 11 templates, 4 tax forms, 3 VAT forms and 5 setup guides.
Every card on `/toolkits` comes from `app/lib/toolkit-content.ts`; adding a
resource means adding an entry there.

Any of these documents needs partner review before it goes to a client: they
carry the firm's name and were not written by a person.

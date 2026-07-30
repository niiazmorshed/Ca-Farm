This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Parked work and pending setup

Things that are built but not finished, so they are not lost.

### 1. Founders Hub "email me a copy" — needs an API key (PARKED)

The flow is fully built and deployed, but **it cannot send until a Resend API key
is configured**. Until then the form tells the visitor it cannot send, rather
than failing silently.

What is already in place:

- `app/lib/email.ts` — Resend transport (REST, no SDK dependency) + email shell
- `app/toolkits/actions.ts` — validates the address, rate limits, signs a 7 day
  download link, sends, then logs the request
- `app/components/resource-request-form.tsx` — the inline email capture on each
  resource card
- `toolkit_requests` table + the request log at the bottom of `/admin/toolkits`

To switch it on:

1. Create an account at resend.com and verify the sending domain (cafarm.co).
2. Add to Vercel (Production + Preview) and to `.env.local`:
   - `RESEND_API_KEY` (required)
   - `EMAIL_FROM` (optional, must be on the verified domain)
   - `EMAIL_REPLY_TO` (optional)
3. Confirm `SUPABASE_SERVICE_ROLE_KEY` is also set: the signed download links
   need it, and so do the admin file uploads.
4. Redeploy. Environment variables only apply to new builds.
5. Test end to end: request a copy of an uploaded resource and check the log row
   in `/admin/toolkits` says `sent`.

### 2. Founders Hub documents — 4 of 27 drafted, not in the repo

Four Irish tax memos were drafted from Revenue, gov.ie, DSP and CRO sources and
fact-checked figure by figure (three critical errors were found and corrected).
The generated PDFs are **not kept in this repo**: upload them through
`/admin/toolkits` and Supabase Storage holds them.

Still to produce: 11 templates, 4 tax forms, 3 VAT forms and 5 setup guides.
Their cards show as "in preparation" on `/toolkits`, driven by
`app/lib/toolkit-content.ts`. When a real file is uploaded for one of them,
delete its entry from that file so the card is not listed twice.

Any of these documents needs partner review before it goes to a client: they
carry the firm's name and were not written by a person.

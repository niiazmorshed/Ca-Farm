import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { BackToTop } from "./components/back-to-top";
import { ChromeGate } from "./components/chrome-gate";
import { getSessionUser } from "./lib/supabase/guards";
import { site } from "./lib/content";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "CA Farm — Chartered Accountants & Business Advisors",
    template: "%s — CA Farm",
  },
  description:
    "CA Farm is a partner-led chartered accountancy practice. Audit, tax, bookkeeping, payroll and advisory for founders, family firms and growing teams.",
  openGraph: {
    siteName: "CA Farm",
    type: "website",
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e2a33",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas font-sans text-ink-body">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <ChromeGate>
          <SiteHeader user={user} />
        </ChromeGate>
        <main id="main" className="flex-1">
          {children}
        </main>
        <ChromeGate>
          <SiteFooter />
          <BackToTop />
        </ChromeGate>
      </body>
    </html>
  );
}

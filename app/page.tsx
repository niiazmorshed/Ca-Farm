import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import {
  Hero,
  LogoStrip,
  Services,
  Process,
  Stats,
  Testimonials,
  WhyUs,
  Faq,
  ContactCta,
} from "./components/sections";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest-950 focus:px-5 focus:py-3 focus:text-sm focus:text-parchment"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <LogoStrip />
        <Services />
        <Process />
        <Stats />
        <Testimonials />
        <WhyUs />
        <Faq />
        <ContactCta />
      </main>
      <SiteFooter />
    </>
  );
}

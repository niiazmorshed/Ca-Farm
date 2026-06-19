import {
  Hero,
  QuickEntry,
  LogoStrip,
  Services,
  HarvestBand,
  Industries,
  Process,
  Stats,
  Testimonials,
  Faq,
  ContactCta,
} from "./components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickEntry />
      <LogoStrip />
      <Services />
      <HarvestBand />
      <Industries />
      <Process />
      <Stats />
      <Testimonials />
      <Faq />
      <ContactCta />
    </>
  );
}

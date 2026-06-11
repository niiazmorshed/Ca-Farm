import {
  Hero,
  LogoStrip,
  Services,
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
      <LogoStrip />
      <Services />
      <Industries />
      <Process />
      <Stats />
      <Testimonials />
      <Faq />
      <ContactCta />
    </>
  );
}

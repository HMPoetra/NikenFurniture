import { getAllContent } from "@/lib/content";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

export default async function HomePage() {
  const data = await getAllContent();

  return (
    <>
      <Hero data={data.companyInfo} />
      <About data={data.companyInfo} />
      <Services services={data.services} />
      <Portfolio items={data.portfolioItems} />
      <Experience
        company={data.companyInfo}
        experiences={data.experiences}
        testimonials={data.testimonials}
      />
      <Contact data={data.companyInfo} services={data.services} />
    </>
  );
}

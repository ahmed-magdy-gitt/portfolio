import Hero from "@/components/Hero";
import SkillsMatrix from "@/components/SkillsMatrix";
import ProjectsGrid from "@/components/ProjectsGrid";
import Experience from "@/components/Experience";
import FreelanceServices from "@/components/FreelanceServices";
import Contact from "@/components/Contact";
import SectionReveal from "@/components/SectionReveal";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      {/* Hero animates in on mount (it's above the fold), so it's the one
          section that skips the scroll-triggered SectionReveal wrapper. */}
      <Hero />

      <SectionDivider />
      <SectionReveal>
        <SkillsMatrix />
      </SectionReveal>

      <SectionDivider />
      <SectionReveal>
        <ProjectsGrid />
      </SectionReveal>

      <SectionDivider />
      <SectionReveal>
        <Experience />
      </SectionReveal>

      <SectionDivider />
      <SectionReveal>
        <FreelanceServices />
      </SectionReveal>

      <SectionDivider />
      <SectionReveal>
        <Contact />
      </SectionReveal>
    </>
  );
}

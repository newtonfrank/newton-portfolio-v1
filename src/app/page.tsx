"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

const About = dynamic(
  () => import("@/components/sections/About").then((m) => ({ default: m.About })),
  { ssr: false }
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/TechnicalProjects").then((m) => ({ default: m.TechnicalProjects })),
  { ssr: false }
);

const DesignWork = dynamic(
  () => import("@/components/sections/DesignWork").then((m) => ({ default: m.DesignWork })),
  { ssr: false }
);

const StackMarquee = dynamic(
  () => import("@/components/sections/Skills").then((m) => ({ default: m.Skills })),
  { ssr: false }
);

const Contact = dynamic(
  () => import("@/components/sections/Contact").then((m) => ({ default: m.Contact })),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/sections/Footer").then((m) => ({ default: m.Footer })),
  { ssr: false }
);

const SmoothScroll = dynamic(
  () => import("@/components/ui/smooth-scroll").then((m) => ({ default: m.SmoothScroll })),
  { ssr: false }
);

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <div className="spectrum-divider mx-auto w-full max-w-6xl" />
        <About />
        <div className="spectrum-divider mx-auto w-full max-w-6xl" />
        <ProjectsSection />
        <div className="spectrum-divider mx-auto w-full max-w-6xl" />
        <DesignWork />
        <div className="spectrum-divider mx-auto w-full max-w-6xl" />
        <StackMarquee />
        <Contact />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

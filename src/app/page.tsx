"use client";

import dynamic from "next/dynamic";
import { Preloader } from "@/components/ui/Preloader";

// Eagerly load the hero since it's above the fold
import { Hero } from "@/components/sections/Hero";

// Lazy load remaining sections
const About = dynamic(
  () => import("@/components/sections/About").then((m) => ({ default: m.About })),
  { ssr: false }
);

const Work = dynamic(
  () => import("@/components/sections/Work").then((m) => ({ default: m.Work })),
  { ssr: false }
);

const Skills = dynamic(
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

const Navigation = dynamic(
  () => import("@/components/ui/Navigation").then((m) => ({ default: m.Navigation })),
  { ssr: false }
);

const SpectrumSlider = dynamic(
  () => import("@/components/ui/SpectrumSlider").then((m) => ({ default: m.SpectrumSlider })),
  { ssr: false }
);

const CustomCursor = dynamic(
  () => import("@/components/ui/custom-cursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false }
);

const SmoothScroll = dynamic(
  () => import("@/components/ui/smooth-scroll").then((m) => ({ default: m.SmoothScroll })),
  { ssr: false }
);

const KonamiTerminal = dynamic(
  () => import("@/components/ui/KonamiTerminal").then((m) => ({ default: m.KonamiTerminal })),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Preloader />
      <Navigation />
      <CustomCursor />
      <SmoothScroll>
        <main style={{ background: "var(--color-bg)", transition: "background-color 0.4s ease" }}>
          <Hero />
          <div className="spectrum-divider mx-auto w-full max-w-5xl" />
          <About />
          <div className="spectrum-divider mx-auto w-full max-w-5xl" />
          <Work />
          <div className="spectrum-divider mx-auto w-full max-w-5xl" />
          <Skills />
          <div className="spectrum-divider mx-auto w-full max-w-5xl" />
          <Contact />
          <Footer />
        </main>
      </SmoothScroll>
      <SpectrumSlider />
      <KonamiTerminal />
    </>
  );
}

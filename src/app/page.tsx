"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

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

const CustomCursor = dynamic(
  () => import("@/components/ui/custom-cursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false }
);

const SmoothScroll = dynamic(
  () => import("@/components/ui/smooth-scroll").then((m) => ({ default: m.SmoothScroll })),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <main className="bg-deep-space text-white transition-colors duration-500">
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
    </>
  );
}

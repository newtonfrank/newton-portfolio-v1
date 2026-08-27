import type { Metadata } from "next";
import "@/styles/reset.css";
import "@/styles/typography.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/hero/Hero";
import { Intro } from "@/components/sections/intro/Intro";
import { ProjectList } from "@/components/sections/work/ProjectList";
import { WorkGrid } from "@/components/sections/work/WorkGrid";
import { Contact } from "@/components/sections/contact/Contact";
import { projects } from "@/content/projects";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

/**
 * Scratch route for the Dennis-style editorial rebuild. The page runs on the
 * light token surface (`data-theme="light"`); the Contact section flips itself
 * back to ink locally. The final M2 task moves this composition into
 * app/page.tsx and deletes this route.
 */
export default function PreviewPage() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <div className={styles.page} data-theme="light">
        <SkipLink />
        <Header />
        <main id="main">
          <Hero />
          <Intro />
          <ProjectList projects={projects} />
          <WorkGrid />
          <Contact />
        </main>
      </div>
    </SmoothScroll>
  );
}

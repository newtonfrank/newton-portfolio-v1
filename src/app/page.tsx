import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/hero/Hero";
import { Intro } from "@/components/sections/intro/Intro";
import { ProjectList } from "@/components/sections/work/ProjectList";
import { DesignGallery } from "@/components/sections/design/DesignGallery";
import { Capabilities } from "@/components/sections/capabilities/Capabilities";
import { Experience } from "@/components/sections/experience/Experience";
import { Contact } from "@/components/sections/contact/Contact";
import { projects } from "@/content/projects";
import styles from "./page.module.css";

/**
 * The editorial home. Runs on the light token surface (`data-theme="light"`);
 * the Contact section flips itself back to ink locally. This composition was
 * validated on the /preview route and promoted here as the production homepage.
 *
 * A server component: the sections are client islands that still SSR to static
 * HTML, so the hero's name marquee (the LCP element) is in the initial paint
 * rather than gated behind a client-only dynamic import.
 */
export default function Home() {
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
          <DesignGallery />
          <Capabilities />
          <Experience />
          <Contact />
        </main>
      </div>
    </SmoothScroll>
  );
}

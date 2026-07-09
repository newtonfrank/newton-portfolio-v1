import type { Metadata } from "next";
import "@/styles/reset.css";
import "@/styles/typography.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/hero/Hero";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

/**
 * Scratch route for building the new Home. Sections mount here in order as they
 * land; the final M2 task moves this composition into app/page.tsx and deletes
 * this route. Keeps `/` working while the rewrite is in flight.
 */
export default function PreviewPage() {
  return (
    <SmoothScroll>
      <div className={styles.page}>
        <SkipLink />
        <Header />
        <main id="main">
          <Hero />
        </main>
      </div>
    </SmoothScroll>
  );
}

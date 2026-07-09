import type { Metadata } from "next";
import "@/styles/reset.css";
import "@/styles/typography.css";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
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
    <div className={styles.page}>
      <SplitText as="h1" text="Design and engineering, one hand" className="displayL" />
      <Reveal>
        <p className="bodyL prose">Revealed on scroll.</p>
      </Reveal>
    </div>
  );
}

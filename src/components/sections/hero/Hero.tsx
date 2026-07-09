import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";
import styles from "./Hero.module.css";

/**
 * A server component wrapping one client island (SplitText). The old hero was
 * entirely client-rendered behind `ssr: false`, so its headline — the LCP
 * element — only painted after hydration.
 *
 * The Ember primary CTA is this viewport's single accent moment
 * (03-DESIGN-SYSTEM.md A.3). The availability dot uses --success, which is
 * semantic rather than an accent, so it doesn't compete.
 */
export function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <p className={cn(styles.eyebrow, "mono")}>{site.heroEyebrow}</p>

      <SplitText
        as="h1"
        text={`${site.headlineTop} ${site.headlineBottom}`}
        className={cn(styles.headline, "displayXl")}
      />

      <p className={cn(styles.tagline, "bodyL")}>{site.tagline}</p>

      <div className={styles.actions}>
        <Button href="#work" variant="primary" size="lg">
          Selected work
        </Button>
        <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
          Get in touch
        </Button>
        <span className={cn(styles.pill, "mono")}>
          <span className={styles.dot} aria-hidden="true" />
          {site.availability}
        </span>
      </div>

      <div className={cn(styles.meta, "mono")}>
        {site.heroTech.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    </section>
  );
}

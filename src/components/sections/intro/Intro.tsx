import { intro } from "@/content/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import styles from "./Intro.module.css";

/**
 * The post-hero statement: the value-prop lead with the magnetic CTA grouped
 * directly beneath it (hook + action as one unit), then the quieter supporting
 * line. Holds the `#about` anchor.
 */
export function Intro() {
  return (
    <section className={styles.intro}>
      <div className={styles.pitch}>
        <p className={styles.lead}>{intro.lead}</p>
        <MagneticButton href="#work" ariaLabel="See selected work" size={8.5}>
          See work
        </MagneticButton>
      </div>

      <p className={cn(styles.secondary, "body")}>{intro.secondary}</p>
    </section>
  );
}

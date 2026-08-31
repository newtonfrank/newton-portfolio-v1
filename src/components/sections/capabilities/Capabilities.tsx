import { disciplines } from "@/content/capabilities";
import { cn } from "@/lib/utils";
import styles from "./Capabilities.module.css";

/**
 * Build × Craft — the "strongest skills" section, structured as the brand's
 * duality. The Build column carries the Signal accent (the engineering axis),
 * Craft carries Ember (the design axis) — the one place the site finally puts
 * both accents to work rather than Ember alone.
 */
export function Capabilities() {
  return (
    <section id="capabilities" className={styles.section}>
      <header className={styles.head}>
        <p className={cn(styles.eyebrow, "mono")}>Capabilities</p>
        <h2 className={styles.heading}>Built with code, finished with craft.</h2>
        <p className={cn(styles.intro, "body")}>
          Two disciplines meeting in the same product — engineering that scales, and design that
          makes it usable.
        </p>
      </header>

      <div className={styles.cols}>
        {disciplines.map((disc) => (
          <div key={disc.key} className={cn(styles.disc, styles[disc.key])}>
            <div className={styles.discHead}>
              <span className={styles.discDot} aria-hidden="true" />
              <h3 className={styles.discTitle}>{disc.title}</h3>
            </div>
            <p className={styles.discBlurb}>{disc.blurb}</p>

            <dl className={styles.groups}>
              {disc.groups.map((group) => (
                <div key={group.label} className={styles.group}>
                  <dt className={cn(styles.groupLabel, "mono")}>{group.label}</dt>
                  <dd className={styles.groupItems}>
                    {group.items.map((item) => (
                      <span key={item} className={styles.chip}>
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

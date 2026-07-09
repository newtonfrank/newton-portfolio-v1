import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "--ink", value: "#0B0B0E" },
  { name: "--ink-elevated", value: "#131318" },
  { name: "--ink-raised", value: "#1C1C22" },
  { name: "--ink-hover", value: "#232329" },
  { name: "--bone", value: "#ECECE6" },
  { name: "--bone-muted", value: "#9A9AA2" },
  { name: "--bone-subtle", value: "#62626B" },
  { name: "--signal", value: "#5B8CFF" },
  { name: "--signal-dim", value: "#3A63C9" },
  { name: "--ember", value: "#FF6B4A" },
  { name: "--ember-dim", value: "#D94E32" },
  { name: "--success", value: "#4ADE80" },
  { name: "--warning", value: "#FBBF24" },
  { name: "--error", value: "#F87171" },
];

const typeScale = [
  { token: "--fs-display-xl", sample: "Nexus" },
  { token: "--fs-display-l", sample: "Craft & Build" },
  { token: "--fs-h1", sample: "Selected Work" },
  { token: "--fs-h2", sample: "Selected Work" },
  { token: "--fs-h3", sample: "Selected Work" },
  { token: "--fs-body-l", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "--fs-body", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "--fs-small", sample: "The quick brown fox jumps over the lazy dog." },
];

const spaces = Array.from({ length: 11 }, (_, i) => `--space-${i + 1}`);

/**
 * Living reference for every token and primitive. Not linked from the site and
 * marked noindex — it exists so token drift is visible, not for visitors.
 */
export default function StyleguidePage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>00 / Foundations</p>
        <h1 className={styles.title}>Styleguide</h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Color</h2>
          <div className={styles.swatches}>
            {colors.map((color) => (
              <div key={color.name} className={styles.swatch}>
                <div
                  className={styles.swatchChip}
                  style={{ backgroundColor: `var(${color.name})` }}
                />
                <div className={styles.swatchMeta}>
                  <div className={styles.swatchName}>{color.name}</div>
                  <div className={styles.swatchValue}>{color.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Type scale</h2>
          {typeScale.map((row) => (
            <div key={row.token} className={styles.typeRow}>
              <span className={styles.typeLabel}>{row.token.replace("--fs-", "")}</span>
              <span className={styles.typeSample} style={{ fontSize: `var(${row.token})` }}>
                {row.sample}
              </span>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Spacing</h2>
          {spaces.map((token) => (
            <div key={token} className={styles.spaceRow}>
              <span className={styles.spaceLabel}>{token.replace("--", "")}</span>
              <div className={styles.spaceBar} style={{ width: `var(${token})` }} />
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Button</h2>

          <div className={styles.row}>
            <Button variant="primary" size="sm">
              Primary sm
            </Button>
            <Button variant="primary" size="md">
              Primary md
            </Button>
            <Button variant="primary" size="lg">
              Primary lg
            </Button>
          </div>

          <div className={styles.row}>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="icon" aria-label="Open link">
              <ArrowUpRight size={18} />
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>

          <div className={styles.row}>
            <Button href="https://example.com" variant="secondary">
              Renders an anchor
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

import Image from "next/image";
import { designProjects } from "@/content/design";
import { cn } from "@/lib/utils";
import styles from "./WorkGrid.module.css";

/**
 * The reference's "More work" moment — a looser masonry grid of secondary
 * pieces beneath the featured list. Pulls from the design gallery so it reads
 * as genuinely *more* work, not a re-run of the project list above.
 *
 * CSS `columns` masonry keeps native image proportions without a JS layout
 * pass; each tile is `next/image` with intrinsic width/height, so no CLS.
 */
export function WorkGrid() {
  return (
    <section id="design" className={styles.section}>
      <header className={styles.head}>
        <span className={cn(styles.pill, "mono")}>More work</span>
        <h2 className={styles.heading}>Selected design explorations</h2>
      </header>

      <div className={styles.grid}>
        {designProjects.map((piece) => (
          <figure key={piece.image} className={styles.tile}>
            <Image
              src={piece.image}
              alt={piece.title}
              width={piece.width}
              height={piece.height}
              sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 90vw"
              className={styles.image}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

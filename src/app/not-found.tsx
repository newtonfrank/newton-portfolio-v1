import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

/**
 * A server component on the ink surface. Deliberately not a card floating on
 * white — a dead URL should still look like this site, so it borrows the same
 * condensed display face the menu uses and the ember hover from the close.
 */
export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={cn(styles.eyebrow, "mono")}>Error 404</p>

      <p className={styles.code}>Lost</p>

      <p className={cn(styles.body, "body")}>
        This page doesn&apos;t exist — or it did, before the site was rebuilt. Everything worth
        seeing lives on one page now.
      </p>

      <div className={styles.actions}>
        <Link href="/" className={cn(styles.home, "mono")}>
          Back to the work
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
        <a href={`mailto:${site.email}`} className={cn(styles.email, "mono")}>
          Or just email me
        </a>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { primaryNav, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { MenuOverlay } from "./MenuOverlay";
import styles from "./Header.module.css";

/**
 * Sits transparent at the top of the page and scrolls away with the content —
 * no pinned bar and no scroll-reactive background. The right-hand circular
 * toggle opens the full-screen overlay menu — the reference's signature nav
 * gesture — and doubles as the only nav on mobile, where the inline links are
 * hidden.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  // Close on Escape while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={cn(styles.header, open && styles.overlayOpen)}>
        <a href="#hero" className={styles.wordmark}>
          <span className={styles.mark}>{site.name}</span>
          <span className={cn(styles.markMeta, "mono")}>
            <span className={styles.dot} aria-hidden="true" />
            Portfolio ’26
          </span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {primaryNav.map((link) => (
            <a key={link.label} href={link.href} className={cn(styles.navLink, "mono")}>
              <span className={styles.navInner}>
                <span>{link.label}</span>
                <span aria-hidden="true">{link.label}</span>
              </span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={cn(styles.toggle, open && styles.toggleOpen)}
          aria-expanded={open}
          aria-controls="menu-overlay"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          data-cursor="hover"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

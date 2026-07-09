"use client";

import { useEffect, useState } from "react";
import { primaryNav, site } from "@/content/site";
import { cn } from "@/lib/utils";
import styles from "./Header.module.css";

/**
 * Transparent over the hero, gaining a frosted --glass background once past it.
 *
 * The scroll listener is passive so it never blocks the compositor, and it
 * toggles a class rather than writing inline styles, keeping the transition
 * declarative in CSS.
 *
 * The overlay menu (03-DESIGN-SYSTEM.md D.4) is not built yet; nav links point
 * at the Home section ids.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <a href="#hero" className={styles.wordmark}>
        {site.name}
      </a>

      <nav className={styles.nav} aria-label="Primary">
        {primaryNav.map((link) => (
          <a key={link.label} href={link.href} className={cn(styles.navLink, "mono")}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

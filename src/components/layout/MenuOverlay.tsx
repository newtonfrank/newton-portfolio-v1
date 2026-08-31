"use client";

import { useEffect, useState } from "react";
import { primaryNav, socials, contact } from "@/content/site";
import { formatLocalTime } from "@/lib/localTime";
import { cn } from "@/lib/utils";
import styles from "./MenuOverlay.module.css";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen ink menu. Large condensed links stagger in from a mask when
 * opened (CSS transition-delay keyed on `.open`), and everything is pulled from
 * the tab order while closed so a hidden menu can never trap focus.
 */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatLocalTime(contact.timezone));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      id="menu-overlay"
      data-theme="dark"
      className={cn(styles.overlay, open && styles.open)}
      aria-hidden={!open}
    >
      <nav className={styles.nav} aria-label="Overlay">
        {primaryNav.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            className={styles.link}
            tabIndex={open ? 0 : -1}
            onClick={onClose}
            style={{ ["--i" as string]: i }}
          >
            <span className={cn(styles.index, "mono")}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.linkLabel}>{link.label}</span>
          </a>
        ))}
      </nav>

      <div className={styles.foot}>
        <a
          href={`mailto:${contact.email}`}
          className={styles.email}
          tabIndex={open ? 0 : -1}
          onClick={onClose}
        >
          {contact.email}
        </a>

        <div className={styles.footRow}>
          <div className={styles.socials}>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className={cn(styles.social, "mono")}
                tabIndex={open ? 0 : -1}
                {...(social.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {social.label}
              </a>
            ))}
          </div>
          <span className={cn(styles.clock, "mono")}>
            {time ?? "--:--"} · {contact.timeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

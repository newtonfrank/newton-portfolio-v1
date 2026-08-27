"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { contact, socials } from "@/content/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { formatLocalTime } from "@/lib/localTime";
import { cn } from "@/lib/utils";
import styles from "./Contact.module.css";

/**
 * The reference's dark "Let's work together" close. `data-theme="dark"` flips
 * the token surface to ink regardless of the page's light theme, so the section
 * inverts cleanly. Contact is link-based — a magnetic mail disc plus a plain
 * email link — deliberately replacing the legacy form that reported success
 * without sending anything.
 *
 * The footer clock ticks every 30s off the visitor's own machine, formatted
 * into Newton's timezone — no network, no server time.
 */
export function Contact() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatLocalTime(contact.timezone));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="contact" data-theme="dark" className={styles.section}>
      <div className={styles.top}>
        <div className={styles.headingWrap}>
          <span className={styles.avatar}>
            <Image
              src="/newton-portrait.webp"
              alt="Newton Frank"
              fill
              sizes="56px"
              className={styles.avatarImg}
            />
          </span>
          <h2 className={styles.heading}>
            {contact.heading.map((line) => (
              <span key={line} className={styles.headingLine}>
                {line}
              </span>
            ))}
          </h2>
        </div>

        <MagneticButton
          href={`mailto:${contact.email}`}
          variant="accent"
          size={9}
          ariaLabel={`Email ${contact.email}`}
        >
          Get in touch
        </MagneticButton>
      </div>

      <div className={styles.details}>
        <a href={`mailto:${contact.email}`} className={styles.email} data-cursor="hover">
          {contact.email}
        </a>
      </div>

      <footer className={styles.footer}>
        <nav className={styles.socials} aria-label="Social">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className={cn(styles.social, "mono")}
              data-cursor="hover"
              {...(social.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {social.label}
            </a>
          ))}
        </nav>

        <span className={cn(styles.clock, "mono")}>
          {time ?? "--:--"} · {contact.timeLabel}
        </span>
      </footer>
    </section>
  );
}

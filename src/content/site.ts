import type { NavLink, SiteConfig, SocialLink } from "@/types/content";

export const site: SiteConfig = {
  name: "Newton Frank",
  email: "newtonfrank@outlook.in",
  location: "Bengaluru, Karnataka, India",
  tagline:
    "Frontend developer focused on real-time dashboards, scalable UI systems, and polished user flows.",
  headlineTop: "Frontend Developer",
  headlineBottom: "& Product Designer",
  heroTech: ["React.js", "Next.js", "AWS", "Solidity"],
  heroEyebrow: "01 / Design × Engineering",
  availability: "Available for work",
};

/** Nav for the new Home. Anchors match the sections in the M2 rebuild. */
export const primaryNav: NavLink[] = [
  { href: "#work", label: "Work" },
  { href: "#design", label: "Design" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/**
 * Copy for the M2 editorial Home (Dennis-style rebuild). Kept as plain exports
 * rather than folded into the strict `SiteConfig` type so the shape can grow
 * without churning the type on every section.
 */
export const hero = {
  /** Ultra-condensed name that sweeps across the hero as a marquee. Split for two lines. */
  name: ["Newton", "Frank"],
  role: "Fullstack Developer & Product Designer",
  status: `Available —\n${site.location.split(",")[0]}, IN`,
} as const;

export const intro = {
  lead: "Helping teams ship real-time dashboards and scalable interfaces. Engineering-led, design-obsessed, always on the cutting edge.",
  secondary:
    "The overlap of clean code and considered design is where I work best — turning dense data and complex flows into interfaces people actually enjoy.",
} as const;

export const contact = {
  heading: ["Let's work", "together"],
  email: site.email,
  /** IANA zone + short label for the live footer clock. */
  timezone: "Asia/Kolkata",
  timeLabel: "Bengaluru, IN",
} as const;

export const socials: SocialLink[] = [
  { href: "https://github.com/newtonfrank", label: "GitHub" },
  { href: "https://linkedin.com/in/newtonfrank", label: "LinkedIn" },
  { href: "mailto:newtonfrank@outlook.in", label: "Email" },
];

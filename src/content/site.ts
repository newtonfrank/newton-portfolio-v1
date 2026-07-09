import type { NavLink, SiteConfig, SocialLink } from "@/types/content";

export const site: SiteConfig = {
  name: "Newton Frank",
  email: "newtonfrank@outlook.in",
  location: "Tumkur, Karnataka, India",
  tagline:
    "Frontend developer focused on real-time dashboards, scalable UI systems, and polished user flows.",
  headlineTop: "Frontend Developer",
  headlineBottom: "& Product Designer",
  heroTech: ["React.js", "Next.js", "AWS", "Solidity"],
};

export const navLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Technical" },
  { href: "#design", label: "Design" },
  { href: "#stack", label: "Skills" },
];

export const socials: SocialLink[] = [
  { href: "https://github.com/newtonfrank", label: "GitHub" },
  { href: "https://linkedin.com/in/newtonfrank", label: "LinkedIn" },
  { href: "mailto:newtonfrank@outlook.in", label: "Email" },
];

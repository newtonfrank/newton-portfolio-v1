export interface Project {
  title: string;
  description: string;
  /** Path under /public, e.g. "/unipix-screenshot.png" */
  image: string;
  tags: string[];
  /** Live URL, when the project is publicly deployed. */
  href?: string;
}

/** A raw file in /public/design. `file` is unencoded; encode at the usage site. */
export interface DesignPiece {
  file: string;
  width: number;
  height: number;
}

/** A DesignPiece with its derived display title and URL-safe src. */
export interface DesignProject {
  title: string;
  image: string;
  width: number;
  height: number;
}

export interface EducationEntry {
  school: string;
  degree: string;
  date: string;
  note: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  date: string;
  points: string[];
}

export interface SocialLink {
  href: string;
  label: string;
}

export interface NavLink {
  /** In-page anchor, e.g. "#about" */
  href: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  email: string;
  location: string;
  tagline: string;
  headlineTop: string;
  headlineBottom: string;
  heroTech: string[];
}

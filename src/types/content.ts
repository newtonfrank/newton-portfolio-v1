export interface Project {
  title: string;
  description: string;
  /** Path under /public, e.g. "/unipix-screenshot.png" */
  image: string;
  tags: string[];
  /** Live URL, when the project is publicly deployed. */
  href?: string;

  /**
   * 1–2 short lines for the condensed display headline. `title` is far too long
   * to set at --fs-display-xl in an ultra-condensed face.
   */
  displayTitle: string[];
  /** One-line subtitle beneath the headline. */
  tagline: string;
  /**
   * Short right-aligned discipline label for the editorial project list, e.g.
   * "Frontend · API". Mirrors the reference's "Design & Development" column.
   */
  category: string;
  /** Ambient scene colour while this project is the active slide. */
  ambient: string;
  /**
   * Web-sized texture for the WebGL plane. Swap for an .mp4 screen recording
   * when one exists — `ProjectPlane` accepts either.
   */
  texture: string;
}

/** A raw file in /public/design. `file` is unencoded; encode at the usage site. */
export interface DesignPiece {
  file: string;
  width: number;
  height: number;
  /** Real name of the piece. Becomes the alt text and the lightbox caption. */
  title: string;
  /** Broad discipline label, shown under the title in the lightbox. */
  kind: DesignKind;
}

export type DesignKind = "Poster" | "Brand" | "Product" | "Social" | "Apparel" | "Banner";

/** A DesignPiece with its URL-safe src and derived aspect ratio. */
export interface DesignProject {
  title: string;
  kind: DesignKind;
  image: string;
  width: number;
  height: number;
  /** width / height. The card's plane aspect, precomputed so the scene never waits on a texture to lay out. */
  aspect: number;
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
  /** Mono eyebrow above the hero headline. */
  heroEyebrow: string;
  /** Shown in the hero availability pill. */
  availability: string;
}

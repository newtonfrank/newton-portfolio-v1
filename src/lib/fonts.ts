import localFont from "next/font/local";
import { Anton, Bebas_Neue, Oswald, Saira_Condensed } from "next/font/google";

/**
 * Condensed display face for the carousel headlines.
 *
 * The reference (docs/ref/) uses Tungsten — a commercial Hoefler&Co face that
 * cannot legally be self-hosted without a webfont licence. Anton is the closest
 * free equivalent (SIL Open Font License): same ultra-condensed, high-contrast,
 * all-caps grotesque, one weight only.
 */
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

/**
 * Candidates for the condensed display face, rendered side by side on
 * /styleguide so the choice can be made by eye rather than by description.
 * `preload: false` — /styleguide is noindex and nothing else loads these.
 * Delete the losers once a face is chosen.
 */
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
  preload: false,
});

export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-oswald",
  display: "swap",
  preload: false,
});

export const saira = Saira_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-saira",
  display: "swap",
  preload: false,
});

/**
 * Self-hosted display + body faces, converted from the Fontshare OTFs to woff2
 * (44% smaller). Weights are limited to those the design system actually uses —
 * Display 400/500/600, Sans 400/500 — per 03-DESIGN-SYSTEM.md B.1.
 *
 * next/font hashes and serves these from /_next/static/media, injects
 * `size-adjust` fallback metrics to prevent layout shift, and preloads them.
 * The original OTFs stay in public/fonts as the source of truth but are
 * gitignored, so they never reach the deploy.
 */

export const clashDisplay = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-clash-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  // Only /styleguide uses these today; the legacy homepage still runs on
  // Inter/Poppins. Preloading here would add render-blocking font requests to
  // every page for nothing. Flip back to `true` in M2, once the legacy faces
  // are gone and the hero actually renders in Clash Display.
  preload: false,
});

export const generalSans = localFont({
  src: [
    { path: "../fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: false,
});

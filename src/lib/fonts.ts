import localFont from "next/font/local";

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

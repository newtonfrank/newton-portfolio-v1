import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

/**
 * Idempotent plugin registration. Safe to call from every client island —
 * calling gsap.registerPlugin twice is harmless but pointless, and guarding on
 * `window` keeps it a no-op if this module is ever pulled into a server bundle.
 */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  registered = true;
}

export { gsap, ScrollTrigger, useGSAP };

import { create } from "zustand";

interface SpectrumState {
  /** 0.0 = Full Dev, 0.5 = Nexus, 1.0 = Full Design */
  position: number;
  setPosition: (pos: number) => void;
  isDev: () => boolean;
  isDesign: () => boolean;
  isNexus: () => boolean;
  getMode: () => "dev" | "nexus" | "design";
}

let cssUpdateRaf = 0;

export const useSpectrum = create<SpectrumState>((set, get) => ({
  position: 0.5,
  setPosition: (pos: number) => {
    const clamped = Math.max(0, Math.min(1, pos));
    set({ position: clamped });

    if (cssUpdateRaf) cancelAnimationFrame(cssUpdateRaf);
    cssUpdateRaf = requestAnimationFrame(() => {
      updateCSSVariables(clamped);
      cssUpdateRaf = 0;
    });
  },
  isDev: () => get().position < 0.35,
  isDesign: () => get().position > 0.65,
  isNexus: () => get().position >= 0.35 && get().position <= 0.65,
  getMode: () => {
    const p = get().position;
    if (p < 0.35) return "dev";
    if (p > 0.65) return "design";
    return "nexus";
  },
}));

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(colorA: string, colorB: string, t: number): string {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  if (!a || !b) return colorA;

  const r = Math.round(lerp(a.r, b.r, t));
  const g = Math.round(lerp(a.g, b.g, t));
  const bl = Math.round(lerp(a.b, b.b, t));
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const DEV = {
  bg: "#ececec",
  bgSecondary: "#e1e1e1",
  text: "#111111",
  textSecondary: "#4f4f4f",
  accent: "#111111",
  accentAlt: "#3b3b3b",
  border: "#cfcfcf",
  cardBg: "#f8f8f8",
  surface: "#ebebeb",
  glow: "#111111",
};

const DESIGN = {
  bg: "#f7f7f7",
  bgSecondary: "#eeeeee",
  text: "#111111",
  textSecondary: "#616161",
  accent: "#111111",
  accentAlt: "#4d4d4d",
  border: "#d8d8d8",
  cardBg: "#ffffff",
  surface: "#f1f1f1",
  glow: "#111111",
};

const NEXUS = {
  bg: "#f3f3f3",
  bgSecondary: "#e8e8e8",
  text: "#111111",
  textSecondary: "#595959",
  cardBg: "#fbfbfb",
  surface: "#efefef",
  border: "#d4d4d4",
};

function updateCSSVariables(t: number): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  const lerpThreeStop = (devVal: string, nexusVal: string, designVal: string) => {
    if (t < 0.5) {
      return lerpColor(devVal, nexusVal, t * 2);
    }
    return lerpColor(nexusVal, designVal, (t - 0.5) * 2);
  };

  root.style.setProperty("--color-bg", lerpThreeStop(DEV.bg, NEXUS.bg, DESIGN.bg));
  root.style.setProperty(
    "--color-bg-secondary",
    lerpThreeStop(DEV.bgSecondary, NEXUS.bgSecondary, DESIGN.bgSecondary)
  );
  root.style.setProperty("--color-text", lerpThreeStop(DEV.text, NEXUS.text, DESIGN.text));
  root.style.setProperty(
    "--color-text-secondary",
    lerpThreeStop(DEV.textSecondary, NEXUS.textSecondary, DESIGN.textSecondary)
  );
  root.style.setProperty("--color-accent", lerpColor(DEV.accent, DESIGN.accent, t));
  root.style.setProperty("--color-accent-alt", lerpColor(DEV.accentAlt, DESIGN.accentAlt, t));
  root.style.setProperty("--color-border", lerpThreeStop(DEV.border, NEXUS.border, DESIGN.border));
  root.style.setProperty("--color-card-bg", lerpThreeStop(DEV.cardBg, NEXUS.cardBg, DESIGN.cardBg));
  root.style.setProperty("--color-surface", lerpThreeStop(DEV.surface, NEXUS.surface, DESIGN.surface));
  root.style.setProperty("--color-glow", lerpColor(DEV.glow, DESIGN.glow, t));

  root.style.setProperty("--font-weight-heading", `${Math.round(lerp(760, 600, t))}`);
  root.style.setProperty("--letter-spacing-heading", `${lerp(-0.04, -0.015, t)}em`);
  root.style.setProperty("--border-radius", `${lerp(16, 22, t)}px`);

  if (t < 0.35) {
    root.classList.add("spectrum-dev");
    root.classList.remove("spectrum-design", "spectrum-nexus");
  } else if (t > 0.65) {
    root.classList.add("spectrum-design");
    root.classList.remove("spectrum-dev", "spectrum-nexus");
  } else {
    root.classList.add("spectrum-nexus");
    root.classList.remove("spectrum-dev", "spectrum-design");
  }
}

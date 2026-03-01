import { create } from 'zustand';

interface SpectrumState {
  /** 0.0 = Full Dev, 0.5 = Nexus, 1.0 = Full Design */
  position: number;
  setPosition: (pos: number) => void;
  isDev: () => boolean;
  isDesign: () => boolean;
  isNexus: () => boolean;
  getMode: () => 'dev' | 'nexus' | 'design';
}

let cssUpdateRaf = 0;

export const useSpectrum = create<SpectrumState>((set, get) => ({
  position: 0.5, // Start at Nexus
  setPosition: (pos: number) => {
    const clamped = Math.max(0, Math.min(1, pos));
    set({ position: clamped });

    // Throttle CSS variable updates to once per animation frame
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
    if (p < 0.35) return 'dev';
    if (p > 0.65) return 'design';
    return 'nexus';
  },
}));

// Utility: lerp between two values
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Utility: lerp between two hex colors
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

// Dev palette
const DEV = {
  bg: '#050505',
  bgSecondary: '#0a0a0a',
  text: '#f0f0f0',
  textSecondary: '#a0a0a0',
  accent: '#00f3ff',     // Cyan
  accentAlt: '#bc13fe',  // Purple
  border: '#1a1a1a',
  cardBg: '#0d0d0d',
  surface: '#141414',
  glow: '#00f3ff',
};

// Design palette
const DESIGN = {
  bg: '#faf8f5',
  bgSecondary: '#f0ece6',
  text: '#1a1a1a',
  textSecondary: '#666666',
  accent: '#e85d04',     // Warm orange
  accentAlt: '#9b5de5',  // Soft purple
  border: '#e0dcd6',
  cardBg: '#ffffff',
  surface: '#f5f2ed',
  glow: '#e85d04',
};

// Nexus palette — used for the mid-range to prevent muddy interpolation
const NEXUS = {
  bg: '#080808',
  bgSecondary: '#0d0d0d',
  text: '#f0f0f0',
  textSecondary: '#a0a0a0',
  cardBg: '#111111',
  surface: '#151515',
  border: '#222222',
};

function updateCSSVariables(t: number): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Use 3-stop interpolation: DEV(0) → NEXUS(0.5) → DESIGN(1)
  // This keeps the mid-range readable instead of muddy gray
  const lerpThreeStop = (devVal: string, nexusVal: string, designVal: string) => {
    if (t < 0.5) {
      return lerpColor(devVal, nexusVal, t * 2);
    } else {
      return lerpColor(nexusVal, designVal, (t - 0.5) * 2);
    }
  };

  // Colors — 3-stop interpolation for bg, text, card to keep nexus zone readable
  root.style.setProperty('--color-bg', lerpThreeStop(DEV.bg, NEXUS.bg, DESIGN.bg));
  root.style.setProperty('--color-bg-secondary', lerpThreeStop(DEV.bgSecondary, NEXUS.bgSecondary, DESIGN.bgSecondary));
  root.style.setProperty('--color-text', lerpThreeStop(DEV.text, NEXUS.text, DESIGN.text));
  root.style.setProperty('--color-text-secondary', lerpThreeStop(DEV.textSecondary, NEXUS.textSecondary, DESIGN.textSecondary));
  root.style.setProperty('--color-accent', lerpColor(DEV.accent, DESIGN.accent, t));
  root.style.setProperty('--color-accent-alt', lerpColor(DEV.accentAlt, DESIGN.accentAlt, t));
  root.style.setProperty('--color-border', lerpThreeStop(DEV.border, NEXUS.border, DESIGN.border));
  root.style.setProperty('--color-card-bg', lerpThreeStop(DEV.cardBg, NEXUS.cardBg, DESIGN.cardBg));
  root.style.setProperty('--color-surface', lerpThreeStop(DEV.surface, NEXUS.surface, DESIGN.surface));
  root.style.setProperty('--color-glow', lerpColor(DEV.glow, DESIGN.glow, t));

  // Typography morphing
  root.style.setProperty('--font-weight-heading', `${Math.round(lerp(700, 300, t))}`);
  root.style.setProperty('--letter-spacing-heading', `${lerp(0.05, -0.02, t)}em`);
  root.style.setProperty('--border-radius', `${lerp(2, 16, t)}px`);

  // Font family blend (via class toggle)
  if (t < 0.35) {
    root.classList.add('spectrum-dev');
    root.classList.remove('spectrum-design', 'spectrum-nexus');
  } else if (t > 0.65) {
    root.classList.add('spectrum-design');
    root.classList.remove('spectrum-dev', 'spectrum-nexus');
  } else {
    root.classList.add('spectrum-nexus');
    root.classList.remove('spectrum-dev', 'spectrum-design');
  }
}

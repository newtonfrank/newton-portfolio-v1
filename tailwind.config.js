import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sacramento: ["var(--font-sacramento)", "cursive"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        "deep-space": "#050505",
        "neon-cyan": "#00f3ff",
        "neon-purple": "#bc13fe",
        "glass-border": "rgba(255, 255, 255, 0.08)",
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        "warp-speed": "warp 0.5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        warp: {
          "0%": { transform: "translateZ(0)" },
          "100%": { transform: "translateZ(100px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

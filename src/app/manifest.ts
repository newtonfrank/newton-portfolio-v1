import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Newton Frank — Fullstack Developer & Product Designer",
    short_name: "Newton Frank",
    description:
      "Portfolio of Newton Frank — fullstack developer and product designer building real-time dashboards, scalable UI systems, and polished product interfaces.",
    start_url: "/",
    display: "standalone",
    // Aligned with layout.viewport.themeColor (the hero field) and the light
    // editorial surface, so the PWA chrome no longer contradicts the site.
    background_color: "#f4f3ee",
    theme_color: "#d0d0d0",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}

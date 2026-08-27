import type { Project } from "@/types/content";

/**
 * `displayTitle` and `tagline` drive the WebGL carousel overlay; `title` and
 * `description` remain the canonical, full-length strings used everywhere else
 * (metadata, /work, case studies).
 *
 * `ambient` is the colour the scene lerps to while a project is active. Each is
 * pulled from the dominant hue of its own screenshot so the background feels
 * like it belongs to the slide rather than being applied to it.
 */
export const projects: Project[] = [
  {
    title: "Unipix - Unified Free Stock Image Search",
    displayTitle: ["Unipix", "Image Search"],
    tagline: "One search across Pexels, Unsplash, and Pixabay",
    category: "Frontend · API",
    description:
      "Aggregates free images from Pexels, Unsplash, and Pixabay in one search workflow with source redirection for downloads.",
    image: "/unipix-screenshot.png",
    texture: "/showcase/unipix-screenshot.jpg",
    ambient: "#0b2e3a",
    tags: ["React.js", "API Integration", "Scalable Architecture"],
    href: "https://unipix-newton.vercel.app",
  },
  {
    title: "Secure Healthcare Data Sharing with Blockchain",
    displayTitle: ["Healthcare", "On-Chain"],
    tagline: "Role-based records on Ethereum smart contracts",
    category: "Web3 · Solidity",
    description:
      "Built a decentralized healthcare sharing platform on Ethereum with role-based access and smart-contract permission controls.",
    image: "/helthcare-screenshot.png",
    texture: "/showcase/helthcare-screenshot.jpg",
    ambient: "#241537",
    tags: ["Ethereum", "Solidity", "Web3.js", "React"],
  },
  {
    title: "Industrial IoT Live Monitoring Dashboard",
    displayTitle: ["Industrial", "Telemetry"],
    tagline: "Real-time machine diagnostics at 10-second refresh",
    category: "Realtime · Dashboard",
    description:
      "Engineered a real-time IIoT dashboard for machine telemetry, trend overlays, analytics, and alert-focused diagnostics.",
    image: "/IIoT-Dashboard.png",
    texture: "/showcase/IIoT-Dashboard.jpg",
    ambient: "#0a1e3a",
    tags: ["React.js", "Tailwind CSS", "Realtime Data"],
  },
  {
    title: "Component-Based Client Web Platform",
    displayTitle: ["Design", "System"],
    tagline: "Reusable React primitives, 25% faster delivery",
    category: "Design System · React",
    description:
      "Implemented reusable React component systems during internship delivery, reducing future implementation time by 25%.",
    image: "/component-based-screenshot.png",
    texture: "/showcase/component-based-screenshot.jpg",
    ambient: "#12291b",
    tags: ["React.js", "Design System", "SEO", "Responsive UI"],
  },
];

import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    title: "Unipix - Unified Free Stock Image Search",
    description:
      "Aggregates free images from Pexels, Unsplash, and Pixabay in one search workflow with source redirection for downloads.",
    image: "/unipix-screenshot.png",
    tags: ["React.js", "API Integration", "Scalable Architecture"],
    href: "https://unipix-newton.vercel.app",
  },
  {
    title: "Secure Healthcare Data Sharing with Blockchain",
    description:
      "Built a decentralized healthcare sharing platform on Ethereum with role-based access and smart-contract permission controls.",
    image: "/helthcare-screenshot.png",
    tags: ["Ethereum", "Solidity", "Web3.js", "React"],
  },
  {
    title: "Industrial IoT Live Monitoring Dashboard",
    description:
      "Engineered a real-time IIoT dashboard for machine telemetry, trend overlays, analytics, and alert-focused diagnostics.",
    image: "/IIoT-Dashboard.png",
    tags: ["React.js", "Tailwind CSS", "Realtime Data"],
  },
  {
    title: "Component-Based Client Web Platform",
    description:
      "Implemented reusable React component systems during internship delivery, reducing future implementation time by 25%.",
    image: "/component-based-screenshot.png",
    tags: ["React.js", "Design System", "SEO", "Responsive UI"],
  },
];

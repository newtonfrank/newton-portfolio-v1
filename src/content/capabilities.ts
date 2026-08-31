/**
 * The "strongest skills" answer, structured as the brand's own duality:
 * Build (the Signal / engineering axis) and Craft (the Ember / design axis).
 * Replaces the old flat skills marquee — grouping communicates depth, not just
 * a scroll of logos. Kept honest to what the work actually demonstrates.
 */

export interface CapabilityGroup {
  label: string;
  items: string[];
}

export interface Discipline {
  /** Drives the accent: build → Signal, craft → Ember. */
  key: "build" | "craft";
  title: string;
  blurb: string;
  groups: CapabilityGroup[];
}

export const disciplines: Discipline[] = [
  {
    key: "build",
    title: "Build",
    blurb: "Engineering that ships and scales — from the data layer to the pixel.",
    groups: [
      { label: "Languages", items: ["JavaScript", "TypeScript", "Python", "C / C++"] },
      { label: "Frontend", items: ["React.js", "Next.js", "Responsive UI", "Design systems"] },
      {
        label: "Backend & infra",
        items: [
          "Node.js",
          "Express",
          "REST APIs",
          "MongoDB",
          "MySQL",
          "AWS (EC2, S3)",
          "Docker",
          "CI/CD",
        ],
      },
      { label: "Web3", items: ["Ethereum", "Solidity", "Web3.js"] },
      { label: "Testing", items: ["Selenium", "React Testing Library"] },
    ],
  },
  {
    key: "craft",
    title: "Craft",
    blurb: "Design that turns dense data and complex flows into something people enjoy using.",
    groups: [
      {
        label: "Product design",
        items: [
          "UI / UX design",
          "Real-time dashboards",
          "Data-dense interfaces",
          "Design systems",
        ],
      },
      { label: "Tools", items: ["Figma", "Adobe XD", "Photoshop", "Illustrator"] },
    ],
  },
];

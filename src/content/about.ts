import type { EducationEntry, ExperienceEntry } from "@/types/content";

export const education: EducationEntry[] = [
  {
    school: "Sri Siddhartha School of Engineering (SSSE), Tumakuru",
    degree: "B.E. in Computer Science",
    date: "2021 - 2025",
    note: "CGPA: 7.75 / 10",
  },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Frontend Developer Intern",
    company: "Smartchakra Private Limited",
    date: "Feb 2025 - Jun 2025 · Onsite",
    points: [
      "Built an Industrial IoT dashboard for real-time monitoring, historical analysis, and predictive maintenance.",
      "Implemented high-frequency sensor visualization (vibration, temperature, audio) with 10-second auto-refresh.",
      "Shipped analytics, fleet overview, and full CRUD modules for settings and alert management.",
      "Designed intuitive data-rich interfaces for faster diagnostics and maintenance workflows.",
    ],
  },
  {
    role: "Frontend Developer Intern",
    company: "Scyara Group Private Limited",
    date: "May 2023 - Jul 2023 · Remote",
    points: [
      "Developed responsive web applications using React.js and Tailwind CSS for client projects.",
      "Created a component-based design system that reduced future UI implementation time by 25%.",
      "Delivered mobile-first, cross-browser compatible interfaces across multiple websites.",
      "Improved SEO with semantic markup, optimized metadata, and XML sitemap integration.",
    ],
  },
];

export const achievements: string[] = [
  "Founded and led the Programming Club, increasing student hackathon participation by 50%.",
  "Mentored 10+ juniors in web development and placement readiness.",
  "Recognized for teamwork and adaptability during internships and collaborative projects.",
];

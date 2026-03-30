"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap } from "lucide-react";

const education = [
  {
    school: "Sri Siddhartha School of Engineering (SSSE), Tumakuru",
    degree: "B.E. in Computer Science",
    date: "2021 - 2025",
    note: "CGPA: 7.75 / 10",
  },
];

const experience = [
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

const achievements = [
  "Founded and led the Programming Club, increasing student hackathon participation by 50%.",
  "Mentored 10+ juniors in web development and placement readiness.",
  "Recognized for teamwork and adaptability during internships and collaborative projects.",
];

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-28">
      <div className="section-container">
        <motion.div
          className="mb-14 md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">About</p>
          <h2 className="section-heading mt-4">Frontend Developer Who Ships Useful Products Fast</h2>
          <p className="section-copy mt-5">
            I build reliable React interfaces, real-time dashboards, and scalable component systems with strong
            focus on performance, clarity, and real user outcomes.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.article
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[24px] border border-border bg-white p-7 shadow-[0_14px_36px_rgba(0,0,0,0.06)] md:p-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-black">
                <GraduationCap size={18} />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">Education</h3>
            </div>

            <div className="space-y-5">
              {education.map((item) => (
                <div key={item.school} className="rounded-xl border border-border bg-[#fafafa] p-4">
                  <p className="text-sm font-semibold text-black">{item.school}</p>
                  <p className="mt-1 text-sm text-text-secondary">{item.degree}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-text-secondary">
                    {item.date} · {item.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-border bg-[#fafafa] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Award size={16} className="text-black" />
                <p className="text-sm font-semibold text-black">Highlights</p>
              </div>
              <ul className="space-y-2">
                {achievements.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-text-secondary">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>

          <div className="space-y-6">
            {experience.map((item, index) => (
              <motion.article
                key={item.company}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="rounded-[24px] border border-border bg-white p-7 shadow-[0_14px_36px_rgba(0,0,0,0.06)] md:p-8"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-text-secondary">{item.date}</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-black">{item.role}</h3>
                    <p className="text-sm text-text-secondary">{item.company}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-black">
                    <Briefcase size={18} />
                  </span>
                </div>

                <ul className="space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/70" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

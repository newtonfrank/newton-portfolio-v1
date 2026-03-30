"use client";

import { motion } from "framer-motion";

const stack = [
  "JavaScript",
  "Python",
  "C",
  "C++",
  "React.js",
  "Next.js",
  "Node.js",
  "Express",
  "REST APIs",
  "MongoDB",
  "MySQL",
  "AWS (EC2, S3)",
  "Docker",
  "CI/CD",
  "Ethereum",
  "Solidity",
  "Web3.js",
  "Selenium",
  "React Testing Library",
  "Figma",
  "Photoshop",
  "Illustrator",
  "Adobe XD",
];

const marqueeItems = [...stack, ...stack, ...stack];

export function Skills() {
  return (
    <section id="stack" className="py-24 md:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
          className="mb-10"
        >
          <h2 className="section-heading">Core Stack & Toolkit</h2>
          <p className="section-copy">Languages, frameworks, cloud, blockchain, and design tools I use in production work.</p>
        </motion.div>

        <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-white py-6 shadow-[0_16px_38px_rgba(17,24,39,0.08)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

          <motion.div
            className="flex w-max items-center gap-4"
            animate={{ x: ["0%", "-33.333%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {marqueeItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="mx-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700"
              >
                <span className="mr-2 h-2 w-2 rounded-full bg-[#2563EB]" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

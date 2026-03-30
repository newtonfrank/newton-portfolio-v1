"use client";

import { motion } from "framer-motion";

const designFiles = [
  "WhatsApp Image 2026-03-12 at 15.12.51.jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (1).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (2).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (3).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (4).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (5).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (6).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (7).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (8).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (9).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.51 (10).jpeg",
  "WhatsApp Image 2026-03-12 at 15.12.52.jpeg",
  "WhatsApp Image 2026-03-12 at 15.13.28.jpeg",
  "WhatsApp Image 2026-03-12 at 15.15.02.jpeg",
];

const designProjects = designFiles.map((file, index) => ({
  title: `Design Exploration ${String(index + 1).padStart(2, "0")}`,
  image: encodeURI(`/design/${file}`),
}));

export function DesignWork() {
  return (
    <section id="design" className="relative py-24 md:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Design Portfolio</p>
          <h2 className="section-heading mt-4">Selected Visual Design Work</h2>
          <p className="section-copy mt-5">
            A curated gallery from your design portfolio assets in the public folder.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {designProjects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.04 }}
              className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <h3 className="text-sm font-semibold text-slate-900">{project.title}</h3>
                <span className="text-xs uppercase tracking-[0.12em] text-slate-500">Design</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

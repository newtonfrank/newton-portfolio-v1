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

const bentoPattern = [
  "md:col-span-6 md:row-span-2",
  "md:col-span-3 md:row-span-1",
  "md:col-span-3 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-4 md:row-span-2",
  "md:col-span-4 md:row-span-1",
];

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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[180px]">
          {designProjects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.04 }}
              className={`group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.08)] ${
                bentoPattern[index % bentoPattern.length]
              }`}
            >
              <div className="relative h-[240px] overflow-hidden bg-slate-100 md:h-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 backdrop-blur">
                  Design
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <h3 className="text-sm font-semibold text-slate-900">{project.title}</h3>
                <span className="text-xs uppercase tracking-[0.12em] text-slate-500">Visual</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

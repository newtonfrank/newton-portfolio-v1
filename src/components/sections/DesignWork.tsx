"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { designProjects } from "@/content/design";
import type { DesignProject } from "@/types/content";

function getBentoConfig(width: number, height: number) {
  const ratio = width / height;

  if (ratio >= 4.0) {
    return {
      cardClass: "col-span-2 md:col-span-4 lg:col-span-6",
      tag: "Banner",
    };
  }

  if (ratio >= 1.2) {
    return {
      cardClass: "col-span-2 md:col-span-2 lg:col-span-3",
      tag: "Campaign",
    };
  }

  if (ratio <= 0.85) {
    return {
      cardClass: "col-span-1 md:col-span-2 lg:col-span-2",
      tag: "Poster",
    };
  }

  return {
    cardClass: "col-span-1 md:col-span-2 lg:col-span-2",
    tag: "Visual",
  };
}

export function DesignWork() {
  const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
            A curated bento gallery from your design portfolio assets in the public folder. Click any image for a full preview.
          </p>
        </motion.div>

        <div className="grid grid-flow-row-dense grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-6">
          {designProjects.map((project, index) => {
            const config = getBentoConfig(project.width, project.height);

            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.035 }}
                className={`${config.cardClass} cursor-zoom-in`}
                onClick={() => setSelectedProject(project)}
              >
                <div
                  className="group relative h-full w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.09)]"
                  style={{ aspectRatio: `${project.width} / ${project.height}` }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    width={project.width}
                    height={project.height}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/0 opacity-90" />
                  <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-white/95">{project.title}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/35 bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
                      {config.tag}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:p-8 lg:p-12"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="relative flex flex-col items-center justify-center rounded-2xl bg-white/5 p-1 shadow-2xl"
              style={{
                maxWidth: "min(95vw, " + selectedProject.width + "px)",
                maxHeight: "min(90vh, " + selectedProject.height + "px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-3 top-3 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-md transition hover:bg-black/25"
                >
                  <X size={18} />
                </button>

                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="h-auto w-auto max-h-[85vh] max-w-full object-contain"
                  style={{
                    aspectRatio: `${selectedProject.width} / ${selectedProject.height}`,
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-medium tracking-wider text-white/90 uppercase">{selectedProject.title}</p>
                    <p className="text-[10px] text-white/60 font-mono">
                      {selectedProject.width} × {selectedProject.height}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


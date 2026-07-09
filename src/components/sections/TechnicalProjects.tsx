"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";

export function TechnicalProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travelDistance, setTravelDistance] = useState(0);
  const [sectionHeight, setSectionHeight] = useState("240vh");

  useEffect(() => {
    const updateLayout = () => {
      if (!trackRef.current) return;

      const viewportWidth = window.innerWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const nextDistance = Math.max(0, trackWidth - viewportWidth + 80);

      setTravelDistance(nextDistance);
      setSectionHeight(`${window.innerHeight + nextDistance + 220}px`);
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    window.addEventListener("resize", updateLayout);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -travelDistance]);
  const x = useSpring(rawX, { stiffness: 120, damping: 26, mass: 0.3 });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 24, mass: 0.2 });

  return (
    <section id="projects" ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#f8fafc]">
        <div className="section-container pt-20 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Technical Projects</p>
            <h2 className="section-heading">Scroll Through My Engineering Work</h2>
            <p className="section-copy">
              Vertical scroll drives this horizontal project track. After the final card, page flow continues to the next section.
            </p>
          </motion.div>

          <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div className="h-full origin-left rounded-full bg-[#2563eb]" style={{ scaleX: progress }} />
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex h-[calc(100vh-230px)] items-stretch gap-6 px-6 pb-16 pt-5 md:px-10 lg:px-14"
        >
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group relative flex min-w-[86vw] max-w-[86vw] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_34px_rgba(15,23,42,0.09)] md:min-w-[58vw] md:max-w-[58vw] lg:min-w-[42vw] lg:max-w-[42vw]"
            >
              <div className="relative h-[56%] w-full overflow-hidden border-b border-slate-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-7">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold leading-tight tracking-tight text-slate-900 md:text-2xl">{project.title}</h3>
                  {project.href ? (
                    <a
                      href={project.href}
                      target={project.href.startsWith("http") ? "_blank" : undefined}
                      rel={project.href.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                      aria-label={`Open ${project.title}`}
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <span
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400"
                      title="Private project link not published"
                    >
                      <ArrowUpRight size={16} />
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-slate-600">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

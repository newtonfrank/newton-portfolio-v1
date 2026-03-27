"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronsRight } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-deep-space">
      {/* minimal ambient texture */}
      <div aria-hidden className="absolute inset-0 z-0">
        <div className="garage-stripes opacity-[0.14]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.65))]" />
      </div>

      <div className="section-container relative z-10 min-h-screen pt-8 pb-14 md:pt-10 md:pb-16 flex flex-col">
        {/* top micro-nav */}
        <motion.div
          className="flex items-center justify-between text-[10px] md:text-xs uppercase tracking-[0.24em] text-white/70 font-mono"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            Newton Frank
          </span>
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
        </motion.div>

        <div className="relative flex-1 flex items-center justify-center">
          {/* oversized ghost letters */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[48%] -translate-y-1/2 flex items-center justify-between text-[17vw] md:text-[13vw] leading-none font-black tracking-[-0.06em] text-transparent"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.16)" }}
          >
            <span className="-translate-x-[15%]">N</span>
            <span className="translate-x-[15%]">F</span>
          </div>

          {/* tilted image block */}
          <motion.div
            className="relative z-20 w-[250px] h-[320px] sm:w-[290px] sm:h-[370px] md:w-[360px] md:h-[470px] rounded-sm overflow-hidden border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.55)] rotate-[-5deg]"
            initial={{ opacity: 0, y: 36, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -5 }}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.12 }}
          >
            <Image
              src="/newton-profile.png"
              alt="Newton Frank"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),rgba(0,0,0,0.05))]" />
          </motion.div>

          {/* main title */}
          <motion.div
            className="absolute z-30 left-1/2 -translate-x-1/2 top-1/2 -translate-y-[38%] md:-translate-y-[36%] w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="px-2 text-[17vw] sm:text-[15vw] md:text-[10.5vw] leading-[0.9] tracking-[-0.05em] font-black uppercase">
              NEWTON
            </h1>
          </motion.div>

          {/* small metadata */}
          <motion.div
            className="absolute z-30 left-0 bottom-[24%] md:bottom-[23%] text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/75 font-mono"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p>Creative Developer</p>
            <p className="mt-1 text-white/55">Since 2019</p>
          </motion.div>

          <motion.div
            className="absolute z-30 right-0 bottom-[24%] md:bottom-[23%]"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="#work"
              className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/80 hover:text-white transition-colors"
            >
              Next Project
              <ChevronsRight size={14} />
            </a>
          </motion.div>
        </div>

        {/* bottom minimal controls */}
        <motion.div
          className="flex items-center justify-center gap-5 text-[10px] md:text-xs uppercase tracking-[0.22em] font-mono text-white/75"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
        >
          <a href="#about" className="hover:text-white transition-colors">
            Menu
          </a>
          <span className="h-px w-12 bg-white/25" />
          <a
            href="#contact"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            Contact <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

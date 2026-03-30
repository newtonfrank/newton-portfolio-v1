"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CSSProperties, useRef, useState } from "react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Technical" },
  { href: "#design", label: "Design" },
  { href: "#stack", label: "Skills" },
];

const quickLinks = [
  { href: "https://linkedin.com/in/newtonfrank", label: "LinkedIn" },
  { href: "https://github.com/newtonfrank", label: "GitHub" },
];

export function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const [isHoveringHeadline, setIsHoveringHeadline] = useState(false);
  const [activeLine, setActiveLine] = useState<"top" | "bottom">("top");

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 340, damping: 34 });
  const springY = useSpring(cursorY, { stiffness: 340, damping: 34 });
  const imageOffsetX = useMotionValue(0);
  const imageOffsetY = useMotionValue(0);
  const imageRotate = useMotionValue(0);
  const imageSpringX = useSpring(imageOffsetX, { stiffness: 220, damping: 28 });
  const imageSpringY = useSpring(imageOffsetY, { stiffness: 220, damping: 28 });
  const imageSpringRotate = useSpring(imageRotate, { stiffness: 220, damping: 28 });

  const getLineStyle = (isActive: boolean): CSSProperties => ({
    fontFamily: isActive
      ? '"Londrina Solid", "Arial Black", sans-serif'
      : '"Londrina Outline", "Arial Black", sans-serif',
    fontWeight: isActive ? 900 : 400,
    color: isActive ? "#0f141d" : "#606770",
    WebkitFontSmoothing: "antialiased",
    textRendering: "geometricPrecision",
    transition: "color 180ms ease, font-family 180ms ease",
  });

  const handleHeadlineMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = headlineRef.current?.getBoundingClientRect();
    if (!rect) return;

    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const normalizedX = (localX / rect.width - 0.5) * 2;
    const normalizedY = (localY / rect.height - 0.5) * 2;

    cursorX.set(localX - 33);
    cursorY.set(localY - 33);
    setActiveLine(localY < rect.height * 0.52 ? "top" : "bottom");
    imageOffsetX.set(normalizedX * 22);
    imageOffsetY.set(normalizedY * 14);
    imageRotate.set(normalizedX * 2.2);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-[#f2f2f2] pb-10 pt-5 md:pb-12 md:pt-8">
      <div className="section-container !max-w-[1680px] min-h-[90vh] px-8 md:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[1540px]">
          <motion.header
            className="relative flex items-center justify-between gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <a
              href="#home"
              className="inline-flex items-center text-[clamp(2.6rem,5.2vw,6rem)] font-black leading-none tracking-[-0.05em] text-[#090d14]"
            >
              Newto
              <span className="relative">
                n
                <span className="absolute -right-1 top-2 h-2 w-2 rounded-full bg-[#3b82f6] md:h-2.5 md:w-2.5" />
              </span>
              <span className="ml-1 text-[#f43f5e]">.</span>
            </a>

            <div
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <nav className="flex items-center gap-9 text-[clamp(1rem,1.22vw,1.5rem)] text-[#2c3138]">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} className="transition-colors hover:text-black">
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3 text-sm text-[#8a8d93]">
                {quickLinks.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-black">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="mailto:newtonfrank@outlook.in"
              className="rounded-[10px] border border-black bg-[#111111] px-4 py-2.5 text-[clamp(0.72rem,0.9vw,1rem)] font-medium text-white shadow-[0_6px_16px_rgba(0,0,0,0.25)] transition-colors hover:bg-black md:px-6 md:py-3"
            >
              newtonfrank@outlook.in
            </a>
          </motion.header>

          <div className="relative mx-auto mt-10 flex min-h-[72vh] w-full max-w-[1540px] flex-col items-center md:mt-12 md:min-h-[78vh]">
            <motion.p
              className="text-center text-[clamp(1.1rem,1.9vw,2.5rem)] text-[#30343c]"
              style={{ fontFamily: "var(--font-poppins)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Frontend developer focused on real-time dashboards, scalable UI systems, and polished user flows.
            </motion.p>

            <motion.div
              ref={headlineRef}
              className="relative z-10 mt-6 w-full select-none text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              onMouseEnter={() => setIsHoveringHeadline(true)}
              onMouseLeave={() => {
                setIsHoveringHeadline(false);
                setActiveLine("top");
                imageOffsetX.set(0);
                imageOffsetY.set(0);
                imageRotate.set(0);
              }}
              onMouseMove={handleHeadlineMove}
            >
              <div className="relative inline-block leading-none">
                <span
                  className="invisible text-[clamp(4.2rem,13.4vw,14.9rem)] font-normal tracking-[-0.03em]"
                  style={{ fontFamily: '"Londrina Solid", "Arial Black", sans-serif', fontWeight: 900 }}
                >
                  Frontend Developer
                </span>
                <motion.span
                  className="absolute inset-0 text-[clamp(4.2rem,13.4vw,14.9rem)] font-normal tracking-[-0.03em]"
                  style={getLineStyle(activeLine === "top")}
                >
                  Frontend Developer
                </motion.span>
              </div>

              <div className="-mt-3 relative inline-block leading-none">
                <span
                  className="invisible text-[clamp(4rem,12.6vw,14.1rem)] font-normal tracking-[-0.03em]"
                  style={{ fontFamily: '"Londrina Solid", "Arial Black", sans-serif', fontWeight: 900 }}
                >
                  &amp; Product Designer
                </span>
                <motion.span
                  className="absolute inset-0 text-[clamp(4rem,12.6vw,14.1rem)] font-normal tracking-[-0.03em]"
                  style={getLineStyle(activeLine === "bottom")}
                >
                  &amp; Product Designer
                </motion.span>
              </div>

              <motion.div
                className="pointer-events-none absolute left-0 top-0 z-40"
                style={{ x: springX, y: springY }}
                animate={{ scale: isHoveringHeadline ? 1 : 0.65, opacity: isHoveringHeadline ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
                  <ArrowUpRight size={30} strokeWidth={2.5} className="text-black" />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[62vh] w-[300px] -translate-x-1/2 md:h-[70vh] md:w-[420px]"
              style={{ x: imageSpringX, y: imageSpringY, rotate: imageSpringRotate }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
            >
              <Image src="/newton-profile.png" alt="Newton Frank" fill priority className="object-contain object-bottom grayscale" />
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f2f2f2] to-transparent" />
            </motion.div>

            <motion.div
              className="relative z-30 mt-auto flex w-full items-end justify-between pb-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.34 }}
            >
              <p
                className="max-w-[400px] text-[clamp(1.25rem,2.1vw,2.7rem)] leading-[1.2] text-[#2d323a]"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                based in Tumkur, Karnataka, India.
              </p>

              <div className="hidden items-center gap-7 text-sm text-[#8a8f97] md:flex" style={{ fontFamily: "var(--font-poppins)" }}>
                <span>React.js</span>
                <span>Next.js</span>
                <span>AWS</span>
                <span>Solidity</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { site, socials } from "@/content/site";

const linkedIn = socials.find((s) => s.label === "LinkedIn")!;

export function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2600);
  };

  return (
    <section id="contact" className="bg-black py-24 text-white md:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
          className="grid gap-14 md:grid-cols-[1fr_1.1fr]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Let&apos;s Collaborate</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl" style={{ fontFamily: "var(--font-poppins)" }}>
              Let&apos;s Build
              <span className="block text-[#60A5FA]">Your Next Product</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/70">
              I&apos;m open to frontend engineering, product UI work, and dashboard-focused projects. Reach out and
              I&apos;ll get back quickly.
            </p>

            <div className="mt-8 space-y-2 text-sm text-white/70">
              <p>Email: {site.email}</p>
              <p>Location: {site.location}</p>
              <p>LinkedIn: {linkedIn.href.replace(/^https?:\/\//, "")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <input
                required
                type="text"
                placeholder="Your Name"
                className="w-full border-0 border-b border-white/30 bg-transparent pb-3 text-sm text-white placeholder:text-white/45 focus:border-[#60A5FA] focus:outline-none"
              />
            </div>
            <div>
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full border-0 border-b border-white/30 bg-transparent pb-3 text-sm text-white placeholder:text-white/45 focus:border-[#60A5FA] focus:outline-none"
              />
            </div>
            <div>
              <textarea
                required
                rows={4}
                placeholder="Tell me about your project"
                className="w-full resize-none border-0 border-b border-white/30 bg-transparent pb-3 text-sm text-white placeholder:text-white/45 focus:border-[#60A5FA] focus:outline-none"
              />
            </div>

            <button type="submit" className="blue-pill mt-3 gap-2">
              {sent ? "Message Sent" : "Send Message"}
              {!sent && <ArrowRight size={14} />}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

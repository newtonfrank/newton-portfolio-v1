"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { site, socials } from "@/content/site";

const iconFor: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

export function Footer() {
  return (
    <footer className="bg-black pb-10 pt-8 text-white">
      <div className="section-container border-t border-white/15 pt-8">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <p className="text-sm text-white/60">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>

          <div className="flex items-center gap-3">
            {socials.map((social) => {
              const Icon = iconFor[social.label];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[#60A5FA] hover:text-[#60A5FA]"
                  aria-label={social.label}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

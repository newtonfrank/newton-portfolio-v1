"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { Github, Linkedin, Mail, Twitter, Home } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Footer = () => {
    return (
        <section className="relative h-[50vh] bg-black flex flex-col justify-center items-center py-20">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-neutral-950 z-0 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h2 className="text-5xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 mb-8">
                    Let&apos;s Talk.
                </h2>
                <p className="text-neutral-400 max-w-lg mb-10 text-lg">
                    Have a project in mind? Let’s build something amazing together.
                </p>
                <Link
                    href="mailto:newtonfrank@outlook.in"
                    className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors mb-16"
                >
                    Get in touch
                </Link>
            </div>

            <div className="text-center text-neutral-600 mb-8 text-sm relative z-10">
                © {new Date().getFullYear()} Newton Frank F. Crafted with Next.js & Magic UI.
            </div>

            <div className="relative z-10 flex justify-center">
                <Dock className="mb-0 bg-neutral-900 border-neutral-800">
                    <DockIcon onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="p-3 cursor-pointer">
                            <Home className="h-8 w-8 text-neutral-400 hover:text-white transition-colors" />
                        </div>
                    </DockIcon>
                    <DockIcon>
                        <Link href="https://github.com/newtonfrank" target="_blank" className="p-3">
                            <Github className="h-8 w-8 text-neutral-400 hover:text-white transition-colors" />
                        </Link>
                    </DockIcon>
                    <DockIcon>
                        <Link href="https://linkedin.com/in/newtonfrank" target="_blank" className="p-3">
                            <Linkedin className="h-8 w-8 text-neutral-400 hover:text-white transition-colors" />
                        </Link>
                    </DockIcon>
                    <DockIcon>
                        <Link href="mailto:newtonfrank@outlook.in" className="p-3">
                            <Mail className="h-8 w-8 text-neutral-400 hover:text-white transition-colors" />
                        </Link>
                    </DockIcon>
                </Dock>
            </div>
        </section>
    );
};

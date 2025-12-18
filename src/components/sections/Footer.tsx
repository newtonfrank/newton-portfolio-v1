"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { Github, Linkedin, Mail, Twitter, Home } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Footer = () => {
    return (
        <section className="relative h-[20vh] bg-black flex flex-col justify-end pb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />

            <div className="text-center text-neutral-500 mb-8 text-sm relative z-10">
                © {new Date().getFullYear()} Newton Frank F. Crafted with Next.js & Magic UI.
            </div>

            <div className="relative z-10 flex justify-center">
                <Dock className="mb-0">
                    <DockIcon onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Home className="h-6 w-6 text-neutral-500 hover:text-white transition-colors" />
                    </DockIcon>
                    <DockIcon>
                        <Link href="https://github.com/newtonfrank" target="_blank">
                            <Github className="h-6 w-6 text-neutral-500 hover:text-white transition-colors" />
                        </Link>
                    </DockIcon>
                    <DockIcon>
                        <Link href="https://linkedin.com/in/newtonfrank" target="_blank">
                            <Linkedin className="h-6 w-6 text-neutral-500 hover:text-white transition-colors" />
                        </Link>
                    </DockIcon>
                    <DockIcon>
                        <Link href="mailto:newtonfrank@outlook.in">
                            <Mail className="h-6 w-6 text-neutral-500 hover:text-white transition-colors" />
                        </Link>
                    </DockIcon>
                </Dock>
            </div>
        </section>
    );
};

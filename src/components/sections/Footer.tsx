"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { Github, Linkedin, Mail, Home } from "lucide-react";
import Link from "next/link";
import React from "react";
import { TransmissionForm } from "./TransmissionForm";

export const Footer = () => {
    return (
        <section id="contact" className="relative min-h-screen bg-black flex flex-col justify-center items-center py-20 md:py-32 px-4">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-neutral-950 z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,255,255,0.03),transparent_50%)]" />

            <div className="relative z-10 w-full max-w-4xl">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-xs md:text-sm font-mono text-cyan-500 tracking-[0.3em] md:tracking-[0.5em] mb-4">COMMUNICATION_CHANNEL</h2>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6">UPLINK</h1>
                    <p className="text-neutral-400 max-w-lg mx-auto text-sm md:text-base">
                        Have a project in mind? Initialize a transmission and let's build something extraordinary together.
                    </p>
                </div>

                {/* Contact Form */}
                <TransmissionForm />

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-16" />

                {/* Social Links */}
                <div className="flex justify-center mb-8">
                    <Dock className="bg-neutral-900/50 border-neutral-800">
                        <DockIcon onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="p-3 cursor-pointer">
                                <Home className="h-6 w-6 md:h-8 md:w-8 text-neutral-400 hover:text-white transition-colors" />
                            </div>
                        </DockIcon>
                        <DockIcon>
                            <Link href="https://github.com/newtonfrank" target="_blank" className="p-3">
                                <Github className="h-6 w-6 md:h-8 md:w-8 text-neutral-400 hover:text-white transition-colors" />
                            </Link>
                        </DockIcon>
                        <DockIcon>
                            <Link href="https://linkedin.com/in/newtonfrank" target="_blank" className="p-3">
                                <Linkedin className="h-6 w-6 md:h-8 md:w-8 text-neutral-400 hover:text-white transition-colors" />
                            </Link>
                        </DockIcon>
                        <DockIcon>
                            <Link href="mailto:newtonfrank@outlook.in" className="p-3">
                                <Mail className="h-6 w-6 md:h-8 md:w-8 text-neutral-400 hover:text-white transition-colors" />
                            </Link>
                        </DockIcon>
                    </Dock>
                </div>

                {/* Copyright */}
                <div className="text-center text-neutral-600 text-xs md:text-sm font-mono">
                    <span className="text-neutral-700">&gt;</span> © {new Date().getFullYear()} Newton Frank F.
                    <span className="text-neutral-700 ml-2">// Built with Next.js & Motion</span>
                </div>
            </div>
        </section>
    );
};


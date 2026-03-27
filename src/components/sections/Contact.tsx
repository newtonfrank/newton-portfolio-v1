"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";

const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com/newtonfrank" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/newtonfrank" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/newtonfrank" }
];

export function Contact() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <section id="contact" className="relative py-32 bg-deep-space">
            <div className="section-container max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
                
                {/* Left side text */}
                <motion.div 
                    className="flex-1"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
                        Let's build<br/>something<br/><span className="text-transparent stroke-text italic" style={{ WebkitTextStroke: '2px #e50012' }}>great.</span>
                    </h2>
                    <p className="text-text-secondary max-w-md text-lg mb-12">
                        I'm currently available for freelance work and open to new opportunities. Reach out if you want to collaborate.
                    </p>

                    <div className="flex gap-4">
                        {socialLinks.map((social) => (
                            <a 
                              key={social.label} 
                              href={social.href} 
                              className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-white/70 hover:text-racing-red hover:border-racing-red transition-all"
                              target="_blank" rel="noreferrer"
                            >
                                <social.icon size={20} />
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Right side form */}
                <motion.div 
                    className="flex-1 w-full max-w-md mx-auto md:mx-0"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input 
                              type="text" 
                              required
                              placeholder="Your Name" 
                              className="w-full bg-surface/50 border-b-2 border-border/50 px-0 py-4 text-white placeholder-white/30 outline-none focus:border-racing-red transition-colors uppercase tracking-widest text-sm"
                            />
                        </div>
                        <div>
                            <input 
                              type="email" 
                              required
                              placeholder="Email Address" 
                              className="w-full bg-surface/50 border-b-2 border-border/50 px-0 py-4 text-white placeholder-white/30 outline-none focus:border-racing-red transition-colors uppercase tracking-widest text-sm"
                            />
                        </div>
                        <div>
                            <textarea 
                              required
                              placeholder="Tell me about your project" 
                              rows={4}
                              className="w-full bg-surface/50 border-b-2 border-border/50 px-0 py-4 text-white placeholder-white/30 outline-none focus:border-racing-red transition-colors resize-none uppercase tracking-widest text-sm"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-racing-red text-white font-bold py-4 rounded-xl mt-4 hover:bg-white hover:text-black transition-colors flex justify-center items-center gap-2 group tracking-widest uppercase"
                        >
                            {sent ? "Message Sent!" : "Send Message"}
                            {!sent && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </motion.div>

            </div>
        </section>
    );
}

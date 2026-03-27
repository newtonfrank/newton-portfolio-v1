"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";

const education = [
  { school: "Universitas Indonesia", degree: "Computer Science", date: "Sep 2016 - May 2019", score: "GPA: 3.84/4.00" },
  { school: "Hacktiv8 Indonesia", degree: "Full Stack Javascript", date: "Jan 2020 - Dec 2020", score: "Grade: 98/100" }
];

const experience = [
  { role: "Backend Developer", company: "Vayo", date: "Jan 2022 - Present", points: ["Refactoring backend into microservice architecture", "Setting up continuous delivery pipelines", "Daily deployment cycles to staging accounts for testing"] },
  { role: "Backend Engineer", company: "Traveloka", date: "Jan 2020 - Dec 2021", points: ["Collaborated with cross-functional teams to build new features", "Investigated and analyzed application bugs", "Optimized database queries for multi-region product architecture"] }
];

export function About() {
  return (
    <section id="about" className="relative py-32 bg-deep-space">
      <div className="section-container relative z-10">
        
        {/* Title Area */}
        <motion.div 
           className="flex flex-col items-center text-center mb-24"
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">
               Get to Know <span className="text-transparent stroke-text italic" style={{ WebkitTextStroke: '2px #e50012' }}>Me</span>
            </h2>
            <p className="max-w-2xl text-text-secondary text-sm md:text-base leading-relaxed">
               I'm a Full-Stack developer with a specific focus on backend development, complemented by front-end proficiency. I excel in building robust server-side applications, designing efficient APIs, and implementing databases.
            </p>
        </motion.div>

        {/* Education & Bootcamp Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
           {/* Ed 1 */}
           <motion.div 
               className="glass-card p-8 flex items-start gap-6 border border-border/50 hover:border-racing-red/50 transition-colors"
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
           >
              <div className="mt-1 p-3 rounded-full bg-white/5 text-racing-red">
                 <GraduationCap size={24} />
              </div>
              <div>
                 <h3 className="text-white font-bold text-lg mb-1 uppercase tracking-wider">Education</h3>
                 <div className="space-y-4 mt-6">
                    {education.map((item, i) => (
                      <div key={i} className="flex flex-col">
                         <span className="text-white text-sm font-semibold">{item.school} <span className="text-text-secondary font-normal ml-2">{item.date}</span></span>
                         <span className="text-racing-red text-xs mt-1 font-mono">{item.degree} • {item.score}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </motion.div>

           {/* Experience preview block */}
           <div className="flex flex-col justify-center">
               <motion.div 
                  className="bg-racing-red text-white font-black uppercase italic tracking-widest text-2xl md:text-4xl p-6 md:p-10 rounded-2xl transform md:-rotate-2 inline-block shadow-[0_0_40px_rgba(229,0,18,0.3)] self-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  viewport={{ once: true }}
               >
                  Experience
               </motion.div>
           </div>
        </div>

        {/* Detailed Experience Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {experience.map((exp, i) => (
              <motion.div 
                 key={i}
                 className="bg-surface/50 border border-border p-8 rounded-2xl hover:bg-surface hover:border-racing-red/30 transition-colors"
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
              >
                  <div className="flex justify-between items-start mb-6">
                     <div>
                         <span className="text-xs font-mono text-text-secondary block mb-2">{exp.date}</span>
                         <h4 className="text-lg font-bold text-white leading-tight uppercase tracking-wider">{exp.role}</h4>
                         <span className="text-racing-red text-sm mt-1 block font-mono">{exp.company}</span>
                     </div>
                     <div className="p-3 bg-white/5 rounded-full text-white/50">
                        <Briefcase size={20} />
                     </div>
                  </div>
                  <ul className="space-y-3">
                     {exp.points.map((pt, j) => (
                        <li key={j} className="text-sm text-text-secondary flex gap-3 items-start">
                           <span className="text-racing-red mt-1">▹</span>
                           <span className="leading-relaxed">{pt}</span>
                        </li>
                     ))}
                  </ul>
              </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
}

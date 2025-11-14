import { Menu, X, Github, Linkedin, Mail, ExternalLink, ArrowRight, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const projects = [
    {
      title: 'Unipix – Unified Free Stock Image Search Engine',
      description: 'Developed a web application that aggregates free stock images from Pexels, Unsplash, and Pixabay APIs, eliminating the need for users to visit multiple platforms. Implemented keyword-based search to fetch and display images dynamically, with redirection to the original source for downloads.',
      tags: ['React.js', 'API Integration', 'UI/UX Design'],
      imageUrl: '/unipix-screenshot.png'
    },
    {
      title: 'Secure Healthcare Data Sharing with Blockchain',
      description: 'Developed decentralized application using Ethereum and Solidity for secure healthcare data sharing. Implemented role-based access control through smart contracts for patients and healthcare providers. Built React-based frontend with Web3.js integration for seamless user interactions.',
      tags: ['Ethereum', 'Solidity', 'Web3.js', 'React'],
      imageUrl: '/helthcare-screenshot.png'
    },
    {
      title: 'Industrial IoT (IIoT) Dashboard',
      description: 'Engineered a comprehensive IIoT dashboard for real-time monitoring, historical analysis, and predictive maintenance of industrial machinery. Implemented a live data visualization module displaying high-frequency sensor streams with a 10-second auto-refresh for immediate operational insight.',
      tags: ['React.js', 'Data Visualization', 'Real-time Systems'],
      imageUrl: '/Industrial IoT (IIoT) Dashboard screenshot.png'
    },
    {
      title: 'Component-Based Design System',
      description: 'Architected and implemented a component-based design system in React, standardizing UI elements and streamlining the development process, which reduced future implementation time by 25%. Enhanced website visibility through SEO best practices.',
      tags: ['React', 'Design Systems', 'Performance'],
      imageUrl: '/component-based-screenshot.png'
    }
  ];

  const skills = [
    'JavaScript',
    'Python',
    'React.js',
    'Node.js',
    'Express',
    'REST APIs',
    'MongoDB',
    'MySQL',
    'TypeScript',
    'AWS (EC2, S3)',
    'Docker',
    'CI/CD',
    'Ethereum',
    'Solidity',
    'Web3.js',
    'UI/UX Design',
    'Figma',
    'Git & GitHub'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-950'
    }`}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-colors ${
          isDark ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white/80 border-neutral-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.a
              href="#home"
              className="text-xl font-bold tracking-tight"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Newton Frank F
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <motion.a
                href="#about"
                className={`text-sm transition-colors ${
                  isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
                }`}
                whileHover={{ y: -2 }}
              >
                About
              </motion.a>
              <motion.a
                href="#projects"
                className={`text-sm transition-colors ${
                  isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
                }`}
                whileHover={{ y: -2 }}
              >
                Projects
              </motion.a>
              <motion.a
                href="#skills"
                className={`text-sm transition-colors ${
                  isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
                }`}
                whileHover={{ y: -2 }}
              >
                Skills
              </motion.a>
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              <motion.a
                href="#contact"
                className="px-4 py-2 bg-yellow-500 text-neutral-950 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t overflow-hidden transition-colors ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="px-6 py-4 space-y-4">
              <a href="#about" className={`block transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
              }`} onClick={() => setMobileMenuOpen(false)}>
                About
              </a>
              <a href="#projects" className={`block transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
              }`} onClick={() => setMobileMenuOpen(false)}>
                Projects
              </a>
              <a href="#skills" className={`block transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
              }`} onClick={() => setMobileMenuOpen(false)}>
                Skills
              </a>
              <a href="#contact" className="block px-4 py-2 bg-yellow-500 text-neutral-950 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors text-center" onClick={() => setMobileMenuOpen(false)}>
                Get in Touch
              </a>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            style={{ opacity, scale }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`inline-block px-4 py-2 rounded-full text-sm mb-6 ${
                isDark ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              Available for freelance work
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Creative Developer
              </span>
              <br />
              <span className={isDark ? 'text-white' : 'text-neutral-950'}>& Designer</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-xl mb-8 max-w-2xl leading-relaxed mx-auto ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Crafting exceptional digital experiences with a focus on clean design,
              intuitive interfaces, and modern web technologies.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <motion.a
                href="#projects"
                className="px-6 py-3 bg-yellow-500 text-neutral-950 rounded-lg font-medium hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href="#contact"
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-neutral-200 text-neutral-950 hover:bg-neutral-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.a>
              <motion.a
                href="/Newton_Resume.pdf"
                download
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-neutral-200 text-neutral-950 hover:bg-neutral-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Resume
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 px-6 lg:px-8 transition-colors ${
        isDark ? 'bg-neutral-900/50' : 'bg-neutral-100/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
              <p className={`mb-4 leading-relaxed ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                I'm Newton Frank F, a passionate Frontend Developer with expertise in creating
                modern web applications using React.js and other cutting-edge technologies.
              </p>
              <p className={`mb-6 leading-relaxed ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Currently pursuing my BE in Computer Science at Sri Siddhartha School of Engineering,
                I've gained experience through internships at Smartchakra Private Limited and Scyara Group,
                where I developed responsive web applications and implemented component-based design systems.
              </p>
              <div className="flex gap-4">
                <motion.a
                  href="https://github.com/newtonfrank"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github size={20} />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/newtonfrank"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin size={20} />
                </motion.a>
                <motion.a
                  href="mailto:newtonfrank@outlook.in"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail size={20} />
                </motion.a>
                <motion.a
                  href="/Newton_Resume.pdf"
                  download
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xs">CV</span>
                </motion.a>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.img
                src="/newton-profile.jpg"
                alt="Newton Frank F Profile"
                className={`aspect-square rounded-2xl overflow-hidden object-cover ${
                  isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className={`max-w-2xl ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              A selection of my recent work showcasing various skills and technologies
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                  isDark ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-white hover:bg-neutral-50 shadow-lg'
                }`}
              >
                <motion.div
                  className={`aspect-video overflow-hidden ${
                    isDark ? 'bg-neutral-800' : 'bg-neutral-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className={`mb-4 leading-relaxed ${
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={tagIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: tagIndex * 0.1 }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                  <motion.a
                    href="#"
                    className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    View Project
                    <ExternalLink size={16} />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-20 px-6 lg:px-8 transition-colors ${
        isDark ? 'bg-neutral-900/50' : 'bg-neutral-100/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
            <p className={`max-w-2xl ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Technologies and tools I work with to bring ideas to life
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-6 rounded-xl transition-colors text-center cursor-default ${
                  isDark ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-white hover:bg-neutral-50 shadow-md'
                }`}
              >
                <p className="font-medium">{skill}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Let's Work Together
          </h2>
          <p className={`text-xl mb-8 leading-relaxed ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Have a project in mind? I'd love to hear about it and discuss how we can collaborate.
          </p>
          <motion.a
            href="mailto:newtonfrank@outlook.in"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 text-neutral-950 rounded-lg font-medium hover:bg-yellow-400 transition-colors text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail size={20} />
            Get in Touch
          </motion.a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-6 lg:px-8 border-t transition-colors ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-sm ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            © 2025 Newton Frank F. All rights reserved.
          </p>
          <div className="flex gap-6">
            <motion.a
              href="https://github.com/newtonfrank"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
              }`}
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/newtonfrank"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
              }`}
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              href="mailto:newtonfrank@outlook.in"
              className={`transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
              }`}
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Mail size={20} />
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

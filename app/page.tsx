'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import FloatingParticles from './components/FloatingParticles'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [trail, setTrail] = useState<{ x: number; y: number; opacity: number; scale: number }[]>([]);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame to throttle updates
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        
        // Add new point to trail with random scale
        setTrail(prevTrail => {
          const newPoint = { 
            x: e.clientX, 
            y: e.clientY, 
            opacity: 1,
            scale: Math.random() * 0.5 + 0.5 // Random scale between 0.5 and 1
          };
          // Reduce trail length from 24 to 10 points for better performance
          const updatedTrail = [newPoint, ...prevTrail.slice(0, 10)];
          return updatedTrail;
        });
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Fade out trail points with smoother animation, less frequent updates
    const fadeInterval = setInterval(() => {
      setTrail(prevTrail =>
        prevTrail.map(point => ({
          ...point,
          opacity: point.opacity > 0 ? point.opacity - 0.05 : 0, // Faster fade
          scale: point.scale * 0.95 // Faster scale reduction
        }))
      );
    }, 50); // Reduce update frequency from 16ms to 50ms

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(fadeInterval);
    };
  }, []);

  const cursorVariants: Variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      opacity: 1
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      opacity: 0.5,
      backgroundColor: "var(--primary)",
      mixBlendMode: "difference" as const
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormStatus('sent');
      form.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Magical Particle Trail */}
      {trail.map((point, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 pointer-events-none"
          style={{
            width: Math.max(4, 20 - index),
            height: Math.max(4, 20 - index),
            x: point.x - Math.max(2, 10 - index / 2),
            y: point.y - Math.max(2, 10 - index / 2),
            opacity: point.opacity * (1 - index / trail.length),
            background: `radial-gradient(circle at center, 
              rgba(168, 85, 247, ${0.8 - index * 0.03}),
              rgba(236, 72, 153, ${0.4 - index * 0.015}),
              rgba(239, 68, 68, ${0.2 - index * 0.01}))`,
            boxShadow: `
              0 0 ${10 + index}px rgba(168, 85, 247, ${0.3 - index * 0.01}),
              0 0 ${20 + index}px rgba(236, 72, 153, ${0.2 - index * 0.008}),
              0 0 ${30 + index}px rgba(239, 68, 68, ${0.1 - index * 0.004})
            `,
            filter: `blur(${Math.min(2, index * 0.2)}px)`,
            transform: `scale(${point.scale})`,
            zIndex: 9999
          }}
        />
      ))}

      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
          scale: cursorVariant === "hover" ? 1.5 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
        style={{
          width: 4,
          height: 4,
          background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153), rgb(239, 68, 68))',
          boxShadow: `
            0 0 10px rgba(168, 85, 247, 0.8),
            0 0 20px rgba(236, 72, 153, 0.6),
            0 0 30px rgba(239, 68, 68, 0.4)
          `,
          filter: 'blur(0.5px)'
        }}
      />

      {/* Cursor Ring */}
      <motion.div
        className="fixed rounded-full pointer-events-none z-40"
        animate={{
          x: mousePosition.x - 32,
          y: mousePosition.y - 32,
          scale: cursorVariant === "hover" ? 1.2 : 1,
          opacity: cursorVariant === "hover" ? 0.5 : 0.2
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        style={{
          width: 64,
          height: 64,
          border: '2px solid rgba(168, 85, 247, 0.2)',
          boxShadow: '0 0 15px rgba(236, 72, 153, 0.1) inset, 0 0 15px rgba(239, 68, 68, 0.1)'
        }}
      />

      {/* Outer Glow Ring */}
      <motion.div
        className="fixed w-12 h-12 rounded-full pointer-events-none z-30"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: cursorVariant === "hover" ? 1.5 : 1,
          opacity: cursorVariant === "hover" ? 0.5 : 0.2
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.03) 50%, rgba(239, 68, 68, 0.01) 100%)',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.1)'
        }}
      />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
          className={`bg-black/40 backdrop-blur-2xl border-b border-white/5 ${isScrolled ? 'shadow-lg' : ''}`}
        >
          <div className="container max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-14 sm:h-16 px-4 relative z-50">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Link href="/" className="block">
                  <span className="text-xl sm:text-2xl font-bold relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">MK.</span>
                    <motion.span
                      className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'Projects', href: '#projects' },
                  { name: 'Education', href: '#education' },
                  { name: 'Experience', href: '#experience' },
                  { name: 'Skills', href: '#skills' },
                  { name: 'Certifications', href: '#certifications' },
                  { name: 'Contact', href: '#contact' },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="relative px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 group"
                    >
                      {item.name}
                      <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-white/0 via-white/50 to-white/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="hidden md:block"
                >
                  <Link 
                    href="#contact"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 rounded-lg transition-all duration-200 backdrop-blur-lg border border-white/10"
                  >
                    <span>Hire Me</span>
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: 3 }}
                      transition={{ 
                        duration: 0.6, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/20 transition-colors backdrop-blur-lg"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <div className="flex flex-col items-center justify-center w-6 h-6">
                    <span className={`w-5 h-0.5 bg-white mb-1 transform transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <span className={`w-4 h-0.5 bg-white mb-1 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-5 h-0.5 bg-white transform transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0,
            y: isMenuOpen ? 0 : -20,
            display: isMenuOpen ? 'block' : 'none'
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/5"
        >
          <div className="container max-w-7xl mx-auto py-4 px-4">
            <div className="flex flex-col space-y-2">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Projects', href: '#projects' },
                { name: 'Education', href: '#education' },
                { name: 'Experience', href: '#experience' },
                { name: 'Skills', href: '#skills' },
                { name: 'Certifications', href: '#certifications' },
                { name: 'Contact', href: '#contact' },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="pt-2"
              >
                <Link 
                  href="#contact"
                  className="block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hire Me
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Add black blur overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[100px] pointer-events-none z-0" />

      {/* Animated Background Gradient with darker colors */}
      <motion.div
        className="fixed inset-0 z-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at var(--x) var(--y), rgba(0, 0, 0, 0.7) 0%, transparent 70%)',
            'radial-gradient(circle at var(--x) var(--y), rgba(0, 0, 0, 0.9) 0%, transparent 70%)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        style={{
          '--x': `${mousePosition.x}px`,
          '--y': `${mousePosition.y}px`
        } as any}
      />

      {/* Floating Particles with darker style */}
      <FloatingParticles />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center py-12 sm:py-16 overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center lg:text-left mt-8 sm:mt-0"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                
                {/* Content */}
                <div className="relative space-y-4 sm:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-red-500/40 text-white/90 text-xs sm:text-sm font-medium backdrop-blur-sm mx-auto lg:mx-0"
                  >
                    <motion.span
                      animate={{
                        opacity: [1, 0.5, 1],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                    />
                    Welcome to my portfolio
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  >
                    Hi, I'm{' '}
                    <span className="text-gradient relative inline-block">
                      Manikanta
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="absolute bottom-0 left-0 h-1 bg-primary/20"
                      />
                    </span>
                  </motion.h1>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground"
                  >
                    UI/UX Designer & Developer
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
                  >
                    Creating engaging digital experiences with expertise in UI/UX design, web development, and cybersecurity. 
                    Proficient in Figma, Adobe XD, Photoshop, and modern web technologies.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-wrap gap-4 justify-center lg:justify-start"
                  >
                    <Link 
                      href="#contact" 
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
                    >
                      Contact Me
                      <motion.span
                        initial={{ x: 0 }}
                        animate={{ x: 5 }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                        className="inline-block"
                      >
                        →
                      </motion.span>
                    </Link>
                    <Link 
                      href="#projects" 
                      className="px-6 py-3 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-red-500/20 text-white rounded-lg transition-all duration-200 border border-white/10 flex items-center gap-2 text-sm sm:text-base"
                    >
                      View Projects
                    </Link>
                  </motion.div>

                  {/* Social Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex items-center gap-4 pt-4 justify-center lg:justify-start"
                  >
                    {[
                      { icon: "💼", href: "https://www.linkedin.com/in/Manikanta-Lokanadhamm/" },
                      { icon: "🎨", href: "https://www.behance.net/Manikanta-Lokanadham" },
                      { icon: "📝", href: "https://mkedito.wordpress.com/" },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-red-500/20 flex items-center justify-center transition-all duration-200"
                      >
                        <span className="text-lg">{social.icon}</span>
                      </motion.a>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px] mx-auto order-first lg:order-last"
              >
                <div className="relative w-full aspect-square">
                  {/* Animated Background Rings */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="absolute inset-0 rounded-full border-4 border-primary/20"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute inset-4 sm:inset-8 rounded-full border-4 border-secondary/20"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  
                  {/* Rotating Gradient Ring */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary/30"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                  
                  {/* Profile Image */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="absolute inset-4 sm:inset-8 rounded-full overflow-hidden"
                    style={{ transform: 'translateZ(0)' }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src="/images/profile.jpg"
                        alt="Profile"
                        fill
                        sizes="(max-width: 768px) 250px, (max-width: 1024px) 300px, 400px"
                        priority
                        className="object-cover scale-110"
                      />
                    </div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-full h-full rounded-full bg-primary/20"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="w-full h-full rounded-full bg-primary/20"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section py-16 sm:py-24 relative overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-base sm:text-lg">
                Explore my portfolio of innovative projects showcasing expertise in UI/UX Design, Development and Graphic Design
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {/* Project cards with enhanced design */}
              {[
                {
                  title: 'Grandmas Kitchen Book Cover Design Using Photoshop',
                  description: 'A warm and homely eBook cover design for Grandmas Kitchen, featuring rustic textures, vintage fonts, and comforting food visuals that evoke nostalgic family memories.',
                  category: 'Graphic Design',
                  tech: 'Photoshop',
                  year: '2024',
                  type: 'Graphic Design',
                  image: '/portfolio/Projects/project1.jpg',
                  demoLink: 'https://www.behance.net/gallery/206340827/Grandmas-Kitchen-Book-Cover-Design-Using-Photoshop'
                },
                {
                  title: 'Zomato Social Media Poster Design Using Photoshop',
                  description: 'A bold and appetizing Zomato social media poster design created using Photoshop,',
                  category: 'Web Design',
                  tech: 'Photoshop',
                  year: '2024',
                  type: 'Social Media Poster Design',
                  image: '/portfolio/Projects/project2.jpg',
                  demoLink: 'https://www.behance.net/gallery/206343605/Zomato-Social-Media-Poster-Design-Using-Photoshop'
                },
                {
                  title: 'PAY WALLET - A DIGITAL PAYMENTS PLATFORM (CASE STUDY)',
                  description: 'An in-depth case study showcasing the user-centric design, seamless UI/UX flow, and secure transaction features of Pay Wallet, a modern digital payments platform crafted to enhance everyday financial convenience..',
                  category: 'Web Development',
                  tech: 'Figma',
                  year: '2024',
                  type: 'UI/UX Design',
                  image: '/portfolio/Projects/project3.jpg',
                  demoLink: 'https://www.behance.net/gallery/194718677/PAY-WALLET-A-DIGITAL-PAYMENTS-PLATFORM-(CASE-STUDY)'
                },
                {
                  title: 'Tri-Fold Broucher Design Using Photoshop',
                  description: 'A professionally crafted tri-fold brochure design using Photoshop, featuring clean layouts, high-quality visuals, and organized sections to effectively communicate brand identity and services.',
                  category: 'Graphic Design',
                  tech: 'Photoshop',
                  year: '2024',
                  type: 'Graphic Design',
                  image: '/portfolio/Projects/project4.jpg',
                  demoLink: 'https://www.behance.net/gallery/206345423/Tri-Fold-Broucher-Design-Using-Photoshop'
                },
                {
                  title: 'Subscription Management Dashboard Design',
                  description: 'A sleek and intuitive Subscription Management Dashboard design, showcasing real-time analytics, user-friendly navigation, and organized billing details—crafted to streamline user experience and simplify plan management.',
                  category: 'UI/UX Design',
                  tech: 'Figma',
                  year: '2024',
                  type: 'Dashboard Design',
                  image: '/portfolio/Projects/project5.png',
                  demoLink: 'https://www.behance.net/gallery/198328763/Subscription-Management-Dashboard-Design'
                },
                {
                  title: 'Web Banner Poster Design Using Photoshop',
                  description: 'A visually striking web banner poster design using Photoshop, featuring eye-catching graphics, bold typography, and a clear call-to-action to maximize online visibility and engagement.',
                  category: 'Web Design',
                  tech: 'Photoshop',
                  year: '2024',
                  type: 'Web Banner Design',
                  image: '/portfolio/Projects/project6.jpg',
                  demoLink: 'https://www.behance.net/gallery/206346845/Web-Banner-Poster-Design-Using-Photoshop'
                },
                {
                  title: 'DELICIOUS - CODING SAMURAI INTERNSHIP TASK',
                  description: 'A creative and functional web-based food ordering interface designed during the Coding Samurai internship, showcasing responsive UI/UX elements, interactive menus, and smooth user navigation for an enhanced digital dining experience.',
                  category: 'UI/UX Design',
                  tech: 'Figma',
                  year: '2024',
                  type: 'Web Design',
                  image: '/portfolio/Projects/project7.png',
                  demoLink: 'https://www.behance.net/gallery/194902239/DELICIOUS-CODING-SAMURAI-INTERNSHIP-TASK'
                },
                {
                  title: 'Cloud Storage Web Design',
                  description: 'A modern and minimalistic Cloud Storage Web Design featuring intuitive navigation, secure file management UI, and responsive layouts—crafted to offer a seamless and user-friendly cloud experience.',
                  category: 'Web Design',
                  tech: 'Figma',
                  year: '2024',
                  type: 'Web Design',
                  image: '/portfolio/Projects/project8.jpg',
                  demoLink: 'https://www.behance.net/gallery/186438603/Cloud-Storage-Web-Design'
                },
                {
                  title: 'Super Delicious Food All Time (Poster Design)',
                  description: 'A vibrant and mouth-watering poster design titled Super Delicious Food All Time, created to tempt taste buds with bold colors, irresistible food imagery, and playful typography that captures the joy of eating anytime.',
                  category: 'Graphic Design',
                  tech: 'Photoshop',
                  year: '2024',
                  type: 'Poster Design',
                  image: '/portfolio/Projects/project9.jpeg',
                  demoLink: 'https://www.behance.net/gallery/186955693/Super-Delicious-Food-All-Time-(Poster-Design)'
                },
                {
                  title: 'Delicious Food Delivery App Desgin 2023',
                  description: 'A sleek and modern Delicious Food Delivery App Design 2023, featuring an intuitive user interface, vibrant food visuals, smooth navigation, and real-time order tracking for an effortless and enjoyable food ordering experience.',
                  category: 'UI/UX Design',
                  tech: 'Figma',
                  year: '2023',
                  type: 'Web Design',
                  image: '/portfolio/Projects/project10.jpg',
                  demoLink: 'https://www.behance.net/gallery/186060199/Delicious-Food-Delivery-App-Desgin-2023'
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setCursorVariant("hover")}
                  onHoverEnd={() => setCursorVariant("default")}
                  className="group relative h-full transform-gpu"
                  style={{ perspective: "1000px" }}
                  onClick={() => window.open(project.demoLink, '_blank')}
                >
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 h-full">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={450}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-8 flex flex-col h-[calc(100%-18rem)]">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {project.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                          {project.tech}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 flex-grow text-base">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>{project.year}</span>
                          <span>•</span>
                          <span>{project.type}</span>
                        </div>
                        <Link 
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                          View Project
                          <motion.span
                            initial={{ x: 0 }}
                            animate={{ x: 5 }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                            className="inline-block"
                          >
                            →
                          </motion.span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="section py-16 sm:py-24 relative overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Education Journey</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                My academic background and qualifications that have shaped my professional path
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              {/* B.Tech */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl">🎓</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Bachelor of Technology
                          </h3>
                          <p className="text-lg font-semibold mt-1">Godavari Institute of Engineering & Technology</p>
                          <p className="text-muted-foreground">Computer Science & Engineering</p>
                        </div>
                        <div className="flex items-center">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">2021 - 2025</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-muted-foreground">
                          • Specializing in Computer Science with a focus on software development, UI/UX design, and web technologies
                        </p>
                        <p className="text-muted-foreground">
                          • Core team member of the college's technical club, organizing workshops and hackathons
                        </p>
                        <p className="text-muted-foreground">
                          • Completed projects in web development, machine learning, and mobile app development
                        </p>
                        <p className="text-muted-foreground">
                          • Participated in various coding competitions and technical events
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {['Web Development', 'UI/UX Design', 'Data Structures', 'Algorithms', 'Database Management'].map((skill) => (
                          <span key={skill} className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Intermediate */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                        <span className="text-3xl">🏫</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                            Intermediate Education
                          </h3>
                          <p className="text-lg font-semibold mt-1">Sri Chaitanya College of Education</p>
                          <p className="text-muted-foreground">Mathematics, Physics, Chemistry (MPC)</p>
                        </div>
                        <div className="flex items-center">
                          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/10">
                            2019 - 2021
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-muted-foreground">
                          • Achieved academic excellence with a strong foundation in mathematics and sciences
                        </p>
                        <p className="text-muted-foreground">
                          • Participated in various mathematics and science olympiads
                        </p>
                        <p className="text-muted-foreground">
                          • Active member of the science club and participated in science exhibitions
                        </p>
                        <p className="text-muted-foreground">
                          • Received merit scholarship for outstanding academic performance
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {['Mathematics', 'Physics', 'Chemistry', 'Problem Solving', 'Analytical Skills'].map((subject) => (
                          <span key={subject} className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* School */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl">📚</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Secondary Education
                          </h3>
                          <p className="text-lg font-semibold mt-1">Sai Vineeth Public School</p>
                          <p className="text-muted-foreground">SSC (10th Standard)</p>
                        </div>
                        <div className="flex items-center">
                          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/10">
                            2018 - 2019
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-muted-foreground">
                          • Graduated with distinction and received academic excellence award
                        </p>
                        <p className="text-muted-foreground">
                          • Class representative and active participant in school activities
                        </p>
                        <p className="text-muted-foreground">
                          • Won first prize in school-level science exhibition
                        </p>
                        <p className="text-muted-foreground">
                          • Member of the school's quiz team and debate club
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {['Sciences', 'Mathematics', 'English', 'Social Studies', 'Leadership'].map((subject) => (
                          <span key={subject} className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section py-16 sm:py-24 relative overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience Journey</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                My professional experience and projects that have shaped my career path
              </p>
            </motion.div>

              <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              {/* UI/UX & Graphic Designer Trainee */}
                    <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl">🎨</span>
                      </div>
                    </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          UI/UX & Graphic Designer Trainee
                        </h3>
                        <p className="text-lg font-semibold mt-1">Techwing</p>
                        <p className="text-muted-foreground">Trainee</p>
                        <p className="text-sm text-muted-foreground mt-1">Rajahmundry, Andhra Pradesh, India • On-site</p>
                    </div>
                      <div className="flex items-center">
                        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/10">
                          Jan 2024 - Present • 11 mos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* UI/UX Designer */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <span className="text-3xl">💻</span>
              </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                          UI/UX Designer
                        </h3>
                        <p className="text-lg font-semibold mt-1">SPARK+ Technologies</p>
                        <p className="text-muted-foreground">Internship</p>
                        <p className="text-sm text-muted-foreground mt-1">Goa, India • Remote</p>
                      </div>
                      <div className="flex items-center">
                        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/10">
                          May 2024 - Aug 2024 • 4 mos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI & Cybersecurity Intern */}
                    <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl">🔒</span>
                      </div>
                    </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          Artificial Intelligence And Cyber Security Intern
                        </h3>
                        <p className="text-lg font-semibold mt-1">AIMER Society</p>
                        <p className="text-muted-foreground">Artificial Intelligence Medical and Engineering Researchers Society • Internship</p>
                        <p className="text-sm text-muted-foreground mt-1">Vijayawada, Andhra Pradesh, India • Remote</p>
                      </div>
                      <div className="flex items-center">
                        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/10">
                          May 2024 - Jul 2024 • 3 mos
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                        Artificial Intelligence (AI)
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                        Cybersecurity
                      </span>
                    </div>
                  </div>
                </div>
                    </div>
                  </motion.div>

            {/* UI/UX Designing Intern */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl">🎨</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          UI/UX Designing Intern
                        </h3>
                        <p className="text-lg font-semibold mt-1">Coding Samurai</p>
                        <p className="text-muted-foreground">Internship</p>
                        <p className="text-sm text-muted-foreground mt-1">Remote</p>
                      </div>
                      <div className="flex items-center">
                        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/10">
                          Mar 2024 - Apr 2024 • 2 mos
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                        User Interface Designer
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                        User Experience Designer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Web Development Using Django Framework Intern */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl">🌐</span>
          </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          Web Development Using Django Framework Intern
                        </h3>
                        <p className="text-lg font-semibold mt-1">Andhra Pradesh State Skill Development Corporation (APSSDC)</p>
                        <p className="text-muted-foreground">Internship</p>
                        <p className="text-sm text-muted-foreground mt-1">Remote</p>
                      </div>
                      <div className="flex items-center">
                        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/10">
                          May 2023 - Jul 2023 • 3 mos
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                        HTML Scripting
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                        Cascading Style Sheets (CSS)
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
                        Django
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section py-16 sm:py-24 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Expertise</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              A comprehensive overview of my technical capabilities and professional skills
            </p>
          </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Design Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-3xl p-6 border border-white/10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent rounded-3xl opacity-25" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 rounded-xl rotate-45 transform origin-center" />
                        <div className="absolute inset-0.5 bg-background rounded-xl rotate-45" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">🎨</span>
              </div>
                      </div>
                      <h3 className="text-xl font-bold">Design Skills</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'UI Design', icon: '🎨' },
                        { name: 'UX Design', icon: '🎯' },
                        { name: 'Wireframing', icon: '📐' },
                        { name: 'Prototyping', icon: '🔄' },
                        { name: 'User Research', icon: '🔍' },
                        { name: 'Visual Design', icon: '✨' },
                        { name: 'Design Systems', icon: '🎪' },
                        { name: 'Interaction', icon: '🖱️' },
                        { name: 'Typography', icon: '📝' },
                        { name: 'Color Theory', icon: '🎨' },
                        { name: 'Responsive', icon: '📱' },
                        { name: 'Accessibility', icon: '♿' }
                ].map((skill, index) => (
            <motion.div
                    key={skill.name}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative p-3 rounded-lg border border-white/5 hover:border-primary/20 transition-colors duration-300 flex items-center gap-3">
                            <span className="text-lg">{skill.icon}</span>
                            <span className="text-sm font-medium">{skill.name}</span>
                </div>
                  </motion.div>
                ))}
              </div>
                  </div>
              </div>
            </motion.div>

            {/* Technical Skills */}
            <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-bl from-primary/5 via-background to-secondary/5 rounded-3xl p-6 border border-white/10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent rounded-3xl opacity-25" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-primary opacity-20 rounded-xl rotate-45 transform origin-center" />
                        <div className="absolute inset-0.5 bg-background rounded-xl rotate-45" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">💻</span>
                </div>
              </div>
                      <h3 className="text-xl font-bold">Technical Skills</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'Frontend Dev', icon: '⚡' },
                        { name: 'Backend Dev', icon: '🔧' },
                        { name: 'React.js', icon: '⚛️' },
                        { name: 'Next.js', icon: '▲' },
                        { name: 'Node.js', icon: '🟢' },
                        { name: 'TypeScript', icon: '📘' },
                        { name: 'JavaScript', icon: '💛' },
                        { name: 'HTML/CSS', icon: '🎨' },
                        { name: 'Python', icon: '🐍' },
                        { name: 'MongoDB', icon: '🍃' },
                        { name: 'SQL', icon: '💾' },
                        { name: 'Git', icon: '📝' }
                ].map((skill, index) => (
                  <motion.div
                    key={skill.name}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative p-3 rounded-lg border border-white/5 hover:border-secondary/20 transition-colors duration-300 flex items-center gap-3">
                            <span className="text-lg">{skill.icon}</span>
                            <span className="text-sm font-medium">{skill.name}</span>
              </div>
            </motion.div>
                ))}
              </div>
          </div>
        </div>
          </motion.div>

              {/* Tools & Software */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-tr from-secondary/5 via-background to-primary/5 rounded-3xl p-6 border border-white/10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent rounded-3xl opacity-25" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 rounded-xl rotate-45 transform origin-center" />
                        <div className="absolute inset-0.5 bg-background rounded-xl rotate-45" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">🛠️</span>
                </div>
              </div>
                      <h3 className="text-xl font-bold">Tools & Software</h3>
              </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'VS Code', icon: '📝' },
                        { name: 'Figma', icon: '🎨' },
                        { name: 'Adobe XD', icon: '✨' },
                        { name: 'Photoshop', icon: '🖼️' },
                        { name: 'Illustrator', icon: '✏️' },
                        { name: 'After Effects', icon: '🎬' },
                        { name: 'GitHub', icon: '🐱' },
                        { name: 'Postman', icon: '📮' },
                        { name: 'Docker', icon: '🐳' },
                        { name: 'AWS', icon: '☁️' },
                        { name: 'Firebase', icon: '🔥' },
                        { name: 'Vercel', icon: '▲' }
                      ].map((tool, index) => (
            <motion.div
                          key={tool.name}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative p-3 rounded-lg border border-white/5 hover:border-primary/20 transition-colors duration-300 flex items-center gap-3">
                            <span className="text-lg">{tool.icon}</span>
                            <span className="text-sm font-medium">{tool.name}</span>
                </div>
            </motion.div>
                      ))}
              </div>
                  </div>
              </div>
          </motion.div>
            </div>
        </div>
      </section>

      {/* Licenses & Certifications Section */}
      <section id="certifications" className="section py-16 sm:py-24 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Licenses & Certifications</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Professional certifications and licenses that validate my expertise
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { name: 'HP Certified - Design Thinking', issuer: 'HP LIFE', date: '2024', issueDate: 'May 2024', credentialId: 'fb9ecc7e-5649-487b-be3f-24f5b0e4e8c3', credentialUrl: 'https://drive.google.com/file/d/1ZWtuwB7kL_UBr-Bn7Ql84iPUMyfQ0rLt/view?usp=drivesdk' },
              { name: 'Communication Skills', issuer: 'TCS iON', date: '2024', issueDate: 'Feb 2024', credentialId: '91306-25923563-1016', credentialUrl: 'https://drive.google.com/file/d/1i3jOR7KrMa_mGpWP_bTVjcEHcQ_R1ppK/view?usp=drive_link' },
              { name: 'Introduction to Cloud', issuer: 'IBM', date: '2024', issueDate: 'Mar 2024', credentialId: 'IBM CC0101EN', credentialUrl: 'https://www.credly.com/badges/13a9dc7b-c291-45bb-a127-8b439a236da8/linked_in_profile' },
              { name: 'Cloud Essentials - V3', issuer: 'IBM', date: '2024', issueDate: 'Mar 2024', credentialId: 'IBM CC0103EN', credentialUrl: 'https://www.credly.com/badges/83806a7f-abe8-46ac-9a9f-0d8068347519/linked_in_profile' },
              { name: 'AWS Knowledge: Cloud Essentials', issuer: 'Amazon Web Services (AWS)', date: '2024', issueDate: 'Mar 2024', credentialId: '', credentialUrl: 'https://www.credly.com/badges/49671f58-8ef9-456d-9504-a2647a0e8788/linked_in_profile' },
              { name: 'DIGITAL SKILLS: USER EXPERIENCE', issuer: 'Accenture', date: '2023', issueDate: 'Dec 2023', credentialId: 'f7prqws', credentialUrl: 'https://www.futurelearn.com/certificates/f7prqws' },
              { name: 'BP - Digital Design & UX Job Simulation', issuer: 'Forage', date: '2023', issueDate: 'Dec 2023', credentialId: 'ahWtkmSnwXoTMRmGi', credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/bp/uwvgu23YiJ366ipgH_bp_3csBQnXpicarC6vHg_1702812421229_completion_certificate.pdf' },
              { name: 'Accenture North America - Product Design Job Simulation', issuer: 'Forage', date: '2023', issueDate: 'Dec 2023', credentialId: 'C5A3ejWZmn2G7rvgs', credentialUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Accenture%20North%20America/NqLZqrXRDvfkqHRKG_Accenture%20North%20America_3csBQnXpicarC6vHg_1702116158947_completion_certificate.pdf' },
              { name: 'Masterclass on Amazon Web Services (ML Ops)', issuer: 'Pantechlearning', date: '2023', issueDate: 'Jul 2023', credentialId: 'PAN-AWS-PART-270', credentialUrl: 'https://www.pantechelearning.com/JULY23/PAN_AWS_PART_270.pdf' },
              { name: 'Programming Fundamentals using Python', issuer: 'Infosys Springboard', date: '2023', issueDate: 'May 2023', credentialId: '1-9856d00e-3cfd-479d-b65b-29df5e2a71e5', credentialUrl: 'https://www.infosys.com/springboard/verify/1-9856d00e-3cfd-479d-b65b-29df5e2a71e5' },
              { name: 'Java Fullstack Masterclass', issuer: 'APSSDC', date: '2022', issueDate: 'Sep 2022', credentialId: 'PEL-PART-JFSMC1353', credentialUrl: 'https://www.pantechelearning.com/SEP22/PEL-PART-JFSMC1353.pdf' },
              { name: 'The Fundamentals Of Digital Marketing', issuer: 'Google Digital Garage', date: '2019', issueDate: 'Dec 2019', credentialId: 'EV5-26B-QVT', credentialUrl: 'https://drive.google.com/file/d/0B3Yy-sCh8b5mX0c2bC1rZTZhMnVRcjZaUkFWRkN3UG96V2pj/view?usp=sharing&resourcekey=0-mQPfBfIGkNsFOWyerROt3g' },
              { name: 'Adobe Photoshop Complete Mastery Course', issuer: 'Udemy', date: '2019', issueDate: 'Aug 2019', credentialId: 'UC-JKOQFOJ4', credentialUrl: 'https://www.udemy.com/certificate/UC-JKOQFOJ4/' }
            ].map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group h-full"
              >
                <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-3xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent rounded-3xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 rounded-xl rotate-45 transform origin-center group-hover:opacity-30 transition-opacity duration-300" />
                        <div className="absolute inset-0.5 bg-background rounded-xl rotate-45" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">🏆</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <p className="text-xs text-muted-foreground">Credential ID: {cert.credentialId}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 flex flex-col gap-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs bg-white/5 text-muted-foreground">
                          {cert.date}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Issued: {cert.issueDate}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-primary border border-primary/20 rounded-xl transition-all duration-300 flex items-center gap-2 group"
                          onClick={() => {
                            window.open(cert.credentialUrl, '_blank');
                          }}
                        >
                          <span>Show Credentials</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="group-hover:text-primary/80"
                          >
                            →
                          </motion.span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section py-16 sm:py-24 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">Get in Touch</h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
              Let's discuss how we can work together to create something amazing
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Contact Form Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative bg-gradient-to-br from-background/50 via-background/30 to-background/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl" />
              
              {/* Form Content */}
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Send a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <label htmlFor="name" className="text-sm font-medium text-white/70">Name</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/5 via-background to-secondary/5 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg placeholder:text-white/30"
                        placeholder="Your name"
                      />
                    </motion.div>

                    {/* Email Input */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <label htmlFor="email" className="text-sm font-medium text-white/70">Email</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/5 via-background to-secondary/5 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg placeholder:text-white/30"
                        placeholder="your@email.com"
                      />
                    </motion.div>
                  </div>

                  {/* Message Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label htmlFor="message" className="text-sm font-medium text-white/70">Message</label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/5 via-background to-secondary/5 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg resize-none placeholder:text-white/30"
                      placeholder="Your message..."
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full px-8 py-4 text-lg font-medium bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-primary border border-primary/20 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: formStatus === 'sending' ? 1 : 1.02 }}
                    whileTap={{ scale: formStatus === 'sending' ? 1 : 0.98 }}
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : formStatus === 'sent' ? (
                      <>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xl"
                        >
                          ✓
                        </motion.span>
                        Message Sent!
                      </>
                    ) : formStatus === 'error' ? (
                      <>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xl"
                        >
                          ⚠️
                        </motion.span>
                        Error Sending
                      </>
                    ) : (
                      <>
                        Send Message
                        <motion.span
                          initial={{ x: 0 }}
                          animate={{ x: 5 }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                          }}
                          className="inline-block"
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Contact Info */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: "📱", label: "Phone", value: "+91 8309241420", href: "tel:+918309241420" },
                    { icon: "📧", label: "Email", value: "lokanadhammanikanta123@gmail.com", href: "mailto:lokanadhammanikanta123@gmail.com" },
                  ].map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-background to-secondary/5 border border-white/10 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm text-white/50">{item.label}</p>
                        <p className="text-base font-medium text-white group-hover:text-primary transition-colors">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8 flex items-center justify-center sm:justify-start gap-4">
                  {[
                    { icon: "💼", href: "https://www.linkedin.com/in/Manikanta-Lokanadhamm/", label: "LinkedIn" },
                    { icon: "🎨", href: "https://www.behance.net/Manikanta-Lokanadham", label: "Behance" },
                    { icon: "📝", href: "https://mkedito.wordpress.com/", label: "Blog" },
                  ].map((social, index) => (
                    <motion.a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + (index * 0.1) }}
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 group relative"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{social.icon}</span>
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {social.label}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>

    {/* Modern Footer Design */}
    <footer className="relative z-10 py-12 bg-gradient-to-b from-black to-gray-900 backdrop-blur-2xl border-t border-transparent overflow-hidden">
      {/* Animated Background with Multiple Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.5),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.5),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.5),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(0,0,0,0.5),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.3),rgba(0,0,0,0.3))]" />
      </div>
      
      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/10 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Brand Section - Spans 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-3">
              <Link href="/" className="inline-block group">
                <span className="text-5xl font-bold relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">MK.</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Crafting digital experiences with passion and precision. Specializing in UI/UX design, web development, and cybersecurity solutions.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {[
                { icon: "💼", href: "https://www.linkedin.com/in/Manikanta-Lokanadhamm/", label: "LinkedIn" },
                { icon: "🎨", href: "https://www.behance.net/Manikanta-Lokanadham", label: "Behance" },
                { icon: "📝", href: "https://mkedito.wordpress.com/", label: "Blog" },
              ].map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="group relative w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm border border-transparent"
              >
                  <span className="text-xl">{social.icon}</span>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </div>
            
            {/* Language Selector */}
            <div className="pt-2">
              <div className="relative inline-block">
                <select className="appearance-none bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 pr-8">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="hi">हिंदी</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Section - Spans 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Home', href: '#home', icon: '🏠' },
                  { name: 'Projects', href: '#projects', icon: '💼' },
                  { name: 'Contact', href: '#contact', icon: '📞' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-transparent hover:border-purple-500/20 transition-colors duration-300"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                      <p className="text-sm text-white">View {item.name.toLowerCase()} section</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contact Info Section - Spans 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Get in Touch
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-transparent hover:border-purple-500/20 transition-colors duration-300">
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-white">urstrulymani@yahoo.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-transparent hover:border-purple-500/20 transition-colors duration-300">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm text-white">Srikakulam, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-transparent hover:border-purple-500/20 transition-colors duration-300">
                  <span className="text-xl">⏰</span>
                  <div>
                    <p className="text-xs text-muted-foreground">Availability</p>
                    <p className="text-sm text-white">Open to opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Section - Spans 3 columns */}
          <div className="lg:col-span-3 space-y-4 lg:pl-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Stay Updated
              </h3>
              <p className="text-muted-foreground text-sm">
                Subscribe to my newsletter for the latest updates, insights, and creative inspiration.
              </p>
              <form className="space-y-2" onSubmit={(e) => {
                e.preventDefault();
                // Show success message
                const successMsg = document.getElementById('newsletter-success');
                if (successMsg) {
                  successMsg.classList.remove('hidden');
                  setTimeout(() => {
                    successMsg.classList.add('hidden');
                  }, 3000);
                }
              }}>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 rounded-l-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-transparent focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all text-sm"
                    style={{ width: 'calc(100% - 100px)' }}
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-0 top-0 h-full px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-r-xl hover:opacity-90 transition-opacity shadow-lg hover:shadow-purple-500/20"
                    style={{ width: '100px', height: '100%' }}
                    type="submit"
                  >
                    Subscribe
                  </motion.button>
                </div>
                {/* Success Message */}
                <div id="newsletter-success" className="hidden mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400 text-center">
                  Thank you for subscribing! 🎉
                </div>
              </form>
              
              {/* Social Proof */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-xs">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Join 100+ subscribers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Manikanta. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
} 
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Add shimmer animation keyframes
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
`;

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Add the keyframes to the document
    const style = document.createElement('style');
    style.innerHTML = shimmerKeyframes;
    document.head.appendChild(style);
    
    // Track mouse movement for the gradient effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => {
      clearTimeout(timer);
      // Clean up the style element
      document.head.removeChild(style);
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 overflow-hidden"
        >
          {/* Primary Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-red-500/5" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:24px_24px] animate-grid" />
          
          {/* Noise Texture */}
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02]" />
          
          {/* Animated Background Gradient that follows mouse */}
          <motion.div
            className="fixed inset-0 z-0 opacity-40"
            animate={{
              background: [
                'radial-gradient(circle at var(--x) var(--y), rgba(168, 85, 247, 0.15) 0%, transparent 80%)',
                'radial-gradient(circle at var(--x) var(--y), rgba(236, 72, 153, 0.15) 0%, transparent 80%)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            style={{
              '--x': `${mousePosition.x}px`,
              '--y': `${mousePosition.y}px`
            } as any}
          />
          
          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.2, 0.4]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 -left-20 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.2, 0.4]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-0 -right-20 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute -bottom-20 left-40 w-80 h-80 bg-red-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
          
          {/* Enhanced Floating Particles */}
          <div className="fixed inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${i % 3 === 0 ? 'bg-purple-500/10' : i % 3 === 1 ? 'bg-pink-500/10' : 'bg-red-500/10'}`}
                style={{
                  width: Math.random() * 6 + 2 + 'px',
                  height: Math.random() * 6 + 2 + 'px',
                  filter: `blur(${Math.random() * 1}px)`
                }}
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  opacity: Math.random() * 0.5 + 0.3
                }}
                animate={{
                  x: [
                    Math.random() * 100 + '%',
                    Math.random() * 100 + '%',
                    Math.random() * 100 + '%',
                  ],
                  y: [
                    Math.random() * 100 + '%',
                    Math.random() * 100 + '%',
                    Math.random() * 100 + '%',
                  ],
                  opacity: [
                    Math.random() * 0.5 + 0.3,
                    Math.random() * 0.3 + 0.1,
                    Math.random() * 0.5 + 0.3,
                  ]
                }}
                transition={{
                  duration: Math.random() * 15 + 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
          
          <div className="relative flex flex-col items-center z-10">
            {/* Animated Profile Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-48 h-48 mb-6"
            >
              {/* Rotating Border */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-primary/20"
              />
              
              {/* Additional decorative spinning ring */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] rounded-full border-2 border-dashed border-pink-500/30"
                style={{ borderRadius: '50%' }}
              />
              
              {/* Profile Image */}
              <div className="absolute inset-4 rounded-full overflow-hidden bg-primary/10">
                <Image
                  src="/images/profile.jpg"
                  alt="Profile"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/profile.svg'; // Fallback to SVG if image fails to load
                  }}
                />
              </div>

              {/* Floating decoration dots */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-purple-500/30"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-pink-500/30"
              />
            </motion.div>

            {/* Name with gradient text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-2"
            >
              Manikanta Lokanadham
            </motion.h1>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-white/70 mb-6"
            >
              UI/UX Designer & Developer
            </motion.h2>

            {/* Loading Bar with enhanced effects */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 220 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-2 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 relative"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-600 rounded-full relative"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite'
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
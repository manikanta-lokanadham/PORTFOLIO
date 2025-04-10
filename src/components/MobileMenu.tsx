'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface MobileMenuProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const menuItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

const menuVariants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  closed: { opacity: 0, x: 20 },
  open: { opacity: 1, x: 0 },
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        <motion.div
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
          className="w-6 h-6"
        >
          <motion.span
            className="absolute h-0.5 w-6 bg-current transform"
            style={{ y: '-50%', top: '35%' }}
            variants={{
              closed: { rotate: 0 },
              open: { rotate: 45 },
            }}
          />
          <motion.span
            className="absolute h-0.5 w-6 bg-current"
            style={{ y: '-50%', top: '50%' }}
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
          />
          <motion.span
            className="absolute h-0.5 w-6 bg-current transform"
            style={{ y: '-50%', top: '65%' }}
            variants={{
              closed: { rotate: 0 },
              open: { rotate: -45 },
            }}
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
          >
            <nav className="flex flex-col items-center justify-center h-full">
              {menuItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  variants={itemVariants}
                  className="relative text-2xl font-medium py-3 text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 dark:bg-violet-400"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 
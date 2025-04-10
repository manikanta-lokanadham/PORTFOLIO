'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">MK</span>
          <span className="hidden font-bold sm:inline-block">
            Manikanta
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground/60 hover:text-foreground"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 md:hidden">
            <nav className="container py-4 flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "transition-colors hover:text-foreground/80 text-sm font-medium",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </nav>
    </header>
  )
} 
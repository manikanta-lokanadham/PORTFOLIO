import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/src/components/ThemeProvider'
import { Navbar } from '@/src/components/Navbar'
import SplashScreen from '@/src/components/SplashScreen'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Manikanta - UI/UX Designer & Developer',
  description: 'Portfolio website showcasing my work as a UI/UX Designer and Developer.',
  keywords: ['UI/UX Design', 'Web Development', 'Cybersecurity', 'Portfolio', 'Digital Design', 'Figma', 'Adobe XD'],
  authors: [{ name: 'Manikanta Lokanadham' }],
  creator: 'Manikanta Lokanadham',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mkedito.wordpress.com',
    title: 'Manikanta Lokanadham - UI/UX Designer & Developer',
    description: 'Portfolio showcasing UI/UX design and development work',
    siteName: 'Manikanta Lokanadham Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manikanta Lokanadham - UI/UX Designer & Developer',
    description: 'Portfolio showcasing UI/UX design and development work',
    creator: '@manikanta',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-purple-500/20 selection:text-purple-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Background Elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-red-500/5" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            
            {/* Noise Texture */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02]" />
            
            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <SplashScreen />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
} 
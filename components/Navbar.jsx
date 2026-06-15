'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile navbar on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' }
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-warmcream/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl tracking-wider text-charcoal group-hover:text-gold transition-colors font-bold italic uppercase">
              Hayagriva Interiors<span className="text-gold font-normal not-italic">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-widest hover:text-gold transition-colors relative py-1 ${
                    isActive ? 'text-gold' : 'text-charcoal'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gold"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-charcoal hover:bg-gold text-white text-xs font-semibold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Contact</span>
              <ArrowRight size={12} />
            </Link>
          </nav>

          {/* Hamburger Menu Trigger */}
          <button
            className="md:hidden text-charcoal focus:outline-none p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-warmcream border-b border-gray-100 shadow-xl px-6 py-8 flex flex-col gap-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold uppercase tracking-wider py-2 border-b border-gray-100/60 ${
                      isActive ? 'text-gold font-bold' : 'text-charcoal'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              )}
              <Link
                href="/contact"
                className="w-full text-center py-3.5 bg-charcoal hover:bg-gold text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition-colors mt-2"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

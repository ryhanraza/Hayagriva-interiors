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

  const isDarkHeroPage = pathname === '/' || pathname === '/about'
  const showDarkNavbar = scrolled || !isDarkHeroPage

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          showDarkNavbar 
            ? 'bg-charcoal-luxury/90 backdrop-blur-lg shadow-xl border-b border-white/5 py-3.5' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif text-base sm:text-lg md:text-2xl tracking-widest text-beige-luxury group-hover:text-gold-metallic transition-colors font-bold uppercase">
              Hayagriva Interiors<span className="text-gold-metallic font-normal">.</span>
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
                  className={`text-xs font-semibold uppercase tracking-widest hover:text-gold-metallic transition-colors relative py-1 transition-all ${
                    isActive ? 'text-gold-metallic' : 'text-beige-luxury/70'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-metallic"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-white/10 hover:bg-gold-metallic text-beige-luxury hover:text-black-luxury border border-white/15 hover:border-gold-metallic text-xs font-semibold uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2 shadow-sm"
            >
              <span>Contact</span>
              <ArrowRight size={12} />
            </Link>
          </nav>

          {/* Hamburger Menu Trigger */}
          <button
            className="md:hidden text-beige-luxury focus:outline-none p-1 hover:text-gold-metallic transition-colors"
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
            className="fixed inset-x-0 top-[70px] z-40 bg-black-luxury/95 backdrop-blur-xl border-b border-white/5 shadow-2xl px-6 py-8 flex flex-col gap-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold uppercase tracking-widest py-3.5 border-b border-white/5 transition-colors ${
                      isActive ? 'text-gold-metallic font-bold' : 'text-beige-luxury/70 hover:text-gold-metallic'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <Link
                href="/contact"
                className="w-full text-center py-4 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 mt-4 shadow-lg shadow-gold-metallic/20"
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

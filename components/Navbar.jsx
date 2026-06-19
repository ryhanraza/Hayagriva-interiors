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
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact Us', href: '/contact' }
  ]

  const isDarkHeroPage = pathname === '/' || pathname === '/about'
  const showDarkNavbar = scrolled || !isDarkHeroPage

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          showDarkNavbar 
            ? 'bg-theme-black/95 backdrop-blur-lg shadow-xl border-b border-white/5 py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-nav.png?v=2"
              alt="Hayagriva Interiors"
              className="h-8 sm:h-9 md:h-10 w-auto transition-all duration-300 group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
            {links.map((link) => {
              const isActive = pathname === link.href
              const isContact = link.href === '/contact'
              if (isContact) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-5 py-2.5 bg-theme-gold hover:bg-white text-theme-black font-bold text-[11px] uppercase tracking-wider rounded transition-all duration-300 shadow-md shadow-theme-gold/10"
                  >
                    {link.name}
                  </Link>
                )
              }
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-semibold uppercase tracking-wider hover:text-theme-gold transition-colors relative py-1 transition-all ${
                    isActive ? 'text-theme-gold' : 'text-theme-offwhite/80'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-theme-gold"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Hamburger Menu Trigger */}
          <button
            className="md:hidden text-theme-offwhite focus:outline-none p-1 hover:text-theme-gold transition-colors"
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
            className="fixed inset-0 z-50 bg-theme-black px-6 py-6 flex flex-col justify-between md:hidden"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-nav.png"
                  alt="Hayagriva Interiors"
                  className="h-8 w-auto"
                />
              </Link>
              <button
                className="text-theme-offwhite hover:text-theme-gold transition-colors p-1"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex flex-col justify-center gap-6 my-auto">
              {links.map((link) => {
                const isActive = pathname === link.href
                const isContact = link.href === '/contact'
                if (isContact) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-sm font-bold uppercase tracking-wider text-center py-3 bg-theme-gold text-theme-black rounded transition-all duration-300"
                    >
                      {link.name}
                    </Link>
                  )
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-bold uppercase tracking-wider text-center py-2 transition-colors ${
                      isActive ? 'text-theme-gold' : 'text-theme-offwhite/85 hover:text-theme-gold'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

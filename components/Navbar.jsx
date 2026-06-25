'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ChevronDown,
  PencilRuler,
  Ruler,
  Hammer,
  Wrench,
  ChefHat,
  Bed,
  Sofa
} from 'lucide-react'

/* ---------- Mega menu data ---------- */
const megaMenus = {
  Services: [
    {
      title: 'DESIGN',
      items: [
        { icon: PencilRuler, name: 'Interior Design', desc: 'Concept-to-completion design rooted in your space and taste.', href: '/services/living-room' },
        { icon: Ruler, name: 'Space Planning', desc: 'Optimised layouts that maximise flow, light and function.', href: '/services/space-planning' },
        { icon: Bed, name: 'Bedroom Interiors', desc: 'Calm suites with luxury headboards and ambient lighting.', href: '/services/bedroom' }
      ]
    },
    {
      title: 'EXECUTION',
      items: [
        { icon: Hammer, name: 'Turnkey Projects', desc: 'End-to-end delivery — design, build and handover.', href: '/services/turnkey-solutions' },
        { icon: Wrench, name: 'Renovation', desc: 'Refresh or rebuild with minimal disruption.', href: '/services/renovation' }
      ]
    },
      {
      title: 'SPECIALTY',
      items: [
        { icon: ChefHat, name: 'Modular Kitchen', desc: 'Ergonomic kitchens engineered for daily use.', href: '/services/modular-kitchen' }
      ]
    }
  ],
  Portfolio: [
    {
      title: 'PROJECT CATEGORIES',
      items: [
        { icon: ChefHat, name: 'Kitchen', desc: 'Modular setups, stone countertops & smart storage.', href: '/portfolio?filter=Kitchen' },
        { icon: Bed, name: 'Bedroom', desc: 'Luxury headboards, walk-in closets & ambient lighting.', href: '/portfolio?filter=Bedroom' },
        { icon: Sofa, name: 'Living Room', desc: 'Entertainment units, feature walls & bespoke seating.', href: '/portfolio?filter=Living+Room' }
      ]
    }
  ]
}

/* ---------- Mega menu panel (desktop) ---------- */
function MegaMenu({ columns, cta }) {
  return (
    <div className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 w-screen ${columns.length === 1 ? 'max-w-md' : 'max-w-5xl'}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl shadow-black/10 ring-1 ring-black/5 overflow-hidden"
      >
        <div className={`grid gap-x-8 gap-y-2 p-8 ${columns.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-3'}`}>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold tracking-[0.2em] text-theme-gold/90 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-1">
                {col.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-theme-black/[0.04]"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-black/5 text-theme-black transition-colors duration-150 group-hover:bg-theme-gold group-hover:text-white">
                          <Icon size={18} strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-theme-black leading-tight">
                            {item.name}
                          </span>
                          <span className="block text-xs text-gray-500 mt-0.5 leading-snug">
                            {item.desc}
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom CTA strip */}
        <div className="flex items-center justify-between bg-theme-black px-8 py-4">
          <p className="text-sm font-medium text-theme-offwhite">
            {cta?.text || 'Not sure where to start? Book a free consultation.'}
          </p>
          <Link
            href={cta?.href || '/contact'}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-theme-gold hover:text-white transition-colors"
          >
            {cta?.btn || 'Get Started'} <ChevronDown size={14} className="-rotate-90" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

/* ---------- Mobile accordion item ---------- */
function MobileMegaItem({ label, columns, pathname }) {
  const [expanded, setExpanded] = useState(false)
  const isOpen = (pathname.startsWith('/services') && label === 'Services') || (pathname.startsWith('/portfolio') && label === 'Portfolio')

  useEffect(() => {
    if (isOpen) setExpanded(true)
  }, [isOpen])

  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-bold uppercase tracking-wider text-theme-offwhite/85">
          {label}
        </span>
        <ChevronDown
          size={18}
          className={`text-theme-gold transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-4">
              {columns.map((col) => (
                <div key={col.title}>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-theme-gold/80 mb-2">
                    {col.title}
                  </p>
                  <ul className="space-y-1">
                    {col.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 py-1.5 text-theme-offwhite/75 hover:text-theme-gold transition-colors"
                          >
                            <Icon size={16} className="text-theme-gold/70" />
                            <span className="text-sm">{item.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null) // 'Services' | 'Resources' | null
  const closeTimer = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setActiveMenu(null)
  }, [pathname])

  const openMenu = (key) => {
    clearTimeout(closeTimer.current)
    setActiveMenu(key)
  }
  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services', mega: 'Services' },
    { name: 'Portfolio', href: '/portfolio', mega: 'Portfolio' },
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
            <Image
              src="/images/logo-nav.png"
              alt="Hayagriva Interiors"
              width={160}
              height={40}
              priority
              style={{ height: 'auto' }}
              className="h-8 sm:h-9 md:h-10 w-auto transition-all duration-300 group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
            {links.map((link) => {
              const isActive = pathname === link.href
              const isContact = link.href === '/contact'

              if (link.mega) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => openMenu(link.mega)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider hover:text-theme-gold transition-colors relative py-1 ${
                        isActive ? 'text-theme-gold' : 'text-theme-offwhite/80'
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          activeMenu === link.mega ? 'rotate-180' : ''
                        }`}
                      />
                    </Link>

                    <AnimatePresence>
                      {activeMenu === link.mega && (
                        <MegaMenu
                          columns={megaMenus[link.mega]}
                          cta={link.mega === 'Portfolio'
                            ? { text: 'Browse all our completed projects.', href: '/portfolio', btn: 'View All Projects' }
                            : undefined}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

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
                  className={`text-[11px] font-semibold uppercase tracking-wider hover:text-theme-gold transition-colors relative py-1 ${
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
            className="fixed inset-0 z-50 bg-theme-black px-6 py-6 flex flex-col md:hidden overflow-y-auto"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                <Image
                  src="/images/logo-nav.png"
                  alt="Hayagriva Interiors"
                  width={120}
                  height={32}
                  style={{ height: 'auto' }}
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
            <div className="flex flex-col gap-1 my-6">
              {links.map((link) => {
                const isActive = pathname === link.href
                const isContact = link.href === '/contact'

                if (link.mega) {
                  return (
                    <MobileMegaItem
                      key={link.name}
                      label={link.name}
                      columns={megaMenus[link.mega]}
                      pathname={pathname}
                    />
                  )
                }

                if (isContact) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-sm font-bold uppercase tracking-wider text-center py-3 mt-4 bg-theme-gold text-theme-black rounded transition-all duration-300"
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
                    className={`text-sm font-bold uppercase tracking-wider py-3 border-b border-white/5 transition-colors ${
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

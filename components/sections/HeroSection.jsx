'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ChevronRight, CheckCircle2, ArrowRight, User } from 'lucide-react'
import PhoneInput, { getCountryByIso, buildFullPhone } from '../PhoneInput'
import { cfg, arr } from './section-utils'

// Hero section. Two visual modes driven by `layout` + custom_json.showLeadForm:
//   - "split"  : image on the right, text on the left (about-style hero)
//   - default  : full-bleed background image (home-style hero)
// On the home page the lead form is shown on the right column when
// custom_json.showLeadForm is truthy. Admins toggle this in the editor.
export default function HeroSection({ section }) {
  const showLeadForm = cfg(section, 'showLeadForm', false)
  const isSplit = section.layout === 'split'
  const bgImg =
    arr(section.images)[0]?.url ||
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1800&auto=format&fit=crop'

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-charcoal text-white overflow-hidden pt-32 pb-20 px-6">
      {/* Background image + overlay (hidden in split mode) */}
      {!isSplit && !showLeadForm && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImg}
            alt={section.title || 'Hero Background'}
            fill
            priority
            className="object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>
      )}

      {/* Split mode decorative glow */}
      {isSplit && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className={showLeadForm ? 'lg:col-span-7 space-y-8 text-left' : isSplit ? 'lg:col-span-6 space-y-8 text-left' : 'lg:col-span-8 space-y-8 text-left'}>
          {section.subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-gold text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles size={12} className="text-gold animate-pulse" />
              <span>{section.subtitle}</span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight font-extrabold text-white"
          >
            {renderTitle(section)}
          </motion.h1>

          {(section.description || section.content) && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-beige/70 text-sm sm:text-base max-w-lg leading-relaxed"
            >
              {section.description || section.content}
            </motion.p>
          )}

          {arr(section.buttons).length > 0 && !showLeadForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {arr(section.buttons).map((btn, bIdx) => (
                <HeroButton key={bIdx} btn={btn} primary={bIdx === 0} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Right column: lead form (home) or split image (about) */}
        {showLeadForm ? (
          <LeadFormCard />
        ) : isSplit ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative h-[400px] md:h-[480px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            <Image src={bgImg} alt={section.title || 'Hero Visual'} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}

// Renders the title, allowing an optional gold-italic accent line via
// custom_json.titleAccent. Keeps the home hero's signature "Dream Space." look.
function renderTitle(section) {
  const accent = cfg(section, 'titleAccent', '')
  if (!accent) return section.title
  return (
    <>
      {section.title} <br />
      <span className="text-gradient-gold italic font-normal">{accent}</span>
    </>
  )
}

// A hero button. The first (primary) can dispatch the consultation event when
// its link is the magic value "#consultation", matching the original home hero.
function HeroButton({ btn, primary }) {
  const isConsultation = btn.link === '#consultation'
  const base = primary
    ? 'px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-lg shadow-gold/20'
    : 'px-8 py-4 border border-white/20 hover:border-gold text-white hover:text-gold font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2'

  if (isConsultation) {
    return (
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event('open-consultation'))}
        className={base}
      >
        {btn.text}
      </button>
    )
  }
  return (
    <Link href={btn.link || '#'} className={base}>
      <span>{btn.text}</span>
      {!primary && <ChevronRight size={14} />}
    </Link>
  )
}

// Inline lead form on the home hero. Self-contained (no parent state needed)
// so the section is fully driven by its own data and stays editable.
function LeadFormCard() {
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [country, setCountry] = useState(getCountryByIso('IN'))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fullPhone = buildFullPhone(country, formData.phone)
    if (!fullPhone) {
      alert(`Please enter a valid ${country.name} phone number (${country.len} digits).`)
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: fullPhone, email: '', message: '' })
      })
      if (res.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', phone: '' })
      } else {
        alert('There was an issue submitting your request. Please try again.')
      }
    } catch {
      alert('Network error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 30 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-serif font-bold text-white">Get Design Estimates</h3>
        <p className="text-xs text-beige/60">Share your details and receive a customized layout sketch.</p>
      </div>

      {isSubmitted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 text-gold border border-gold/20 flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-serif text-white text-base font-bold">Request Received!</h4>
          <p className="text-xs text-beige/70 leading-relaxed max-w-[240px] mx-auto">
            Thank you! Our lead coordinator will call you back within 24 hours.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/25 text-white placeholder-white/30 text-xs transition-all"
            />
          </div>
          <div className="relative">
            <PhoneInput
              value={formData.phone}
              onChange={(digits) => setFormData({ ...formData, phone: digits })}
              onCountryChange={setCountry}
              placeholder="Your Phone Number"
              variant="dark"
              defaultIso="IN"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gold hover:bg-white text-charcoal font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Get Free Quote</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      )}
      <div className="text-[10px] text-center text-beige/45 font-mono">
        ⚡ Over 500+ consultations booked this month
      </div>
    </motion.div>
  )
}
